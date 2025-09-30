import React, { useState, useEffect } from 'react';
import { getRentalProperties, updateRentalPropertyStatus, deleteRentalProperty } from '../../firebase/firestore';

const RentalApproval = () => {
  const [rentalProperties, setRentalProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadRentalProperties();
  }, [filterStatus]);

  const loadRentalProperties = async () => {
    setLoading(true);
    try {
      const filters = filterStatus !== 'all' ? { status: filterStatus } : {};
      const result = await getRentalProperties(filters);
      
      if (result.success) {
        setRentalProperties(result.data);
      } else {
        console.error('Failed to load rental properties:', result.error);
      }
    } catch (error) {
      console.error('Error loading rental properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (rentalId, newStatus, adminNotes = '') => {
    try {
      const result = await updateRentalPropertyStatus(rentalId, newStatus, adminNotes);
      
      if (result.success) {
        // Update local state
        setRentalProperties(prev => 
          prev.map(rental => 
            rental.id === rentalId 
              ? { ...rental, status: newStatus, adminNotes, reviewedAt: new Date() }
              : rental
          )
        );
        
        // Reload to get updated data
        loadRentalProperties();
      } else {
        alert('Failed to update status: ' + result.error);
      }
    } catch (error) {
      alert('Error updating status: ' + error.message);
    }
  };

  const handleDelete = async (rentalId) => {
    if (!window.confirm('Are you sure you want to delete this rental property? This action cannot be undone.')) {
      return;
    }

    try {
      const result = await deleteRentalProperty(rentalId);
      
      if (result.success) {
        // Remove from local state
        setRentalProperties(prev => prev.filter(rental => rental.id !== rentalId));
        alert('Rental property deleted successfully!');
      } else {
        alert('Failed to delete rental property: ' + result.error);
      }
    } catch (error) {
      alert('Error deleting rental property: ' + error.message);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
      approved: { color: 'bg-green-100 text-green-800', text: 'Approved' },
      rejected: { color: 'bg-red-100 text-red-800', text: 'Rejected' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date.toDate ? date.toDate() : date).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Rental Property Approvals</h3>
        
        {/* Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark focus:border-brand-dark"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved (Can Delete)</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {rentalProperties.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No rental properties found.
        </div>
      ) : (
        <div className="space-y-4">
          {rentalProperties.map((rental) => (
            <div key={rental.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">
                    {rental.propertyInfo?.name || 'Unnamed Property'}
                  </h4>
                  <p className="text-sm text-gray-600">
                    Submitted by {rental.agentInfo?.name} ({rental.agentInfo?.email})
                  </p>
                  <p className="text-sm text-gray-500">
                    Submitted: {formatDate(rental.submittedAt)}
                  </p>
                </div>
                <div className="text-right">
                  {getStatusBadge(rental.status)}
                  <p className="text-sm text-gray-600 mt-1">
                    ${rental.propertyInfo?.pricePerNight}/night
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h5 className="font-medium text-gray-700 mb-2">Property Details</h5>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><span className="font-medium">Type:</span> {rental.propertyInfo?.type}</p>
                                                   <p><span className="font-medium">Address:</span> {rental.propertyInfo?.address}</p>
                    <p><span className="font-medium">Guests:</span> {rental.accommodation?.maxGuests}</p>
                    <p><span className="font-medium">Bedrooms:</span> {rental.accommodation?.bedrooms}</p>
                    <p><span className="font-medium">Bathrooms:</span> {rental.accommodation?.bathrooms}</p>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium text-gray-700 mb-2">Rates</h5>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><span className="font-medium">In Season (1-4):</span> ${rental.rates?.inSeason?.oneToFour}</p>
                    <p><span className="font-medium">In Season (5-6):</span> ${rental.rates?.inSeason?.fiveToSix}</p>
                    <p><span className="font-medium">Off Season (1-4):</span> ${rental.rates?.offSeason?.oneToFour}</p>
                    <p><span className="font-medium">Off Season (5-6):</span> ${rental.rates?.offSeason?.fiveToSix}</p>
                  </div>
                </div>
              </div>

              {rental.description && (
                <div className="mb-4">
                  <h5 className="font-medium text-gray-700 mb-2">Description</h5>
                  <p className="text-sm text-gray-600">{rental.description}</p>
                </div>
              )}

              {rental.amenities && rental.amenities.length > 0 && (
                <div className="mb-4">
                  <h5 className="font-medium text-gray-700 mb-2">Amenities</h5>
                  <div className="flex flex-wrap gap-2">
                    {rental.amenities.map((amenity, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {rental.status === 'pending' && (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleStatusUpdate(rental.id, 'approved')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      const notes = prompt('Enter rejection reason (optional):');
                      if (notes !== null) {
                        handleStatusUpdate(rental.id, 'rejected', notes);
                      }
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Reject
                  </button>
                </div>
              )}

              {rental.status === 'approved' && (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleDelete(rental.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete Property
                  </button>
                </div>
              )}

              {rental.status !== 'pending' && rental.adminNotes && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <h6 className="font-medium text-gray-700 mb-1">Admin Notes:</h6>
                  <p className="text-sm text-gray-600">{rental.adminNotes}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Reviewed: {formatDate(rental.reviewedAt)}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RentalApproval;

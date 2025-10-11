import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Save, 
  X,
  Plus
} from 'lucide-react';

const PortfolioItemForm = ({ item, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'residential',
    subcategory: 'villa',
    status: 'for-sale',
    price: '',
    soldPrice: '',
    soldDate: '',
    location: {
      address: '',
      quarter: '',
      country: 'US',
      subdivision: ''
    },
    images: [],
    description: '',
    features: {
      beds: '',
      baths: '',
      sqft: '',
      pool: false
    },
    amenities: [],
    overview: {},
    details: {},
    mls: '',
    type: 'Land'
  });

  const [currentAmenity, setCurrentAmenity] = useState('');
  const [currentImage, setCurrentImage] = useState('');

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title || '',
        category: item.category || 'residential',
        subcategory: item.subcategory || 'villa',
        status: item.status || 'for-sale',
        price: item.price || '',
        soldPrice: item.soldPrice || '',
        soldDate: item.soldDate ? new Date(item.soldDate.toDate?.() || item.soldDate).toISOString().split('T')[0] : '',
        location: {
          address: item.location?.address || '',
          quarter: item.location?.quarter || '',
          country: item.location?.country || 'US',
          subdivision: item.location?.subdivision || ''
        },
        images: item.images || [],
        description: item.description || '',
        features: {
          beds: item.features?.beds || '',
          baths: item.features?.baths || '',
          sqft: item.features?.sqft || '',
          pool: item.features?.pool || false
        },
        amenities: item.amenities || [],
        overview: item.overview || {},
        details: item.details || {},
        mls: item.mls || '',
        type: item.type || 'Land'
      });
    }
  }, [item]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleAddAmenity = () => {
    if (currentAmenity.trim()) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, currentAmenity.trim()]
      }));
      setCurrentAmenity('');
    }
  };

  const handleRemoveAmenity = (index) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index)
    }));
  };

  const handleAddImage = () => {
    if (currentImage.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, currentImage.trim()]
      }));
      setCurrentImage('');
    }
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Clean up data before submission
    const cleanData = {
      ...formData,
      price: formData.price || 'Price on request',
      soldDate: formData.soldDate ? new Date(formData.soldDate) : null
    };

    // Remove empty fields for land category
    if (formData.category === 'land') {
      delete cleanData.features;
    }

    onSubmit(cleanData);
  };

  const getSubcategoryOptions = () => {
    switch (formData.category) {
      case 'residential':
        return [
          { value: 'villa', label: 'Villa' },
          { value: 'cottage', label: 'Cottage' },
          { value: 'house', label: 'House' },
          { value: 'combo', label: 'Combo Package' }
        ];
      case 'commercial':
        return [
          { value: 'office', label: 'Office' },
          { value: 'retail', label: 'Retail' },
          { value: 'warehouse', label: 'Warehouse' },
          { value: 'mixed', label: 'Mixed Use' }
        ];
      case 'land':
        return [
          { value: 'land', label: 'Land' },
          { value: 'lot', label: 'Building Lot' },
          { value: 'farm', label: 'Farm Land' }
        ];
      default:
        return [];
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onCancel}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Portfolio</span>
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {item ? 'Edit Portfolio Item' : 'Add Portfolio Item'}
            </h2>
            <p className="text-gray-600">
              {item ? 'Update portfolio item details' : 'Create a new portfolio item'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Property title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price *
            </label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="$1,500,000 or Price on request"
            />
          </div>
        </div>

        {/* Category and Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="land">Land</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type *
            </label>
            <select
              name="subcategory"
              value={formData.subcategory}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {getSubcategoryOptions().map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status *
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="for-sale">For Sale</option>
              <option value="recent-sale">Recent Sale</option>
            </select>
          </div>
        </div>

        {/* Sold Information (if recent sale) */}
        {formData.status === 'recent-sale' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sold Price
              </label>
              <input
                type="text"
                name="soldPrice"
                value={formData.soldPrice}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="$1,450,000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sold Date
              </label>
              <input
                type="date"
                name="soldDate"
                value={formData.soldDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        {/* Location */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Location</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                name="location.address"
                value={formData.location.address}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Street address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quarter
              </label>
              <input
                type="text"
                name="location.quarter"
                value={formData.location.quarter}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Coral Bay, Cruz Bay, etc."
              />
            </div>
          </div>
        </div>

        {/* Features (for residential/commercial) */}
        {formData.category !== 'land' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Features</h3>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bedrooms
                </label>
                <input
                  type="number"
                  name="features.beds"
                  value={formData.features.beds}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bathrooms
                </label>
                <input
                  type="number"
                  name="features.baths"
                  value={formData.features.baths}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Square Feet
                </label>
                <input
                  type="text"
                  name="features.sqft"
                  value={formData.features.sqft}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="2,500"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="features.pool"
                  checked={formData.features.pool}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="ml-2 text-sm font-medium text-gray-700">
                  Has Pool
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Images */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Images</h3>
          
          {/* Add Image */}
          <div className="flex space-x-2">
            <input
              type="url"
              value={currentImage}
              onChange={(e) => setCurrentImage(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Image URL"
            />
            <button
              type="button"
              onClick={handleAddImage}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              <Plus className="h-4 w-4" />
              <span>Add</span>
            </button>
          </div>

          {/* Image List */}
          {formData.images.length > 0 && (
            <div className="space-y-2">
              {formData.images.map((image, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                  <img
                    src={image}
                    alt={`Preview ${index + 1}`}
                    className="w-16 h-16 object-cover rounded"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <span className="flex-1 text-sm text-gray-600 truncate">{image}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Amenities */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Amenities</h3>
          
          {/* Add Amenity */}
          <div className="flex space-x-2">
            <input
              type="text"
              value={currentAmenity}
              onChange={(e) => setCurrentAmenity(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ocean views, Pool, etc."
            />
            <button
              type="button"
              onClick={handleAddAmenity}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              <Plus className="h-4 w-4" />
              <span>Add</span>
            </button>
          </div>

          {/* Amenity List */}
          {formData.amenities.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.amenities.map((amenity, index) => (
                <span
                  key={index}
                  className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  <span>{amenity}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAmenity(index)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Property description..."
          />
        </div>

        {/* Land-specific fields */}
        {formData.category === 'land' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Land Details</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  MLS Number
                </label>
                <input
                  type="text"
                  name="mls"
                  value={formData.mls}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="25-80"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <input
                  type="text"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Land"
                />
              </div>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Save className="h-4 w-4" />
            <span>{item ? 'Update Item' : 'Create Item'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default PortfolioItemForm;
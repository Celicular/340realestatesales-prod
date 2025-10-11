import React, { useState } from 'react';
import { 
  Home, 
  MapPin, 
  DollarSign, 
  Camera, 
  Calendar, 
  Users, 
  Bed, 
  Bath, 
  Square, 
  Car,
  Wifi,
  Waves,
  AirVent,
  UtensilsCrossed,
  Tv,
  Shield,
  Save,
  X
} from 'lucide-react';
import { addRentalProperty } from '../../firebase/firestore';
import { getCurrentUser } from '../../utils/auth';

const RentalPropertyForm = ({ onSuccess, onCancel, userRole = 'agent' }) => {
  const currentUser = getCurrentUser();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    // Property Basic Info
    propertyInfo: {
      name: '',
      slug: '',
      description: '',
      type: 'villa', // villa, apartment, house, condo
      status: 'available' // available, rented, maintenance
    },
    
    // Location
    location: {
      address: '',
      neighborhood: '',
      city: 'St. John',
      state: 'USVI',
      zipCode: '',
      coordinates: {
        lat: '',
        lng: ''
      }
    },
    
    // Property Details
    details: {
      bedrooms: 1,
      bathrooms: 1,
      squareFeet: '',
      lotSize: '',
      yearBuilt: '',
      furnished: true,
      petFriendly: false,
      smokingAllowed: false,
      maxOccupancy: 2,
      minimumStay: 3, // nights
      checkInTime: '15:00',
      checkOutTime: '11:00'
    },
    
    // Pricing
    pricing: {
      nightly: '',
      weekly: '',
      monthly: '',
      seasonalRates: {
        highSeason: {
          start: '',
          end: '',
          nightly: ''
        },
        lowSeason: {
          start: '',
          end: '',
          nightly: ''
        }
      },
      cleaningFee: '',
      securityDeposit: '',
      currency: 'USD'
    },
    
    // Amenities
    amenities: {
      wifi: false,
      airConditioning: false,
      heating: false,
      kitchen: false,
      parking: false,
      pool: false,
      hotTub: false,
      beachAccess: false,
      oceanView: false,
      balcony: false,
      washer: false,
      dryer: false,
      tv: false,
      fireplace: false,
      gym: false,
      elevator: false,
      wheelchairAccessible: false,
      securitySystem: false
    },
    
    // Images
    images: {
      main: '',
      gallery: ['', '', '', ''], // Up to 4 additional images
      floorPlan: ''
    },
    
    // Availability
    availability: {
      available: true,
      unavailableDates: [],
      calendar: null // For calendar integration
    },
    
    // Policies
    policies: {
      cancellationPolicy: 'moderate', // strict, moderate, flexible
      houseRules: '',
      additionalFees: [],
      damagePolicy: ''
    },
    
    // Contact & Management
    contact: {
      managerName: currentUser?.displayName || '',
      managerEmail: currentUser?.email || '',
      managerPhone: '',
      emergencyContact: '',
      keyPickupLocation: '',
      keyPickupInstructions: ''
    }
  });

  const propertyTypes = [
    { value: 'villa', label: 'Villa' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'condo', label: 'Condominium' },
    { value: 'townhouse', label: 'Townhouse' },
    { value: 'studio', label: 'Studio' }
  ];

  const statusOptions = [
    { value: 'available', label: 'Available' },
    { value: 'rented', label: 'Currently Rented' },
    { value: 'maintenance', label: 'Under Maintenance' },
    { value: 'seasonal', label: 'Seasonal Only' }
  ];

  const cancellationPolicies = [
    { value: 'flexible', label: 'Flexible - Full refund 1 day prior' },
    { value: 'moderate', label: 'Moderate - Full refund 5 days prior' },
    { value: 'strict', label: 'Strict - 50% refund 7 days prior' }
  ];

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleAmenityChange = (amenity, checked) => {
    setFormData(prev => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [amenity]: checked
      }
    }));
  };

  const handleImageChange = (type, index, value) => {
    if (type === 'gallery') {
      setFormData(prev => ({
        ...prev,
        images: {
          ...prev.images,
          gallery: prev.images.gallery.map((img, i) => i === index ? value : img)
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        images: {
          ...prev.images,
          [type]: value
        }
      }));
    }
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const validateForm = () => {
    const errors = [];
    
    if (!formData.propertyInfo.name.trim()) errors.push('Property name is required');
    if (!formData.location.address.trim()) errors.push('Address is required');
    if (!formData.pricing.nightly) errors.push('Nightly rate is required');
    if (!formData.details.bedrooms) errors.push('Number of bedrooms is required');
    if (!formData.details.bathrooms) errors.push('Number of bathrooms is required');
    if (!formData.images.main.trim()) errors.push('Main image is required');
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '));
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Generate slug if not provided
      if (!formData.propertyInfo.slug) {
        formData.propertyInfo.slug = generateSlug(formData.propertyInfo.name);
      }
      
      // Prepare agent info
      const agentInfo = {
        email: currentUser?.email || '',
        name: currentUser?.displayName || 'Unknown User',
        role: userRole
      };
      
      const result = await addRentalProperty(formData, agentInfo);
      
      if (result.success) {
        setSuccess('Rental property submitted successfully! It will be reviewed by admin.');
        if (onSuccess) {
          setTimeout(() => onSuccess(), 2000);
        }
      } else {
        setError(result.error || 'Failed to submit rental property');
      }
    } catch (err) {
      setError('An error occurred while submitting the property');
      console.error('Error submitting rental property:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Home className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Add Rental Property</h1>
            <p className="text-gray-600">Create a new rental property listing</p>
          </div>
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-6 w-6" />
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Property Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center space-x-2 mb-4">
            <Home className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Name *
              </label>
              <input
                type="text"
                value={formData.propertyInfo.name}
                onChange={(e) => {
                  handleInputChange('propertyInfo', 'name', e.target.value);
                  // Auto-generate slug
                  handleInputChange('propertyInfo', 'slug', generateSlug(e.target.value));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Sunset Villa Paradise"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Type *
              </label>
              <select
                value={formData.propertyInfo.type}
                onChange={(e) => handleInputChange('propertyInfo', 'type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {propertyTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL Slug
              </label>
              <input
                type="text"
                value={formData.propertyInfo.slug}
                onChange={(e) => handleInputChange('propertyInfo', 'slug', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="sunset-villa-paradise"
              />
              <p className="text-xs text-gray-500 mt-1">Auto-generated from property name</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.propertyInfo.status}
                onChange={(e) => handleInputChange('propertyInfo', 'status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statusOptions.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.propertyInfo.description}
              onChange={(e) => handleInputChange('propertyInfo', 'description', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe your property, its unique features, and what makes it special..."
              required
            />
          </div>
        </div>

        {/* Location Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center space-x-2 mb-4">
            <MapPin className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Location</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <input
                type="text"
                value={formData.location.address}
                onChange={(e) => handleInputChange('location', 'address', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="123 Paradise Road"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Neighborhood
              </label>
              <input
                type="text"
                value={formData.location.neighborhood}
                onChange={(e) => handleInputChange('location', 'neighborhood', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Cruz Bay, Coral Bay"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ZIP Code
              </label>
              <input
                type="text"
                value={formData.location.zipCode}
                onChange={(e) => handleInputChange('location', 'zipCode', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="00830"
              />
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center space-x-2 mb-4">
            <Square className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Property Details</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Bed className="inline h-4 w-4 mr-1" />
                Bedrooms *
              </label>
              <input
                type="number"
                min="0"
                value={formData.details.bedrooms}
                onChange={(e) => handleInputChange('details', 'bedrooms', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Bath className="inline h-4 w-4 mr-1" />
                Bathrooms *
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={formData.details.bathrooms}
                onChange={(e) => handleInputChange('details', 'bathrooms', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="inline h-4 w-4 mr-1" />
                Max Occupancy
              </label>
              <input
                type="number"
                min="1"
                value={formData.details.maxOccupancy}
                onChange={(e) => handleInputChange('details', 'maxOccupancy', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Min Stay (nights)
              </label>
              <input
                type="number"
                min="1"
                value={formData.details.minimumStay}
                onChange={(e) => handleInputChange('details', 'minimumStay', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Square Feet
              </label>
              <input
                type="number"
                value={formData.details.squareFeet}
                onChange={(e) => handleInputChange('details', 'squareFeet', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="1200"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year Built
              </label>
              <input
                type="number"
                value={formData.details.yearBuilt}
                onChange={(e) => handleInputChange('details', 'yearBuilt', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="2020"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lot Size (sq ft)
              </label>
              <input
                type="number"
                value={formData.details.lotSize}
                onChange={(e) => handleInputChange('details', 'lotSize', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="5000"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="furnished"
                checked={formData.details.furnished}
                onChange={(e) => handleInputChange('details', 'furnished', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="furnished" className="ml-2 text-sm text-gray-700">
                Furnished
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="petFriendly"
                checked={formData.details.petFriendly}
                onChange={(e) => handleInputChange('details', 'petFriendly', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="petFriendly" className="ml-2 text-sm text-gray-700">
                Pet Friendly
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="smokingAllowed"
                checked={formData.details.smokingAllowed}
                onChange={(e) => handleInputChange('details', 'smokingAllowed', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="smokingAllowed" className="ml-2 text-sm text-gray-700">
                Smoking Allowed
              </label>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center space-x-2 mb-4">
            <DollarSign className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Pricing</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nightly Rate (USD) *
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.pricing.nightly}
                onChange={(e) => handleInputChange('pricing', 'nightly', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="150.00"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weekly Rate (USD)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.pricing.weekly}
                onChange={(e) => handleInputChange('pricing', 'weekly', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="900.00"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Rate (USD)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.pricing.monthly}
                onChange={(e) => handleInputChange('pricing', 'monthly', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="3500.00"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cleaning Fee (USD)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.pricing.cleaningFee}
                onChange={(e) => handleInputChange('pricing', 'cleaningFee', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="75.00"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Security Deposit (USD)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.pricing.securityDeposit}
                onChange={(e) => handleInputChange('pricing', 'securityDeposit', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="500.00"
              />
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Amenities</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries({
              wifi: { icon: Wifi, label: 'Wi-Fi' },
              airConditioning: { icon: AirVent, label: 'Air Conditioning' },
              kitchen: { icon: UtensilsCrossed, label: 'Full Kitchen' },
              parking: { icon: Car, label: 'Parking' },
              pool: { icon: Waves, label: 'Pool' },
              tv: { icon: Tv, label: 'TV' },
              beachAccess: { icon: null, label: 'Beach Access' },
              oceanView: { icon: null, label: 'Ocean View' },
              balcony: { icon: null, label: 'Balcony/Patio' },
              washer: { icon: null, label: 'Washer' },
              dryer: { icon: null, label: 'Dryer' },
              hotTub: { icon: null, label: 'Hot Tub' },
              fireplace: { icon: null, label: 'Fireplace' },
              gym: { icon: null, label: 'Gym/Fitness' },
              elevator: { icon: null, label: 'Elevator' },
              wheelchairAccessible: { icon: null, label: 'Wheelchair Accessible' },
              securitySystem: { icon: Shield, label: 'Security System' }
            }).map(([key, amenity]) => (
              <div key={key} className="flex items-center">
                <input
                  type="checkbox"
                  id={key}
                  checked={formData.amenities[key]}
                  onChange={(e) => handleAmenityChange(key, e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={key} className="ml-2 text-sm text-gray-700 flex items-center">
                  {amenity.icon && <amenity.icon className="h-4 w-4 mr-1" />}
                  {amenity.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Images */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center space-x-2 mb-4">
            <Camera className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Images</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Main Image URL *
              </label>
              <input
                type="url"
                value={formData.images.main}
                onChange={(e) => handleImageChange('main', null, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/main-image.jpg"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gallery Images (Optional)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.images.gallery.map((image, index) => (
                  <input
                    key={index}
                    type="url"
                    value={image}
                    onChange={(e) => handleImageChange('gallery', index, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`Gallery image ${index + 1} URL`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Policies */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Policies & Rules</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cancellation Policy
              </label>
              <select
                value={formData.policies.cancellationPolicy}
                onChange={(e) => handleInputChange('policies', 'cancellationPolicy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {cancellationPolicies.map(policy => (
                  <option key={policy.value} value={policy.value}>
                    {policy.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                House Rules
              </label>
              <textarea
                value={formData.policies.houseRules}
                onChange={(e) => handleInputChange('policies', 'houseRules', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="No smoking, no parties, quiet hours after 10 PM..."
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center space-x-2 mb-4">
            <Users className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Contact & Management</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Manager Name
              </label>
              <input
                type="text"
                value={formData.contact.managerName}
                onChange={(e) => handleInputChange('contact', 'managerName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="John Smith"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Manager Phone
              </label>
              <input
                type="tel"
                value={formData.contact.managerPhone}
                onChange={(e) => handleInputChange('contact', 'managerPhone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+1 (340) 123-4567"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Emergency Contact
              </label>
              <input
                type="tel"
                value={formData.contact.emergencyContact}
                onChange={(e) => handleInputChange('contact', 'emergencyContact', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+1 (340) 987-6543"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Key Pickup Location
              </label>
              <input
                type="text"
                value={formData.contact.keyPickupLocation}
                onChange={(e) => handleInputChange('contact', 'keyPickupLocation', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Property office, lockbox, etc."
              />
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Key Pickup Instructions
            </label>
            <textarea
              value={formData.contact.keyPickupInstructions}
              onChange={(e) => handleInputChange('contact', 'keyPickupInstructions', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Instructions for guests on how to check in and get keys..."
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Submit Rental Property</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RentalPropertyForm;
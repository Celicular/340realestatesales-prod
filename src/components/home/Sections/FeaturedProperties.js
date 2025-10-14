import React, { useState, useMemo, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getPortfolioItems } from "../../../firebase/firestore";

const FeaturedProperties = () => {
  const [propertiesToShow, setPropertiesToShow] = useState(2); // Number to slice
  const [propertyData, setPropertyData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch properties from Firestore - Same as Properties.jsx
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        console.log('🚀 Starting to fetch properties...');
        setLoading(true);
        setError(null);
        
        const result = await getPortfolioItems('residential');
        console.log('📡 API Response:', result);
        
        if (result.success) {
          console.log('✅ API Success - Raw data:', result.data);
          
          // Log the first property structure for debugging
          if (result.data.length > 0) {
            console.log('🔍 First property structure:', result.data[0]);
            console.log('🔍 First property keys:', Object.keys(result.data[0]));
            
            // Debug price fields specifically
            const firstProp = result.data[0];
            console.log('💰 Price fields in first property:');
            console.log('  - price:', firstProp.price, typeof firstProp.price);
            console.log('  - soldPrice:', firstProp.soldPrice, typeof firstProp.soldPrice);
            console.log('  - listingPrice:', firstProp.listingPrice, typeof firstProp.listingPrice);
            console.log('  - askPrice:', firstProp.askPrice, typeof firstProp.askPrice);
            console.log('  - askingPrice:', firstProp.askingPrice, typeof firstProp.askingPrice);
            console.log('  - listPrice:', firstProp.listPrice, typeof firstProp.listPrice);
          }
          
          // Convert array to object format for compatibility
          const dataObject = {};
          result.data.forEach((property, index) => {
            dataObject[property.id || index] = property;
          });
          
          console.log('🔄 Converted to object format:', dataObject);
          setPropertyData(dataObject);
        } else {
          console.error('❌ API Error:', result.error);
          setError(result.error || 'Failed to fetch properties');
        }
      } catch (err) {
        console.error('💥 Fetch Error:', err);
        setError('Error fetching properties: ' + err.message);
      } finally {
        setLoading(false);
        console.log('🏁 Fetch completed');
      }
    };

    fetchProperties();
  }, []);

  // Memoize filtered properties - Enhanced data mapping
  const filteredProperties = useMemo(() => {
    console.log('🔄 Processing filtered properties...');
    console.log('📦 Raw propertyData entries:', Object.entries(propertyData));
    
    const result = Object.entries(propertyData)
      .slice(0, propertiesToShow)
      .map(([id, property]) => {
        console.log(`🏠 Processing property ${id}:`, property);
        
        // Enhanced image handling - check multiple possible image sources
        let images = [];
        if (property.images && Array.isArray(property.images) && property.images.length > 0) {
          images = property.images;
        } else if (property.image) {
          images = [property.image];
        } else if (property.photo) {
          images = [property.photo];
        } else if (property.photos && Array.isArray(property.photos) && property.photos.length > 0) {
          images = property.photos;
        }
        
        // Enhanced title/name handling
        const title = property.title || property.name || property.propertyName || property.listingTitle || 'Property';
        
        // Enhanced price handling - check multiple price fields
        let price = property.price || property.soldPrice || property.listingPrice || property.askPrice || property.askingPrice || property.listPrice || 0;
        
        // If price is still 0, try to extract from other possible fields
        if (!price || price === 0) {
          // Check if price is in features or propertyDetails
          if (property.features?.price) {
            price = property.features.price;
          } else if (property.propertyDetails?.price) {
            price = property.propertyDetails.price;
          } else if (property.details?.price) {
            price = property.details.price;
          }
        }
        
        console.log(`💰 Raw price for ${id}:`, price, typeof price);
        
        // Enhanced location handling
        let location = 'St. John, USVI';
        if (property.location) {
          if (typeof property.location === 'string') {
            location = property.location;
          } else if (property.location.address) {
            location = property.location.address;
          } else if (property.location.quarter) {
            location = `${property.location.quarter}, St. John, USVI`;
          }
        } else if (property.address) {
          location = property.address;
        }
        
        const mappedProperty = {
          id,
          title,
          price,
          images,
          description: property.description || property.fullDescription || property.listingDescription || '',
          features: {
            totalBeds: property.features?.beds || property.features?.totalBeds || property.bedrooms || property.beds || 0,
            totalBaths: property.features?.baths || property.features?.totalBaths || property.bathrooms || property.baths || 0,
            pool: property.features?.pool || property.amenities?.pool || false,
            type: property.features?.type || property.type || property.subcategory || property.propertyType || 'property',
            properties: 1,
          },
          propertyDetails: property.propertyDetails || property.details || {},
          status: property.status || 'for-sale',
          location,
          mls: property.mls || property.mlsNumber || property.mlsId || property.mlsNumber || '',
        };
        
        console.log(`✅ Mapped property ${id}:`, mappedProperty);
        console.log(`🖼️ Images for ${id}:`, images);
        console.log(`🏷️ Title for ${id}:`, title);
        console.log(`💰 Price for ${id}:`, price, `(type: ${typeof price})`);
        console.log(`📍 Location for ${id}:`, location);
        
        return mappedProperty;
      });
    
    console.log('🎯 Final filtered properties:', result);
    return result;
  }, [propertiesToShow, propertyData]);

  // Navigation functions - Show two properties at a time
  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? Math.max(0, filteredProperties.length - 2) : prevIndex - 2
    );
  }, [filteredProperties.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex + 2 >= filteredProperties.length ? 0 : prevIndex + 2
    );
  }, [filteredProperties.length]);

  // Get current properties to display (two at a time)
  const currentProperties = filteredProperties.slice(currentIndex, currentIndex + 2);
  
  // Debug logging to check data mapping
  console.log('=== FEATURED PROPERTIES DEBUG ===');
  console.log('📊 Data Status:', {
    loading,
    error,
    rawPropertyDataCount: Object.keys(propertyData).length,
    filteredPropertiesCount: filteredProperties.length,
    currentIndex,
    propertiesToShow
  });
  
  console.log('🏠 Raw Property Data:', propertyData);
  console.log('🔍 Filtered Properties:', filteredProperties);
  console.log('🎯 Current Properties:', currentProperties);
  
  console.log('📋 Property Details:', currentProperties.map((p, i) => ({
    index: i,
    id: p.id,
    title: p.title,
    price: p.price,
    status: p.status,
    location: p.location,
    imagesCount: p.images?.length || 0,
    features: p.features,
    mls: p.mls
  })));
  
  console.log('=== END DEBUG ===');

  // Format price for display
  const formatPrice = (price) => {
    console.log(`💰 Formatting price:`, price, typeof price);
    
    // Handle null, undefined, empty string
    if (!price || price === '' || price === null || price === undefined) {
      console.log(`⚠️ No price provided, using fallback`);
      return 'Price on Request';
    }
    
    // Convert to number if it's a string
    let numericPrice;
    if (typeof price === 'string') {
      // Remove currency symbols, commas, and whitespace
      const cleanedPrice = price.replace(/[$,£€¥\s]/g, '');
      numericPrice = parseFloat(cleanedPrice);
      console.log(`🔄 Converted string "${price}" to number:`, numericPrice);
    } else if (typeof price === 'number') {
      numericPrice = price;
      console.log(`✅ Using number price:`, numericPrice);
    } else {
      console.log(`⚠️ Invalid price type:`, typeof price, price);
      return 'Price on Request';
    }
    
    // Check if the number is valid
    if (isNaN(numericPrice) || numericPrice <= 0) {
      console.log(`⚠️ Invalid numeric price:`, numericPrice);
      return 'Price on Request';
    }
    
    // Format the price
    const formattedPrice = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numericPrice);
    
    console.log(`✅ Formatted price: ${formattedPrice}`);
    return formattedPrice;
  };

  // Get property status badge
  const getStatusBadge = (property) => {
    const status = property.status?.toLowerCase();
    if (status === 'rental' || status === 'for-rent') {
      return 'For Rent';
    } else if (status === 'sold') {
      return 'Sold';
    } else {
      return 'For Sale';
    }
  };

  // Get property image
  const getPropertyImage = (property) => {
    console.log(`🖼️ Getting image for property ${property.id}:`, property.images);
    
    if (property.images && property.images.length > 0) {
      const imageUrl = property.images[0];
      console.log(`✅ Using image: ${imageUrl}`);
      return imageUrl;
    }
    
    // Fallback image
    const fallbackImage = "https://www.340realestate.com/static/media/banana10.0bd602c9777af8620d50.jpg";
    console.log(`⚠️ No images found, using fallback: ${fallbackImage}`);
    return fallbackImage;
  };

  // Get property address
  const getPropertyAddress = (property) => {
    console.log(`📍 Getting address for property ${property.id}:`, property.location);
    
    // Handle location object structure from backend
    if (property.location && typeof property.location === 'object') {
      if (property.location.address) {
        console.log(`✅ Using location.address: ${property.location.address}`);
        return property.location.address;
      }
      if (property.location.quarter) {
        const quarterAddress = `${property.location.quarter}, St. John, USVI`;
        console.log(`✅ Using location.quarter: ${quarterAddress}`);
        return quarterAddress;
      }
    }
    
    // Handle string location
    if (property.location && typeof property.location === 'string') {
      console.log(`✅ Using location string: ${property.location}`);
      return property.location;
    }
    
    // Use title/name as fallback
    if (property.title || property.name) {
      const titleAddress = property.title || property.name;
      console.log(`✅ Using title/name as address: ${titleAddress}`);
      return titleAddress;
    }
    
    console.log(`⚠️ No location found, using fallback: St. John, USVI`);
    return 'St. John, USVI';
  };

  // Get bedrooms and bathrooms
  const getPropertyDetails = (property) => {
    const beds = property.features?.totalBeds || property.features?.beds || property.bedrooms || 'N/A';
    const baths = property.features?.totalBaths || property.features?.baths || property.bathrooms || 'N/A';
    return `${beds} BEDS · ${baths} BATHS`;
  };

  // Loading state
  if (loading) {
    return (
      <section className="py-12 px-4 text-center">
        <h2 className="text-3xl font-serif text-[#0e3b3e] tracking-widest uppercase">
          Featured Properties
        </h2>
        <p className="mt-2 text-gray-600">Loading featured properties...</p>
        <div className="flex justify-center mt-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d4b196]"></div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-12 px-4 text-center">
        <h2 className="text-3xl font-serif text-[#0e3b3e] tracking-widest uppercase">
          Featured Properties
        </h2>
        <p className="mt-2 text-gray-600">Unable to load featured properties</p>
        <p className="text-red-500 text-sm mt-2">{error}</p>
        <div className="mt-4">
          <button 
            onClick={() => window.location.reload()} 
            className="bg-[#d4b196] text-white px-4 py-2 rounded hover:opacity-90 transition-opacity"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  // No properties state
  if (filteredProperties.length === 0) {
    return (
      <section className="py-12 px-4 text-center">
        <h2 className="text-3xl font-serif text-[#0e3b3e] tracking-widest uppercase">
          Featured Properties
        </h2>
        <p className="mt-2 text-gray-600">No featured properties available at the moment.</p>
      </section>
    );
  }

  return (
    <section className="py-12 px-4 text-center">
      {/* Heading */}
      <h2 className="text-3xl font-serif text-[#0e3b3e] tracking-widest uppercase">
        Featured Properties
      </h2>
      <p className="mt-2 text-gray-600">
        Browse the available properties in the area below.
      </p>

      {/* Carousel Arrows - Always show if there are properties */}
      {filteredProperties.length > 0 && (
        <div className="flex justify-end mt-4 gap-3 pr-8">
          <button 
            onClick={goToPrevious}
            className={`p-3 text-white transition-all duration-300 rounded-full shadow-lg ${
              filteredProperties.length <= 2 
                ? 'bg-gray-400 cursor-not-allowed opacity-50' 
                : 'bg-[#d4b196] hover:opacity-80 hover:scale-105'
            }`}
            disabled={filteredProperties.length <= 2}
            title={filteredProperties.length <= 2 ? 'No more properties to show' : 'Previous properties'}
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={goToNext}
            className={`p-3 text-white transition-all duration-300 rounded-full shadow-lg ${
              filteredProperties.length <= 2 
                ? 'bg-gray-400 cursor-not-allowed opacity-50' 
                : 'bg-[#d4b196] hover:opacity-80 hover:scale-105'
            }`}
            disabled={filteredProperties.length <= 2}
            title={filteredProperties.length <= 2 ? 'No more properties to show' : 'Next properties'}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}

      {/* Properties Grid - Two Properties Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 max-w-6xl mx-auto">
        {currentProperties.map((property, index) => (
          <div key={property.id || index} className="bg-white shadow-md">
            <div className="relative">
              <img
                src={getPropertyImage(property)}
                alt={property.title || property.name || 'Property'}
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-2 left-2 flex gap-2">
                <span className="bg-[#d4b196] text-white text-xs px-2 py-1">
                  {getStatusBadge(property)}
                </span>
                {property.mls && (
                  <span className="bg-[#d4b196] text-white text-xs px-2 py-1">
                    MLS® {property.mls}
                  </span>
                )}
              </div>
            </div>
            <div className="bg-[#d4b196] text-left p-4">
              <p className="text-white text-lg font-bold">
                {formatPrice(property.price)}
              </p>
              <p className="text-white text-sm font-semibold">
                {property.title || property.name || 'Property'}
              </p>
              <p className="text-white text-sm">
                {getPropertyAddress(property)}
              </p>
              <p className="text-white text-xs mt-1">
                {getPropertyDetails(property)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <div className="mt-8">
        <Link to="/properties">
          <button className="bg-[#d4b196] px-8 py-3 text-white uppercase tracking-widest hover:opacity-90 transition-opacity">
            View All
          </button>
        </Link>
      </div>
    </section>
  );
};

export default FeaturedProperties;

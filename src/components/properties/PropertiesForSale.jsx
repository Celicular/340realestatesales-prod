import React, { useState, useMemo, useCallback, memo, useEffect } from "react";
import { FaBed, FaBath, FaSwimmingPool } from "react-icons/fa";
import { BsHouseDoorFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { getAllPortfolioItems } from "../../firebase/firestore";

// Transform Portfolio data to match the expected format - memoized
const useProperties = (selectedCategory, propertiesToShow, filteredProperties) => {
  const [portfolioProperties, setPortfolioProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        console.log('🔄 Fetching Portfolio properties for sale...');
        
        // Fetch portfolio items with for-sale status
        const result = await getAllPortfolioItems({ status: 'for-sale' });
        console.log('📦 Portfolio fetch result:', result);
        
        if (result.success) {
          console.log('✅ Setting Portfolio properties:', result.data);
          setPortfolioProperties(result.data);
        } else {
          console.log('❌ Portfolio fetch failed:', result.error);
          setPortfolioProperties([]);
        }
      } catch (error) {
        console.error('💥 Error fetching portfolio properties:', error);
        setPortfolioProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return useMemo(() => {
    console.log('🏠 useProperties - portfolioProperties:', portfolioProperties);
    console.log('🏷️ useProperties - selectedCategory:', selectedCategory);
    
    // Transform Portfolio data to match the expected format
    const portfolioFormatted = portfolioProperties.map((property) => {
      console.log('🔄 Processing Portfolio property:', property);
      
      return {
        id: property.id,
        title: property.title,
        price: typeof property.price === 'string' ? property.price : `$${property.price?.toLocaleString() || 'Price on request'}`,
        images: property.images || [],
        description: property.description || 'Beautiful property in St. John',
        features: {
          totalBeds: property.features?.beds || property.beds,
          totalBaths: property.features?.baths || property.baths,
          pool: property.features?.pool || false,
          type: property.subcategory || property.category,
          properties: 1,
        },
        category: property.category,
        subcategory: property.subcategory,
      };
    });

    console.log('✨ useProperties - portfolioFormatted:', portfolioFormatted);

    // Filter Portfolio properties by category if selected
    let filteredPortfolio = portfolioFormatted;
    if (selectedCategory) {
      console.log('🔍 Filtering by category:', selectedCategory);
      console.log('📋 Available Portfolio categories:', portfolioFormatted.map(p => `${p.category}/${p.subcategory}`));
      
      filteredPortfolio = portfolioFormatted.filter(property => {
        // Check both category and subcategory for matches
        const categoryMatch = property.category?.toLowerCase() === selectedCategory.toLowerCase();
        const subcategoryMatch = property.subcategory?.toLowerCase() === selectedCategory.toLowerCase();
        const matches = categoryMatch || subcategoryMatch;
        
        console.log(`🏠 Property "${property.title}" (${property.category}/${property.subcategory}) matches "${selectedCategory}": ${matches}`);
        return matches;
      });
    }

    console.log('🎯 useProperties - filteredPortfolio:', filteredPortfolio);

    // If no category is selected and we have properties, limit the display
    if (!selectedCategory && filteredPortfolio.length > propertiesToShow) {
      const limitedProperties = filteredPortfolio.slice(0, propertiesToShow);
      console.log('📊 useProperties - limitedProperties:', limitedProperties);
      return limitedProperties;
    }

    // Return filtered portfolio properties
    return filteredPortfolio;
  }, [portfolioProperties, selectedCategory, propertiesToShow, filteredProperties]);
};

const PropertyCard = memo(({
  id,
  title,
  price,
  originalPrice,
  images,
  description,
  features,
  propertyDetails,
}) => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  const nextSlide = useCallback(() => setCurrent((prev) => (prev + 1) % images.length), [images.length]);
  const prevSlide = useCallback(() =>
    setCurrent((prev) => (prev - 1 + images.length) % images.length), [images.length]);

  const handleCardClick = useCallback(() => {
    navigate(`/property/${id}`);
  }, [navigate, id]);

  return (
    <div
      className="bg-white rounded-3xl mt-10 shadow-xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] cursor-pointer"
      onClick={handleCardClick}
    >
              {/* 🖼 Image Carousel */}
        <div className="relative w-full h-72 overflow-hidden ">
          {images && images.length > 0 ? (
            images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`${title} Image ${i + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                  i === current ? "opacity-100" : "opacity-0"
                }`}
              />
            ))
          ) : (
            <div className="absolute inset-0 w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">No images available</span>
            </div>
          )}
        {/* <button
          onClick={prevSlide}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1 px-2 rounded-full text-lg z-10"
        >
          ‹
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1 px-2 rounded-full text-lg z-10"
        >
          ›
        </button> */}
      </div>

      {/* 📄 Property Info */}
      <div className="p-6 md:p-8 flex flex-col gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
           
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-2xl text-emerald-600 font-bold">{price}</p>
         
          </div>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">{description}</p>

        {/* Combined Features */}
        <div className="flex flex-wrap gap-4 mt-2 text-gray-700 text-sm">
          {features.totalBeds && (
            <span className="flex items-center gap-2">
              <FaBed /> {features.totalBeds} Total Beds
            </span>
          )}
          {features.totalBaths && (
            <span className="flex items-center gap-2">
              <FaBath /> {features.totalBaths} Total Baths
            </span>
          )}
          {features.pool && (
            <span className="flex items-center gap-2">
              <FaSwimmingPool /> Pool Included
            </span>
          )}
          {/* {features.properties && (
            <span className="flex items-center gap-2">
              <BsHouseDoorFill /> {features.properties} Properties
            </span>
          )} */}
        </div>

        {/* Individual Property Details */}
        {propertyDetails && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-3">
              Package Includes:
            </h4>
            <div className="space-y-3">
              {propertyDetails.map((property, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-3">
                  <h5 className="font-medium text-gray-800">{property.name}</h5>
                  <p className="text-xs text-gray-600 mt-1">
                    {property.description}
                  </p>
                  <div className="flex gap-3 mt-2 text-xs text-gray-500">
                    <span>{property.beds} beds</span>
                    <span>{property.baths} baths</span>
                    <span>{property.type}</span>
                    {property.pool && <span>Pool</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

const PropertiesForSale = memo(({ selectedCategory, propertiesToShow, filteredProperties }) => {
  // Use all properties from Portfolio backend system
  const properties = useProperties(selectedCategory, propertiesToShow, filteredProperties);
  
  console.log('🏠 PropertiesForSale - properties from backend:', properties);
  console.log('🏷️ PropertiesForSale - selectedCategory:', selectedCategory);
  console.log('🔍 PropertiesForSale - filteredProperties:', filteredProperties);
  
  // Debug: Show if we have any properties at all
  console.log('📊 PropertiesForSale - Total properties to display:', properties.length);

  return (
    <div>
      <section className="pb-20 pt-5 px-4 w-full lg:px-2 bg-gradient-to-br from-gray-50 to-white">
        {/* 🏠 Header */}
        <div className="text-center mb-16">
          <h1
            className="text-4xl md:text-5xl font-bold text-gray-800"
          >
            Featured Properties For Sale
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-blue-500 mx-auto mt-4 rounded-full" />
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
            Discover elegant villas with modern upgrades, breathtaking views,
            and exceptional amenities — located in the heart of St. John.
            <br />
          </p>
        </div>

        {/* 🧱 Grid */}
        <div className="w-full py-7">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {properties.map((property, index) => (
              <PropertyCard key={property.id || index} {...property} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
});

export default PropertiesForSale;

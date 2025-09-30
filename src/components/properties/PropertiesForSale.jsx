import React, { useState, useMemo, useCallback, memo, useEffect } from "react";
import { FaBed, FaBath, FaSwimmingPool } from "react-icons/fa";
import { BsHouseDoorFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { propertyData } from "../../data/SalesData";
import { getSaleProperties } from "../../firebase/firestore";

// Transform SalesData to match the expected format - memoized
const useProperties = (selectedCategory, propertiesToShow, filteredProperties) => {
  const [firebaseProperties, setFirebaseProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        console.log('Fetching Firebase properties...');
        // Fetch only approved sale properties
        const result = await getSaleProperties({ status: 'approved' });
        console.log('Firebase fetch result:', result);
        if (result.success) {
          console.log('Setting Firebase properties:', result.data);
          setFirebaseProperties(result.data);
        } else {
          console.log('Firebase fetch failed:', result.error);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return useMemo(() => {
    console.log('useProperties - firebaseProperties:', firebaseProperties);
    console.log('useProperties - selectedCategory:', selectedCategory);
    console.log('useProperties - filteredProperties:', filteredProperties);
    
    // Transform Firebase data to match the expected format
    const firebaseFormatted = firebaseProperties.map((property) => {
      console.log('Processing Firebase property:', property);
      
      return {
        id: property.id,
        title: property.propertyInfo?.title || property.title,
        price: property.propertyInfo?.price || property.price,
        images: property.media?.imageLinks || property.images || [],
        description: property.description || property.fullDescription,
        features: {
          totalBeds: property.features?.beds || property.beds,
          totalBaths: property.features?.baths || property.baths,
          pool: property.features?.pool || property.pool,
          type: property.features?.type || property.type,
          properties: 1,
        },
        category: property.propertyInfo?.category || property.category,
      };
    });

    console.log('useProperties - firebaseFormatted:', firebaseFormatted);

    // Filter Firebase properties by category if selected
    let filteredFirebase = firebaseFormatted;
    if (selectedCategory) {
      console.log('Filtering by category:', selectedCategory);
      console.log('Available Firebase categories:', firebaseFormatted.map(p => p.category));
      
      filteredFirebase = firebaseFormatted.filter(property => {
        const matches = property.category?.toLowerCase() === selectedCategory.toLowerCase();
        console.log(`Property "${property.title}" category: "${property.category}" matches "${selectedCategory}": ${matches}`);
        return matches;
      });
    }

    console.log('useProperties - filteredFirebase:', filteredFirebase);

    // Get local properties (either filtered or limited)
    const localProperties = filteredProperties || [];

    console.log('useProperties - localProperties:', localProperties);

    // Combine Firebase and local properties
    const combinedProperties = [...filteredFirebase, ...localProperties];

    console.log('useProperties - combinedProperties:', combinedProperties);

    // If no category is selected and we have Firebase properties, limit the display
    if (!selectedCategory && combinedProperties.length > propertiesToShow) {
      const limitedProperties = combinedProperties.slice(0, propertiesToShow);
      console.log('useProperties - limitedProperties:', limitedProperties);
      return limitedProperties;
    }

    // If no properties at all, return local properties as fallback
    if (combinedProperties.length === 0) {
      console.log('useProperties - No properties found, using local fallback');
      return localProperties;
    }

    return combinedProperties;
  }, [firebaseProperties, selectedCategory, propertiesToShow, filteredProperties]);
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
  // Use all properties from Firebase and local data
  const properties = useProperties(selectedCategory, propertiesToShow, filteredProperties);
  
  console.log('PropertiesForSale - properties:', properties);
  console.log('PropertiesForSale - selectedCategory:', selectedCategory);
  console.log('PropertiesForSale - filteredProperties:', filteredProperties);
  
  // Debug: Show if we have any properties at all
  console.log('PropertiesForSale - Total properties to display:', properties.length);

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

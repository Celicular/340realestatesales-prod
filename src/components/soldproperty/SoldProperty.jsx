import React, { useState, useMemo, useCallback, memo, useEffect } from "react";
import { FaMapMarkerAlt, FaRulerCombined, FaTree, FaWater } from "react-icons/fa";
import { BsHouseDoorFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { soldProperties } from "../../data/SoldPropertydata";
import { getSoldProperties } from "../../firebase/firestore";

// Transform SoldPropertydata to match the expected format - memoized
const useSoldProperties = () => {
  const [firebaseSoldProperties, setFirebaseSoldProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSoldProperties = async () => {
      try {
        setLoading(true);
        console.log('Fetching Firebase sold properties...');
        // Fetch only approved sold properties
        const result = await getSoldProperties({ status: 'approved' });
        console.log('Firebase sold properties fetch result:', result);
        if (result.success) {
          console.log('Setting Firebase sold properties:', result.data);
          setFirebaseSoldProperties(result.data);
        } else {
          console.log('Firebase sold properties fetch failed:', result.error);
        }
      } catch (error) {
        console.error('Error fetching sold properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSoldProperties();
  }, []);

  return useMemo(() => {
    console.log('useSoldProperties - firebaseSoldProperties:', firebaseSoldProperties);
    
    // Transform Firebase data to match the expected format
    const firebaseFormatted = firebaseSoldProperties.map((property) => {
      console.log('Processing Firebase sold property:', property);
      
      return {
        id: property.id,
        title: property.propertyInfo?.title || property.title,
        location: property.propertyInfo?.location || property.location,
        price: property.propertyInfo?.price || property.price,
        status: property.propertyInfo?.status || property.status || 'SOLD',
        images: property.media?.imageLinks || property.images || [],
        description: property.description,
        highlights: property.highlights || {},
        features: property.features || {},
        additionalInfo: property.additionalInfo || {},
      };
    });

    console.log('useSoldProperties - firebaseFormatted:', firebaseFormatted);

    // Get local properties
    const localProperties = soldProperties || [];

    console.log('useSoldProperties - localProperties:', localProperties);

    // Combine Firebase and local properties
    const combinedProperties = [...firebaseFormatted, ...localProperties];

    console.log('useSoldProperties - combinedProperties:', combinedProperties);

    return combinedProperties;
  }, [firebaseSoldProperties]);
};

const SoldPropertyCard = memo(({
  id,
  title,
  location,
  price,
  status,
  images,
  description,
  highlights,
  features,
  additionalInfo,
}) => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  const nextSlide = useCallback(() => setCurrent((prev) => (prev + 1) % (images?.length || 1)), [images?.length]);
  const prevSlide = useCallback(() =>
    setCurrent((prev) => (prev - 1 + (images?.length || 1)) % (images?.length || 1)), [images?.length]);

  const handleCardClick = useCallback(() => {
    navigate(`/soldproperty/${id}`);
  }, [navigate, id]);

  const handleCarouselClick = useCallback((e) => {
    e.stopPropagation(); // Prevent card click when clicking carousel buttons
  }, []);

  return (
         <div
       className="bg-white rounded-3xl mt-10 shadow-xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] cursor-pointer group"
       onClick={handleCardClick}
     >
      {/* 🖼 Image Carousel */}
      <div className="relative w-full h-72 overflow-hidden">
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
                 {images && images.length > 1 && (
           <>
             <button
               onClick={(e) => {
                 handleCarouselClick(e);
                 prevSlide();
               }}
               className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1 px-2 rounded-full text-lg z-10"
             >
               ‹
             </button>
             <button
               onClick={(e) => {
                 handleCarouselClick(e);
                 nextSlide();
               }}
               className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1 px-2 rounded-full text-lg z-10"
             >
               ›
             </button>
           </>
         )}
        
        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500 text-white">
            {status}
          </span>
        </div>
      </div>

      {/* 📄 Sold Property Info */}
      <div className="p-6 md:p-8 flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
          <div className="flex items-center gap-2 mt-1 text-gray-600">
            <FaMapMarkerAlt className="w-4 h-4" />
            <p className="text-sm">{location}</p>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-2xl text-emerald-600 font-bold">{price}</p>
          </div>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{description}</p>

        {/* Property Features */}
        <div className="flex flex-wrap gap-4 mt-2 text-gray-700 text-sm">
          {highlights.beds > 0 && (
            <span className="flex items-center gap-2">
              <BsHouseDoorFill /> {highlights.beds} Beds
            </span>
          )}
          {highlights.baths > 0 && (
            <span className="flex items-center gap-2">
              <FaWater /> {highlights.baths} Baths
            </span>
          )}
          {highlights.sqft > 0 && (
            <span className="flex items-center gap-2">
              <FaRulerCombined /> {highlights.sqft} Sqft
            </span>
          )}
          {highlights.acres > 0 && (
            <span className="flex items-center gap-2">
              <FaRulerCombined /> {highlights.acres} Acres
            </span>
          )}
          {highlights.landscaping && (
            <span className="flex items-center gap-2">
              <FaTree /> {highlights.landscaping} Landscaping
            </span>
          )}
        </div>

         <div className="mt-4 pt-4 border-t border-gray-100">
           <button
             onClick={(e) => {
               e.stopPropagation();
               handleCardClick();
             }}
             className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
           >
             View Details
           </button>
         </div>
       </div>
    </div>
  );
});

const SoldProperty = () => {
  // Use all sold properties from Firebase and local data
  const soldPropertiesData = useSoldProperties();
  
  console.log('SoldProperty - soldPropertiesData:', soldPropertiesData);
  console.log('SoldProperty - Total sold properties to display:', soldPropertiesData.length);

  return (
    <div>
      <section className="py-20 px-4 lg:px-24 bg-gradient-to-br from-gray-50 to-white">
        {/* 🏠 Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
            Recently Sold Properties
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-blue-500 mx-auto mt-4 rounded-full" />
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
            Explore our recently sold properties in St. John. View transaction history, 
            property details, and market insights from completed sales.
          </p>
        </div>

        {/* 🧱 Grid */}
        <div className="w-full py-7">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {soldPropertiesData.map((property, index) => (
              <SoldPropertyCard key={property.id || index} {...property} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SoldProperty;

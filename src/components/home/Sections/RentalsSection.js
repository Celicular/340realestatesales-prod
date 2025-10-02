import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getRentalProperties } from "../../../firebase/firestore";

const RentalsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rentalProperties, setRentalProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch rental properties from backend - exactly like RentalDetails.jsx
  useEffect(() => {
    const fetchRentalProperties = async () => {
      try {
        setIsLoading(true);
        const result = await getRentalProperties({ status: 'approved' });
        if (result.success) {
          console.log('🔍 Fetched rental properties:', result.data);
          setRentalProperties(result.data);
        }
      } catch (error) {
        console.error('Error fetching rental properties:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRentalProperties();
  }, []);

  // Map backend rental properties data to the format expected by the component
  const rentalVillas = rentalProperties.map((property, index) => {
    const mappedProperty = {
      id: property.id,
      name: property.propertyInfo?.name || "Rental Property",
      slug: property.propertyInfo?.slug || `rental-${index}`,
      location: property.propertyInfo?.address || "Location not specified",
      price: property.propertyInfo?.pricePerNight ? `$${property.propertyInfo.pricePerNight}` : "Price on request",
      rating: 4.5, // Default rating since backend doesn't have ratings yet
      image: property.media?.imageLinks?.[0] || "/placeholder-image.jpg",
      description: property.description?.split("\n")[0] || "Beautiful rental property",
      amenities: property.amenities?.slice(0, 8) || [],
      guests: property.accommodation?.maxGuests || "N/A",
      bedrooms: property.accommodation?.bedrooms || "N/A",
      bathrooms: property.accommodation?.bathrooms || "N/A",
    };
    
    console.log(`🏠 Mapped property ${index}:`, {
      original: property,
      mapped: mappedProperty
    });
    
    return mappedProperty;
  });

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === rentalVillas.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? rentalVillas.length - 1 : prevIndex - 1
    );
  };

  const handleViewDetails = (propertySlug) => {
    navigate(`/rental/${propertySlug}`);
  };

  // Loading state
  if (isLoading) {
    return (
      <section id="rentals" className="py-16 lg:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-gray-900 mb-4">
              Villa Rentals
            </h2>
            <p className="text-lg text-gray-600">
              Hand-picked selection of quality places
            </p>
          </div>
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-tropical-600 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading rental properties...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }


  // No properties state
  if (rentalVillas.length === 0) {
    return (
      <section id="rentals" className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-gray-900 mb-4">
              Villa Rentals
            </h2>
            <p className="text-lg text-gray-600">
              Hand-picked selection of quality places
            </p>
          </div>
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="text-gray-400 text-6xl mb-4">🏠</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No rental properties available</h3>
              <p className="text-gray-600">Check back later for new rental properties.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="rentals" className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-serif font-bold text-gray-900 mb-4">
            Villa Rentals
          </h2>
          <p className="text-lg text-gray-600">
            Hand-picked selection of quality places
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
            aria-label="Previous villa"
          >
            <ChevronLeft className="text-gray-700" size={24} />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
            aria-label="Next villa"
          >
            <ChevronRight className="text-gray-700" size={24} />
          </button>

          {/* Carousel */}
          <div className="overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {rentalVillas.map((villa) => (
                <div key={villa.id} className="w-full flex-shrink-0">
                  <div className="grid lg:grid-cols-2 gap-8 items-center">
                    {/* Villa Image */}
                    <div className="relative">
                      <img
                        src={villa.image}
                        alt={villa.name}
                        className="w-full h-96 lg:h-[500px] object-cover rounded-2xl shadow-xl"
                      />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                        <Star
                          className="text-yellow-500"
                          size={16}
                          fill="currentColor"
                        />
                        <span className="text-sm font-semibold text-gray-700">
                          {villa.rating}
                        </span>
                      </div>
                    </div>

                    {/* Villa Details */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-2xl lg:text-3xl font-serif font-bold text-gray-900 mb-2">
                          {villa.name}
                        </h3>
                        <div className="flex items-center text-gray-600 mb-4">
                          <MapPin className="mr-2" size={18} />
                          <span className="text-sm">{villa.location}</span>
                        </div>
                        <p className="text-gray-600 leading-relaxed mb-4">
                          {villa.description}
                        </p>

                        {/* Villa Stats */}
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="text-center">
                            <div className="text-lg font-semibold text-tropical-600">
                              {villa.guests}
                            </div>
                            <div className="text-xs text-gray-500">Guests</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-semibold text-tropical-600">
                              {villa.bedrooms}
                            </div>
                            <div className="text-xs text-gray-500">
                              Bedrooms
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-semibold text-tropical-600">
                              {villa.bathrooms}
                            </div>
                            <div className="text-xs text-gray-500">
                              Bathrooms
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-3xl font-bold text-tropical-600">
                            {villa.price}
                          </span>
                          <span className="text-gray-600 ml-1">/ weekly</span>
                        </div>
                        <button
                          onClick={() => handleViewDetails(villa.slug)}
                          className="px-8 py-3 bg-tropical-600 hover:bg-tropical-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                          View Details
                        </button>
                      </div>

                      {/* Amenities */}
                      <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200">
                        {villa.amenities.slice(0, 4).map((amenity, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <div className="w-2 h-2 bg-tropical-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">
                              {amenity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-[-154px] space-x-2">
            {rentalVillas.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-tropical-600 scale-125"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RentalsSection;

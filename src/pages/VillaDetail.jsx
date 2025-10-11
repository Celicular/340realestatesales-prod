import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectVilla,
  fetchVillas
} from "../redux/slices/villaSlice";

import { CheckCircle, MapPin, X as CloseIcon, Calendar, Users, Mail, Phone, MessageSquare } from "lucide-react";

import { getRentalProperties, addVillaBookingRequest } from "../firebase/firestore";

const VillaDetails = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const villa = useSelector((state) => state.villa.selectedVilla);
  const { villas, loading: villasLoading, error: villasError } = useSelector((state) => state.villa);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [rentalProperties, setRentalProperties] = useState([]);
  
  // Booking form state
  const [bookingData, setBookingData] = useState({
    guestName: '',
    email: '',
    phone: '',
    checkInDate: '',
    checkOutDate: '',
    guests: 1,
    message: ''
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');

  // Handle keyboard navigation for modal

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isModalOpen) {
        setIsModalOpen(false);
      }

      if (isModalOpen && villa && villa.images && villa.images.length > 1) {
        if (e.key === "ArrowLeft") {
          e.preventDefault();

          const currentIndex = villa.images.indexOf(selectedImage);

          const prevIndex =
            currentIndex === 0 ? villa.images.length - 1 : currentIndex - 1;

          setSelectedImage(villa.images[prevIndex]);
        }

        if (e.key === "ArrowRight") {
          e.preventDefault();

          const currentIndex = villa.images.indexOf(selectedImage);

          const nextIndex =
            currentIndex === villa.images.length - 1 ? 0 : currentIndex + 1;

          setSelectedImage(villa.images[nextIndex]);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, selectedImage, villa]);

  useEffect(() => {
    // Fetch villas if not already loaded
    if (villas.length === 0 && !villasLoading && !villasError) {
      dispatch(fetchVillas());
    }
  }, [dispatch, villas.length, villasLoading, villasError]);

  useEffect(() => {
    // Format slug back to proper name
    const formattedName = slug
      .split("-")
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(" ");

    // Only dispatch if we have villas loaded and don't already have the correct villa selected
    if (villas.length > 0 && (!villa || villa.propertyInfo?.name !== formattedName)) {
      setIsLoading(true);
      dispatch(selectVilla(formattedName));
    } else if (villa && villa.propertyInfo?.name === formattedName) {
      setIsLoading(false);
    }
  }, [slug, dispatch, villa, villas.length]);

  // Set loading to false when villa is loaded
  useEffect(() => {
    if (villa || villasError) {
      setIsLoading(false);
    }
  }, [villa, villasError]);

  // Fetch rental properties
  useEffect(() => {
    const fetchRentalProperties = async () => {
      try {
        console.log("🔍 Fetching rental properties...");
        const result = await getRentalProperties({ status: "approved" });
        console.log("📋 Rental properties result:", result);
        if (result.success) {
          setRentalProperties(result.data);
          console.log(`✅ Loaded ${result.data.length} approved rental properties`);
        } else {
          console.error("❌ Failed to fetch rental properties:", result.error);
        }
      } catch (error) {
        console.error("❌ Error fetching rental properties:", error);
      }
    };

    fetchRentalProperties();
  }, []);

  const handleBookingInputChange = (e) => {
    const { name, value, type } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const calculateStayDuration = () => {
    if (bookingData.checkInDate && bookingData.checkOutDate) {
      const checkIn = new Date(bookingData.checkInDate);
      const checkOut = new Date(bookingData.checkOutDate);
      const diffTime = Math.abs(checkOut - checkIn);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  };

  const calculateDetailedPricing = () => {
    const nights = calculateStayDuration();
    const baseRate = nights * currentPrice;
    const cleaningFee = 200;
    const serviceFee = Math.round(baseRate * 0.05); // 5% service fee
    const taxes = Math.round((baseRate + cleaningFee + serviceFee) * 0.125); // 12.5% VI tax
    const totalAmount = baseRate + cleaningFee + serviceFee + taxes;

    return {
      baseRate,
      cleaningFee,
      serviceFee,
      taxes,
      totalAmount,
      nights
    };
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    setBookingError('');

    try {
      const nights = calculateStayDuration();
      
      if (nights <= 0) {
        throw new Error('Please select valid check-in and check-out dates');
      }

      if (!bookingData.guestName || !bookingData.email || !bookingData.phone) {
        throw new Error('Please fill in all required guest information');
      }

      // Calculate pricing
      const pricing = calculateDetailedPricing();
      
      // Determine season based on check-in date
      const checkInMonth = new Date(bookingData.checkInDate).getMonth() + 1;
      const season = (checkInMonth >= 12 || checkInMonth <= 4) ? 'inSeason' : 'offSeason';

      // Create villa property ID from slug or name
      const propertyId = villa.propertyInfo?.slug || villa.propertyInfo?.name?.toLowerCase().replace(/\s+/g, '-') || 'villa-property';

      // Create booking data matching your Firestore structure
      const bookingRequest = {
        bookingDetails: {
          checkIn: new Date(bookingData.checkInDate),
          checkOut: new Date(bookingData.checkOutDate),
          guests: bookingData.guests,
          season: season,
          totalNights: nights
        },
        guestInfo: {
          name: bookingData.guestName,
          email: bookingData.email,
          phone: bookingData.phone,
          message: bookingData.message || ''
        },
        pricing: {
          baseRate: pricing.baseRate.toString(),
          cleaningFee: pricing.cleaningFee,
          serviceFee: pricing.serviceFee,
          taxes: pricing.taxes,
          totalAmount: pricing.totalAmount.toString(),
          totalNights: nights
        },
        propertyDetails: {
          propertyId: propertyId,
          name: villa.propertyInfo?.name,
          address: villa.propertyInfo?.address,
          type: villa.propertyInfo?.type || 'Villa',
          slug: villa.propertyInfo?.slug || villa.propertyInfo?.name?.toLowerCase().replace(/\s+/g, '-')
        },
        metadata: {
          source: 'website',
          userAgent: navigator.userAgent
        },
        requestedAt: new Date(),
        status: 'pending',
        updatedAt: new Date(),
        expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000) // Expires in 48 hours
      };

      const result = await addVillaBookingRequest(propertyId, bookingRequest);
      
      if (result.success) {
        alert(`Booking request submitted successfully! Reference ID: ${result.id}`);
        
        // Reset form
        setBookingData({
          guestName: '',
          email: '',
          phone: '',
          checkInDate: '',
          checkOutDate: '',
          guests: 1,
          message: ''
        });
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setBookingError(err.message);
    } finally {
      setBookingLoading(false);
    }
  };

  if (villasLoading || isLoading) return <div className="p-6">Loading villas...</div>;
  if (villasError) return <div className="p-6 text-red-500">Error loading villas: {villasError}</div>;
  if (!villa) return <div className="p-6">Villa not found</div>;

  // Calculate dynamic pricing based on season and guests
  const calculatePrice = () => {
    // Use pricing from database structure
    const weeklyPrice = villa.pricing?.weekly || villa.pricing?.nightly || 500;
    return parseFloat(weeklyPrice);
  };

  const currentPrice = calculatePrice();

  return (
    <div className=" mx-auto px-4 py-12">
      {/* No Images Fallback */}
      {(!villa.images?.gallery || villa.images.gallery.length === 0) && !villa.images?.main && (
        <div className="mb-16">
          <div className="relative h-[400px] overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-8xl mb-6 opacity-50">🏠</div>
                <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                  Gallery Coming Soon
                </h3>
                <p className="text-gray-500">
                  Professional photos of this beautiful villa will be available
                  shortly.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Immersive Full-Screen Hero Gallery */}
      {((villa.images?.gallery && villa.images.gallery.length > 0) || villa.images?.main) && (
        <div className="relative -mx-4 -mt-12 mb-16">
          {/* Full-Screen Hero Section */}
          <div className="relative h-screen min-h-[600px] overflow-hidden">
            {/* Dynamic Background Image */}
            <div className="absolute inset-0">
              {(() => {
                // Create image array from database structure
                const imageArray = [];
                if (villa.images?.main) imageArray.push(villa.images.main);
                if (villa.images?.gallery && Array.isArray(villa.images.gallery)) {
                  villa.images.gallery.forEach(img => {
                    if (img && img !== "") imageArray.push(img);
                  });
                }
                const currentImage = selectedImage || (imageArray.length > 0 ? imageArray[0] : null);
                
                return currentImage ? (
                  <img
                    src={currentImage}
                    alt={`${villa.propertyInfo?.name} - Hero view`}
                    className="w-full h-full object-cover animate-pulse-slow"
                    loading="eager"
                    style={{
                      animation: "fadeInScale 1.5s ease-out",
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                    <div className="text-6xl opacity-50">🏠</div>
                  </div>
                );
              })()}

              {/* Multiple Overlay Layers for Depth */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            </div>

            {/* Floating Content Overlay */}
            <div className="relative z-10 h-full flex flex-col justify-between p-8 md:p-12">
              {/* Top Section - Villa Info */}
              <div className="text-white animate-fade-in-up">
                <div className="max-w-4xl">
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight animate-slide-in-left">
                    {villa.propertyInfo?.name}
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-200 mb-6 animate-slide-in-left-delay">
                    {villa.propertyInfo?.type} • {villa.details?.maxOccupancy || 'N/A'} Guests
                  </p>
                </div>
              </div>

              {/* Bottom Section - Navigation & Controls */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 animate-fade-in-up-delay">
                {/* Image Counter & Progress */}
                <div className="flex items-center gap-4">
                  {(() => {
                    // Create image array from database structure
                    const imageArray = [];
                    if (villa.images?.main) imageArray.push(villa.images.main);
                    if (villa.images?.gallery && Array.isArray(villa.images.gallery)) {
                      villa.images.gallery.forEach(img => {
                        if (img && img !== "") imageArray.push(img);
                      });
                    }
                    const currentImage = selectedImage || (imageArray.length > 0 ? imageArray[0] : null);
                    const currentIndex = currentImage ? imageArray.indexOf(currentImage) : 0;
                    const totalImages = imageArray.length;
                    
                    return totalImages > 0 ? (
                      <>
                        <div className="bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-full font-semibold">
                          {currentIndex + 1} of {totalImages}
                        </div>

                        <div className="hidden md:block w-32 h-1 bg-white/30 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-white transition-all duration-500 ease-out"
                            style={{
                              width: `${((currentIndex + 1) / totalImages) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </>
                    ) : (
                      <div className="bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-full font-semibold">
                        1 of 1
                      </div>
                    );
                  })()}
                </div>

                {/* Navigation Controls */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      // Create image array from database structure
                      const imageArray = [];
                      if (villa.images?.main) imageArray.push(villa.images.main);
                      if (villa.images?.gallery && Array.isArray(villa.images.gallery)) {
                        villa.images.gallery.forEach(img => {
                          if (img && img !== "") imageArray.push(img);
                        });
                      }
                      
                      if (imageArray.length > 1) {
                        const currentImage = selectedImage || imageArray[0];
                        const currentIndex = imageArray.indexOf(currentImage);
                        const prevIndex = currentIndex === 0 ? imageArray.length - 1 : currentIndex - 1;
                        setSelectedImage(imageArray[prevIndex]);
                      }
                    }}
                    className="group bg-white/20 hover:bg-white/30 backdrop-blur-md text-white rounded-full p-4 transition-all duration-300 hover:scale-110 hover:shadow-2xl"
                  >
                    <svg
                      className="w-6 h-6 group-hover:animate-bounce-x"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>

                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="group bg-white/20 hover:bg-white/30 backdrop-blur-md text-white rounded-full p-4 transition-all duration-300 hover:scale-110 hover:shadow-2xl"
                  >
                    <svg
                      className="w-6 h-6 group-hover:animate-pulse"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                      />
                    </svg>
                  </button>

                  <button
                    onClick={() => {
                      // Create image array from database structure
                      const imageArray = [];
                      if (villa.images?.main) imageArray.push(villa.images.main);
                      if (villa.images?.gallery && Array.isArray(villa.images.gallery)) {
                        villa.images.gallery.forEach(img => {
                          if (img && img !== "") imageArray.push(img);
                        });
                      }
                      
                      if (imageArray.length > 1) {
                        const currentImage = selectedImage || imageArray[0];
                        const currentIndex = imageArray.indexOf(currentImage);
                        const nextIndex = currentIndex === imageArray.length - 1 ? 0 : currentIndex + 1;
                        setSelectedImage(imageArray[nextIndex]);
                      }
                    }}
                    className="group bg-white/20 hover:bg-white/30 backdrop-blur-md text-white rounded-full p-4 transition-all duration-300 hover:scale-110 hover:shadow-2xl"
                  >
                    <svg
                      className="w-6 h-6 group-hover:animate-bounce-x-reverse"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Floating Thumbnail Strip */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
              <div className="flex gap-3 overflow-x-auto max-w-4xl px-4 pb-2 scrollbar-hide">
                {(() => {
                  // Create image array from database structure
                  const imageArray = [];
                  if (villa.images?.main) imageArray.push(villa.images.main);
                  if (villa.images?.gallery && Array.isArray(villa.images.gallery)) {
                    villa.images.gallery.forEach(img => {
                      if (img && img !== "") imageArray.push(img);
                    });
                  }
                  const currentImage = selectedImage || (imageArray.length > 0 ? imageArray[0] : null);
                  
                  return imageArray.map((image, index) => (
                    <div
                      key={index}
                      className={`relative flex-shrink-0 cursor-pointer transition-all duration-500 transform hover:scale-110 ${
                        currentImage === image
                          ? "ring-4 ring-white ring-offset-2 scale-110"
                          : "hover:ring-2 hover:ring-white/50"
                      }`}
                      onClick={() => setSelectedImage(image)}
                    >
                      <img
                        src={image}
                        alt={`${villa.propertyInfo?.name} - Thumbnail ${index + 1}`}
                        className="w-16 h-12 md:w-20 md:h-14 object-cover rounded-lg shadow-2xl"
                        loading="lazy"
                      />

                      <div
                        className={`absolute inset-0 rounded-lg transition-all duration-300 ${
                          currentImage === image
                            ? "bg-white/30"
                            : "bg-black/0 hover:bg-white/20"
                        }`}
                      ></div>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Fullscreen Modal */}

      {isModalOpen && selectedImage && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative max-w-6xl max-h-full w-full">
            {/* Close Button */}

            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute -top-16 right-0 text-white hover:text-gray-300 transition-all duration-300 hover:scale-110 z-20"
            >
              <div className="bg-black/50 backdrop-blur-sm rounded-full p-3">
                <CloseIcon size={28} />
              </div>
            </button>

            {/* Navigation buttons */}

            {villa && villa.images && villa.images.length > 1 && (
              <>
                <button
                  onClick={() => {
                    const currentIndex = villa.images.indexOf(selectedImage);

                    const prevIndex =
                      currentIndex === 0
                        ? villa.images.length - 1
                        : currentIndex - 1;

                    setSelectedImage(villa.images[prevIndex]);
                  }}
                  className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-all duration-300 z-20 bg-black/50 backdrop-blur-sm rounded-full p-4 hover:bg-black/70 hover:scale-110"
                >
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                <button
                  onClick={() => {
                    const currentIndex = villa.images.indexOf(selectedImage);

                    const nextIndex =
                      currentIndex === villa.images.length - 1
                        ? 0
                        : currentIndex + 1;

                    setSelectedImage(villa.images[nextIndex]);
                  }}
                  className="absolute right-6 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-all duration-300 z-20 bg-black/50 backdrop-blur-sm rounded-full p-4 hover:bg-black/70 hover:scale-110"
                >
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </>
            )}

            {/* Main Image */}

            <div className="relative flex justify-center items-center">
              <img
                src={selectedImage}
                alt="Fullscreen view"
                className="max-w-full max-h-[85vh] object-contain  shadow-2xl"
                loading="lazy"
              />

              {/* Image counter */}

              {villa && villa.images && villa.images.length > 1 && (
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white bg-black/70 backdrop-blur-sm px-6 py-3 rounded-full text-lg font-medium">
                  {villa.images.indexOf(selectedImage) + 1} of{" "}
                  {villa.images.length}
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}

            {villa && villa.images && villa.images.length > 1 && (
              <div className="mt-8 flex justify-center">
                <div className="flex gap-3 overflow-x-auto max-w-4xl pb-4 scrollbar-hide">
                  {villa.images.map((image, index) => (
                    <div
                      key={index}
                      className={`relative flex-shrink-0 cursor-pointer transition-all duration-300 ${
                        selectedImage === image
                          ? "ring-4 ring-blue-400 ring-offset-2"
                          : "hover:ring-2 hover:ring-white/50"
                      }`}
                      onClick={() => setSelectedImage(image)}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-16 h-12 object-cover rounded-lg shadow-lg"
                        loading="lazy"
                      />

                      <div
                        className={`absolute inset-0 rounded-lg transition-all duration-300 ${
                          selectedImage === image
                            ? "bg-blue-400/30"
                            : "bg-black/0 hover:bg-white/10"
                        }`}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col max-w-7xl mx-auto px-6 lg:flex-row gap-12">
        {/* Main Content */}

        <div className="flex-1 space-y-6">
          <h1 className="text-3xl font-bold text-gray-800">{villa.propertyInfo?.name}</h1>

          <p className="text-gray-500 italic flex pr-4">
            <MapPin />

            {villa.location?.address}
          </p>

          {/* <p className="text-blue-700 font-semibold">{villa.type}</p> */}

          {/* Accommodation */}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {(() => {
              // Create accommodation array from database structure
              const accommodationData = [
                {
                  label: "Type",
                  icon: "🏠",
                  value: villa.propertyInfo?.type || "Villa"
                },
                {
                  label: "Guests",
                  icon: "👥", 
                  value: `${villa.details?.maxOccupancy || "N/A"} Max`
                },
                {
                  label: "Bedrooms",
                  icon: "🛏️",
                  value: `${villa.details?.bedrooms || "N/A"} Beds`
                },
                {
                  label: "Bathrooms", 
                  icon: "🚿",
                  value: `${villa.details?.bathrooms || "N/A"} Baths`
                }
              ];

              return accommodationData.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 border rounded-lg bg-gray-50 shadow-sm flex items-start gap-3"
                >
                  <div className="text-indigo-600 text-xl mt-1">{item.icon}</div>

                  <div>
                    <p className="font-semibold text-sm text-gray-600">
                      {item.label}
                    </p>

                    <p className="text-lg font-bold text-blue-800">
                      {item.value}
                    </p>
                  </div>
                </div>
              ));
            })()}
          </div>

          {/* Description */}

          <div className="prose max-w-none text-gray-700 text-base leading-relaxed space-y-4">
            {villa.propertyInfo?.description && (
              villa.propertyInfo.description.split("\n").map((line, index) => {
                // If it's a heading (ends with ":")

                if (line.trim().endsWith(":")) {
                  return (
                    <h3
                      key={index}
                      className="text-lg font-semibold text-gray-800 mt-6"
                    >
                      {line}
                    </h3>
                  );
                }

                // If it's a bullet point

                if (line.trim().startsWith("-")) {
                  return (
                    <li key={index} className="ml-5 list-disc">
                      {line.replace("-", "").trim()}
                    </li>
                  );
                }

                // Default paragraph

                return <p key={index}>{line}</p>;
              })
            )}
          </div>

          {/* Amenities */}

          <div className="mt-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Amenities</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {(() => {
                // Create amenities array from database structure
                const amenitiesList = [];
                
                // Map the amenities object to an array
                if (villa.amenities) {
                  Object.entries(villa.amenities).forEach(([key, value]) => {
                    if (value === true) {
                      // Convert camelCase to readable format
                      const readableKey = key
                        .replace(/([A-Z])/g, ' $1')
                        .replace(/^./, str => str.toUpperCase())
                        .trim();
                      amenitiesList.push(readableKey);
                    }
                  });
                }

                return amenitiesList.length > 0 ? amenitiesList.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow"
                  >
                    <CheckCircle className="text-green-600 mt-1" size={20} />

                    <span className="text-gray-700 font-medium">{item}</span>
                  </div>
                )) : (
                  <div className="col-span-full text-center text-gray-500 py-8">
                    <p>Amenities information will be available soon.</p>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Terms */}

          <div className="mt-10 bg-white border border-gray-200 rounded-2xl p-6 shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Terms & Rules
            </h2>

            <div className="grid sm:grid-cols-1 gap-y-4 gap-x-8 text-sm text-gray-700 pl-10">
              {/* Basic Rules */}

              <div className="flex items-center gap-2">
                <span className="font-medium">Smoking:</span>

                {villa.details?.smokingAllowed ? (
                  <span className="text-green-600 font-semibold">Allowed</span>
                ) : (
                  <span className="text-red-500 font-semibold">
                    Not allowed
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="font-medium">Pets:</span>

                {villa.details?.petFriendly ? (
                  <span className="text-green-600 font-semibold">Allowed</span>
                ) : (
                  <span className="text-red-500 font-semibold">
                    Not allowed
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="font-medium">Party:</span>

                {villa.policies?.partyAllowed ? (
                  <span className="text-green-600 font-semibold">Allowed</span>
                ) : (
                  <span className="text-red-500 font-semibold">
                    Not allowed
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="font-medium">Children:</span>

                {villa.policies?.childrenAllowed ? (
                  <span className="text-green-600 font-semibold">Allowed</span>
                ) : (
                  <span className="text-red-500 font-semibold">
                    Not allowed
                  </span>
                )}
              </div>

              {/* Policies */}

              <div className="flex flex-col">
                <span className="font-medium">Cancellation Policy:</span>

                <span>{villa.policies?.cancellationPolicy || 'Standard cancellation policy applies'}</span>
              </div>

              <div className="flex flex-col">
                <span className="font-medium">Damage Policy:</span>

                <span>{villa.policies?.damagePolicy || 'Standard damage policy applies'}</span>
              </div>

              {/* House Rules */}
              {villa.policies?.houseRules && (
                <div className="flex flex-col">
                  <span className="font-medium">House Rules:</span>
                  <span>{villa.policies.houseRules}</span>
                </div>
              )}

              {/* Reservation Info */}

              <div className="mt-8">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Notes:</h3>

                <div className=" rounded-lg p-6">
                  <div className="space-y-3">
                    {villa.propertyInfo?.description && (
                      <div className="flex items-start text-gray-700">
                        <div className="flex-shrink-0 w-2 h-2 bg-black rounded-full mt-2 mr-3"></div>
                        <p className="text-sm leading-relaxed">{villa.propertyInfo.description}</p>
                      </div>
                    )}
                    
                    {/* Check-in/out times */}
                    <div className="flex items-start text-gray-700">
                      <div className="flex-shrink-0 w-2 h-2 bg-black rounded-full mt-2 mr-3"></div>
                      <p className="text-sm leading-relaxed">
                        Check-in: {villa.details?.checkInTime || '3:00 PM'} | Check-out: {villa.details?.checkOutTime || '11:00 AM'}
                      </p>
                    </div>

                    {/* Minimum stay */}
                    {villa.details?.minimumStay && (
                      <div className="flex items-start text-gray-700">
                        <div className="flex-shrink-0 w-2 h-2 bg-black rounded-full mt-2 mr-3"></div>
                        <p className="text-sm leading-relaxed">
                          Minimum stay: {villa.details.minimumStay} night{villa.details.minimumStay > 1 ? 's' : ''}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {villa.pricing?.securityDeposit && (
                <div className="flex flex-col">
                  <span className="font-medium">Security Deposit:</span>

                  <span>${villa.pricing.securityDeposit}</span>
                </div>
              )}
              
              {villa.pricing?.cleaningFee && (
                <div className="flex flex-col">
                  <span className="font-medium">Cleaning Fee:</span>

                  <span>${villa.pricing.cleaningFee}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Booking Form - Always Visible */}
        <div className="lg:w-[400px] w-full sticky top-28 h-fit bg-white border rounded-xl shadow-xl p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-green-600">
              ${villa.pricing?.weekly || villa.pricing?.nightly || 'N/A'} / Weekly
            </h2>
            {villa.pricing && (villa.pricing.monthly || villa.pricing.nightly) && (
              <p className="text-sm text-gray-500 mt-1">
                Dynamic pricing based on season and guests
              </p>
            )}
          </div>

          {bookingError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {bookingError}
            </div>
          )}

          <form onSubmit={handleBookingSubmit} className="space-y-4">
            {/* Guest Information */}
            <div className="border-b pb-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Users className="mr-2" size={18} />
                Guest Information
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="guestName"
                    value={bookingData.guestName}
                    onChange={handleBookingInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Mail className="mr-1" size={14} />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={bookingData.email}
                    onChange={handleBookingInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Phone className="mr-1" size={14} />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={bookingData.phone}
                    onChange={handleBookingInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            </div>

            {/* Booking Dates & Guests */}
            <div className="border-b pb-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Calendar className="mr-2" size={18} />
                Booking Details
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Check-in Date *</label>
                  <input
                    type="date"
                    name="checkInDate"
                    value={bookingData.checkInDate}
                    onChange={handleBookingInputChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    onFocus={(e) => e.target.showPicker && e.target.showPicker()}
                    className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Check-out Date *</label>
                  <input
                    type="date"
                    name="checkOutDate"
                    value={bookingData.checkOutDate}
                    onChange={handleBookingInputChange}
                    required
                    min={bookingData.checkInDate || new Date().toISOString().split('T')[0]}
                    onFocus={(e) => e.target.showPicker && e.target.showPicker()}
                    className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Number of Guests *</label>
                  <select
                    name="guests"
                    value={bookingData.guests}
                    onChange={handleBookingInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[...Array(villa.details?.maxOccupancy || 8)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1} Guest{i > 0 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="border-b pb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <MessageSquare className="mr-1" size={14} />
                Message to Host
              </h4>
              <textarea
                name="message"
                value={bookingData.message}
                onChange={handleBookingInputChange}
                rows={3}
                className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Any special requests or questions..."
              />
            </div>

            {/* Pricing Breakdown */}
            {calculateStayDuration() > 0 && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Pricing Breakdown</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{calculateStayDuration()} night{calculateStayDuration() > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base Rate:</span>
                    <span>${calculateDetailedPricing().baseRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cleaning Fee:</span>
                    <span>${calculateDetailedPricing().cleaningFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service Fee:</span>
                    <span>${calculateDetailedPricing().serviceFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">VI Hotel Tax (12.5%):</span>
                    <span>${calculateDetailedPricing().taxes}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total Amount:</span>
                    <span className="text-lg text-blue-600">${calculateDetailedPricing().totalAmount}</span>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={bookingLoading}
              className="w-full bg-indigo-600 text-white rounded-md py-3 hover:bg-indigo-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {bookingLoading ? 'Submitting Request...' : 'Submit Booking Request'}
            </button>
            
            <div className="text-center text-xs text-gray-600">
              <p>• No booking fees</p>
              <p>• 50% deposit required to secure reservation</p>
              <p>• Balance due 60 days prior to arrival</p>
            </div>
          </form>
        </div>
      </div>

      {/* Rental Properties Section */}

      {rentalProperties.length > 0 && (
        <div className="mt-16 max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Available Rental Properties
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rentalProperties.map((rental) => (
              <Link
                key={rental.id}
                to={`/rental/${rental.propertyInfo?.slug || rental.id}`}
                className="block bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow hover:shadow-lg"
              >
                {/* Property Image */}

                {rental.images?.main && (
                  <div className="relative h-48 overflow-hidden rounded-t-xl">
                    <img
                      src={rental.images.main}
                      alt={rental.propertyInfo?.name || "Rental Property"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Property Content */}

                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {rental.propertyInfo?.name || "Unnamed Property"}
                  </h3>

                  <p className="text-gray-600 text-sm mb-3 flex items-center gap-2">
                    <MapPin size={16} />

                    {rental.location?.address || "Address not available"}
                  </p>

                  <p className="text-blue-700 font-medium mb-3">
                    {rental.propertyInfo?.type || "Property Type"}
                  </p>

                  {/* Accommodation Details */}

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Guests</p>

                      <p className="font-semibold text-gray-800">
                        {rental.details?.maxOccupancy || "N/A"}
                      </p>
                    </div>

                    <div className="text-center">
                      <p className="text-xs text-gray-500">Bedrooms</p>

                      <p className="font-semibold text-gray-800">
                        {rental.details?.bedrooms || "N/A"}
                      </p>
                    </div>

                    <div className="text-center">
                      <p className="text-xs text-gray-500">Bathrooms</p>

                      <p className="font-semibold text-gray-800">
                        {rental.details?.bathrooms || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Price */}

                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-600">
                      Price per Weekly
                    </span>

                    <span className="text-lg font-bold text-blue-600">
                      ${rental.pricing?.weekly || rental.pricing?.nightly || "N/A"}
                    </span>
                  </div>

                  {/* Description */}

                  {rental.propertyInfo?.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {rental.propertyInfo.description}
                    </p>
                  )}

                  {/* Amenities */}

                  {rental.amenities && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-2">
                        Key Amenities
                      </p>

                      <div className="flex flex-wrap gap-1">
                        {(() => {
                          // Convert amenities object to array
                          const amenitiesList = [];
                          if (typeof rental.amenities === 'object') {
                            Object.entries(rental.amenities).forEach(([key, value]) => {
                              if (value === true) {
                                const readableKey = key
                                  .replace(/([A-Z])/g, ' $1')
                                  .replace(/^./, str => str.toUpperCase())
                                  .trim();
                                amenitiesList.push(readableKey);
                              }
                            });
                          }

                          return amenitiesList.slice(0, 4).map((amenity, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                            >
                              {amenity}
                            </span>
                          )).concat(
                            amenitiesList.length > 4 ? [
                              <span key="more" className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                +{amenitiesList.length - 4} more
                              </span>
                            ] : []
                          );
                        })()}
                      </div>
                    </div>
                  )}

                  {/* Agent Info */}

                  <div className="border-t pt-3">
                    <p className="text-xs text-gray-500">Listed by</p>

                    <p className="text-sm font-medium text-gray-700">
                      {rental.agentInfo?.name || "Agent"}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VillaDetails;

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle, MapPin, X as CloseIcon, Calendar, Users, Mail, Phone, MessageSquare } from "lucide-react";
import { IoHomeOutline, IoBed } from "react-icons/io5";
import { BiMaleFemale } from "react-icons/bi";
import { getRentalProperties, addBookingRequest } from "../firebase/firestore";
import { sendBookingNotificationToAgent, sendBookingConfirmationToGuest } from "../services/emailService";

const RentalDetail = () => {
  const { slug } = useParams();
  const [rental, setRental] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Helper function to get valid images from rental data
  const getValidImages = (rental) => {
    const imageArray = [];
    
    console.log('🖼️ Image processing for rental:', rental?.propertyInfo?.name);
    console.log('📸 Media object:', rental?.media);
    
    if (rental?.media?.imageLinks && Array.isArray(rental.media.imageLinks)) {
      console.log('📋 ImageLinks array:', rental.media.imageLinks);
      rental.media.imageLinks.forEach((img, index) => {
        if (img && typeof img === 'string' && img.trim() !== "") {
          console.log(`✅ Adding image ${index + 1}:`, img);
          imageArray.push(img);
        } else {
          console.log(`❌ Skipping invalid image ${index + 1}:`, img);
        }
      });
    } else {
      console.log('❌ No valid imageLinks array');
    }
    
    console.log('🎯 Final image array:', imageArray);
    return imageArray;
  };
  
  // Inline booking form state
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

      if (isModalOpen && rental && rental.media?.imageLinks) {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          const imageArray = getValidImages(rental);
          
          if (imageArray.length > 1) {
            const currentIndex = imageArray.indexOf(selectedImage);
            const prevIndex = currentIndex === 0 ? imageArray.length - 1 : currentIndex - 1;
            setSelectedImage(imageArray[prevIndex]);
          }
        }
        if (e.key === "ArrowRight") {
          e.preventDefault();
          const imageArray = getValidImages(rental);
          
          if (imageArray.length > 1) {
            const currentIndex = imageArray.indexOf(selectedImage);
            const nextIndex = currentIndex === imageArray.length - 1 ? 0 : currentIndex + 1;
            setSelectedImage(imageArray[nextIndex]);
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, selectedImage, rental]);

  useEffect(() => {
    const fetchRental = async () => {
      try {
        setIsLoading(true);
        console.log('🔍 Fetching rental property with slug:', slug);
        const result = await getRentalProperties({ status: 'approved' });
        console.log('📋 Rental properties result:', result);
        
        if (result.success) {
          console.log(`✅ Found ${result.data.length} approved rental properties`);
          const foundRental = result.data.find(r => r.propertyInfo?.slug === slug);
          console.log('🏠 Found rental for slug:', slug, foundRental);
          
          if (foundRental) {
            setRental(foundRental);
            console.log('📊 Rental data structure:', foundRental);
            console.log('📍 Address data:', {
              'propertyInfo.address': foundRental.propertyInfo?.address,
              'location.address': foundRental.location?.address,
              'address': foundRental.address
            });
            console.log('🏨 Amenities data:', foundRental.amenities);
            
            // Set the first available image using helper function
            const imageArray = getValidImages(foundRental);
            if (imageArray.length > 0) {
              setSelectedImage(imageArray[0]);
            }
            console.log('🖼️ Available images:', imageArray);
          } else {
            console.warn('❌ No rental found with slug:', slug);
            console.log('Available slugs:', result.data.map(r => r.propertyInfo?.slug));
          }
        } else {
          console.error('❌ Failed to fetch rental properties:', result.error);
        }
      } catch (error) {
        console.error('❌ Error fetching rental property:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRental();
  }, [slug]);

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
    // Handle different pricing formats from database
    let baseNightlyRate = 0;
    
    if (rental.propertyInfo?.pricePerNight) {
      baseNightlyRate = parseFloat(rental.propertyInfo.pricePerNight);
    } else {
      baseNightlyRate = 100; // Default fallback
    }
    
    const baseRate = nights * baseNightlyRate;
    const cleaningFee = 200; // Fixed cleaning fee
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
          propertyId: rental.id,
          name: rental.propertyInfo?.name,
          address: rental.propertyInfo?.address,
          type: rental.propertyInfo?.type,
          slug: slug
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

      // Submit booking request to Firebase
      const result = await addBookingRequest(rental.id, bookingRequest);
      
      if (result.success) {
        // Send email notifications
        try {
          // Get agent email - check multiple possible locations
          const agentEmail = rental?.agentInfo?.email || 
                           rental?.agentEmail || 
                           'agent.demo@340realestate.com'; // Fallback to demo email

          console.log('Sending booking notification to agent:', agentEmail);
          
          // Send notification to agent
          const agentEmailResult = await sendBookingNotificationToAgent(
            bookingRequest, 
            rental, 
            agentEmail
          );

          if (agentEmailResult.success) {
            console.log('✅ Agent notification sent successfully:', agentEmailResult.message);
          } else {
            console.error('❌ Failed to send agent notification:', agentEmailResult.error);
          }

          // Send confirmation to guest
          const guestEmailResult = await sendBookingConfirmationToGuest(
            bookingRequest, 
            rental
          );

          if (guestEmailResult.success) {
            console.log('✅ Guest confirmation sent successfully:', guestEmailResult.message);
          } else {
            console.error('❌ Failed to send guest confirmation:', guestEmailResult.error);
          }

          // Show success message with email info
          const emailInfo = agentEmailResult.emailInfo;
          const successMessage = emailInfo 
            ? `🎉 Booking request submitted successfully!

📧 Agent Notification: The property agent (${emailInfo.agentName}) has been notified at ${emailInfo.sentTo}

🏡 Property: ${emailInfo.propertyName}
📋 Reference ID: ${result.id}

You will receive a response within 24 hours. A confirmation email has also been sent to ${bookingData.email}.

💡 Payment Terms: 50% deposit required within 7-9 days to secure reservation. Balance due 60 days prior to arrival.`
            : `🎉 Booking request submitted successfully!

📋 Reference ID: ${result.id}

The property owner has been notified and will respond within 24 hours.`;

          alert(successMessage);

        } catch (emailError) {
          console.error('Email sending error:', emailError);
          
          // Even if email fails, booking was still submitted successfully
          const fallbackMessage = `✅ Booking request submitted successfully!

📋 Reference ID: ${result.id}

Your booking request has been saved to our system and will be processed manually.

⚠️ Note: There was an issue sending email notifications, but your booking request is still valid.

📞 For immediate assistance, contact us at +1 (340) 555-0123.`;

          alert(fallbackMessage);
        }
        
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading rental property...</p>
        </div>
      </div>
    );
  }

  if (!rental) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Rental Property Not Found</h2>
          <p className="text-gray-600 mb-6">The rental property you're looking for doesn't exist or has been removed.</p>
          <Link to="/properties" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Browse All Properties
          </Link>
        </div>
      </div>
    );
  }

  // Create accommodation array similar to villa structure
  const accommodation = [
    {
      label: "Type",
      icon: <IoHomeOutline />,
      value: rental.propertyInfo?.type || "Entire Place / Villa"
    },
    {
      icon: <BiMaleFemale />,
      label: "Guests",
      value: `${rental.accommodation?.maxGuests || "N/A"} Guests`
    },
    {
      icon: <IoBed />,
      label: "Bedrooms",
      value: `${rental.accommodation?.bedrooms || "N/A"} Bedrooms`
    },
    {
      icon: <IoHomeOutline />,
      label: "Bathrooms",
      value: `${rental.accommodation?.bathrooms || "N/A"} Full`
    }
  ];

  return (
    <div className=" mx-auto px-4 py-12">
      {/* Immersive Full-Screen Hero Gallery */}
      {getValidImages(rental).length > 0 && (
        <div className="relative -mx-4 -mt-12 mb-16">
          {/* Full-Screen Hero Section */}
          <div className="relative h-screen min-h-[600px] overflow-hidden">
            {/* Dynamic Background Image */}
            <div className="absolute inset-0">
              {(() => {
                const imageArray = getValidImages(rental);
                const currentImage = selectedImage || (imageArray.length > 0 ? imageArray[0] : null);
                
                return currentImage ? (
                  <img
                    src={currentImage}
                    alt={`${rental.propertyInfo?.name || 'Rental Property'} - Hero view`}
                    className="w-full h-full object-cover animate-pulse-slow"
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
              {/* Top Section - Property Info */}
              <div className="text-white animate-fade-in-up">
                <div className="max-w-4xl">
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight animate-slide-in-left">
                    {rental.propertyInfo?.name || 'Beautiful Rental Property'}
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-200 mb-6 animate-slide-in-left-delay">
                    {rental.propertyInfo?.type || 'Property Type'} • {rental.details?.maxOccupancy || "N/A"} Guests
                  </p>

                  <div className="flex flex-wrap gap-4 animate-slide-in-left-delay-2">
                    {accommodation.slice(0, 3).map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full"
                      >
                        <span className="text-white">{item.icon}</span>
                        <span className="text-white font-medium">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Section - Navigation & Controls */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 animate-fade-in-up-delay">
                {/* Image Counter & Progress */}
                <div className="flex items-center gap-4">
                  {(() => {
                    const imageArray = getValidImages(rental);
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
                      const imageArray = getValidImages(rental);
                      
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
                      const imageArray = getValidImages(rental);
                      
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
                  const imageArray = getValidImages(rental);
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
                        alt={`${rental.propertyInfo?.name} - Thumbnail ${index + 1}`}
                        className="w-16 h-12 md:w-20 md:h-14 object-cover rounded-lg shadow-2xl"
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

      {/* No Images Fallback */}
      {getValidImages(rental).length === 0 && (
        <div className="mb-16">
          <div className="relative h-[400px] overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-8xl mb-6 opacity-50">🏠</div>
                <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                  Gallery Coming Soon
                </h3>
                <p className="text-gray-500">
                  Professional photos of this beautiful property will be available
                  shortly.
                </p>
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
            {getValidImages(rental).length > 1 && (
              <>
                <button
                  onClick={() => {
                    const imageArray = getValidImages(rental);
                    const currentIndex = imageArray.indexOf(selectedImage);
                    const prevIndex = currentIndex === 0 ? imageArray.length - 1 : currentIndex - 1;
                    setSelectedImage(imageArray[prevIndex]);
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
                    const imageArray = getValidImages(rental);
                    const currentIndex = imageArray.indexOf(selectedImage);
                    const nextIndex = currentIndex === imageArray.length - 1 ? 0 : currentIndex + 1;
                    setSelectedImage(imageArray[nextIndex]);
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
              />

              {/* Image counter */}
              {getValidImages(rental).length > 1 && (
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white bg-black/70 backdrop-blur-sm px-6 py-3 rounded-full text-lg font-medium">
                  {(() => {
                    const imageArray = getValidImages(rental);
                    const currentIndex = imageArray.indexOf(selectedImage);
                    return `${currentIndex + 1} of ${imageArray.length}`;
                  })()}
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {getValidImages(rental).length > 1 && (
              <div className="mt-8 flex justify-center">
                <div className="flex gap-3 overflow-x-auto max-w-4xl pb-4 scrollbar-hide">
                  {getValidImages(rental).map((image, index) => (
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
          <h1 className="text-3xl font-bold text-gray-800">{rental.propertyInfo?.name || 'Unnamed Property'}</h1>

          <div className="flex flex-col space-y-2">
            <p className="text-gray-500 italic flex items-center gap-2">
              <MapPin size={16} />
              {rental.propertyInfo?.address || rental.location?.address || rental.address || 'Address not available'}
            </p>
            {(rental.location?.city || rental.location?.state) && (
              <p className="text-gray-600 text-sm ml-6">
                {[rental.location?.city, rental.location?.state].filter(Boolean).join(', ')}
                {rental.location?.zipCode && ` ${rental.location.zipCode}`}
              </p>
            )}
          </div>

          <p className="text-blue-700 font-semibold">{rental.propertyInfo?.type || 'Property Type'}</p>

          {/* Accommodation */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {accommodation.map((item, idx) => (
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
            ))}
          </div>

          {/* Description */}
          <div className="prose max-w-none text-gray-700 text-base leading-relaxed space-y-4">
            {(rental.propertyInfo?.description || rental.description) && (
              <p>{rental.propertyInfo?.description || rental.description}</p>
            )}
          </div>

          {/* Debug Section - Remove this in production */}
         
          {/* Property Details */}
          {(rental.details?.squareFeet || rental.details?.yearBuilt || rental.location?.neighborhood) && (
            <div className="mt-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Property Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rental.details?.squareFeet && (
                  <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
                    <h3 className="font-semibold text-gray-800 mb-1">Square Feet</h3>
                    <p className="text-gray-600">{rental.details.squareFeet} sq ft</p>
                  </div>
                )}
                {rental.details?.yearBuilt && (
                  <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
                    <h3 className="font-semibold text-gray-800 mb-1">Year Built</h3>
                    <p className="text-gray-600">{rental.details.yearBuilt}</p>
                  </div>
                )}
                {rental.location?.neighborhood && (
                  <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
                    <h3 className="font-semibold text-gray-800 mb-1">Neighborhood</h3>
                    <p className="text-gray-600">{rental.location.neighborhood}</p>
                  </div>
                )}
                {rental.details?.furnished !== undefined && (
                  <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
                    <h3 className="font-semibold text-gray-800 mb-1">Furnished</h3>
                    <p className="text-gray-600">{rental.details.furnished ? 'Yes' : 'No'}</p>
                  </div>
                )}
                {rental.location?.zipCode && (
                  <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
                    <h3 className="font-semibold text-gray-800 mb-1">Zip Code</h3>
                    <p className="text-gray-600">{rental.location.zipCode}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Pricing Information */}
          {rental.pricing && (
            <div className="mt-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Pricing</h2>
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rental.pricing.nightly && (
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-semibold text-gray-800 mb-1">Nightly Rate</h3>
                      <p className="text-2xl font-bold text-blue-600">${rental.pricing.nightly}</p>
                    </div>
                  )}
                  {rental.pricing.weekly && (
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <h3 className="font-semibold text-gray-800 mb-1">Weekly Rate</h3>
                      <p className="text-2xl font-bold text-green-600">${rental.pricing.weekly}</p>
                    </div>
                  )}
                  {rental.pricing.monthly && (
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <h3 className="font-semibold text-gray-800 mb-1">Monthly Rate</h3>
                      <p className="text-2xl font-bold text-purple-600">${rental.pricing.monthly}</p>
                    </div>
                  )}
                </div>
                
                {(rental.pricing.cleaningFee || rental.pricing.securityDeposit) && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-3">Additional Fees</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      {rental.pricing.cleaningFee && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Cleaning Fee:</span>
                          <span className="font-medium">${rental.pricing.cleaningFee}</span>
                        </div>
                      )}
                      {rental.pricing.securityDeposit && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Security Deposit:</span>
                          <span className="font-medium">${rental.pricing.securityDeposit}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Amenities */}
          {(rental.amenities || rental.propertyInfo?.amenities || rental.features) && (
            <div className="mt-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Amenities</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
                {(() => {
                  const amenitiesList = [];
                  
                  // Try different possible locations for amenities
                  const amenitiesData = rental.amenities || rental.propertyInfo?.amenities || rental.features;
                  console.log('🏨 Processing amenities:', amenitiesData, 'Type:', typeof amenitiesData);
                  
                  if (Array.isArray(amenitiesData)) {
                    // Handle array format
                    console.log('📋 Amenities is array:', amenitiesData);
                    amenitiesData.forEach(item => {
                      if (item && typeof item === 'string' && item.trim() !== '') {
                        amenitiesList.push(item.trim());
                      }
                    });
                  } else if (typeof amenitiesData === 'object' && amenitiesData !== null) {
                    // Handle object format with boolean values
                    console.log('📋 Amenities is object:', amenitiesData);
                    Object.entries(amenitiesData).forEach(([key, value]) => {
                      if (value === true || value === 'true' || value === 1) {
                        const readableKey = key
                          .replace(/([A-Z])/g, ' $1')
                          .replace(/^./, str => str.toUpperCase())
                          .trim();
                        amenitiesList.push(readableKey);
                      }
                    });
                  }
                  
                  console.log('✅ Final amenities list:', amenitiesList);

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
                      <p className="text-xs mt-2">Debug: {JSON.stringify(amenitiesData)}</p>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* Rates Section */}
          {/* {rental.rates && (rental.rates.inSeason || rental.rates.offSeason) && (
            <div className="mt-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Rates</h2>
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex gap-4 mb-6">
                  <button
                    onClick={() => setSelectedSeason("inSeason")}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedSeason === "inSeason"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    In Season
                  </button>
                  <button
                    onClick={() => setSelectedSeason("offSeason")}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedSeason === "offSeason"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Off Season
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {rental.rates[selectedSeason]?.oneToFour && (
                    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-gray-800">1-4 guests</span>
                        <span className="text-lg font-bold text-blue-600">${rental.rates[selectedSeason].oneToFour}/weekly</span>
                      </div>
                    </div>
                  )}
                  {rental.rates[selectedSeason]?.fiveToSix && (
                    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-gray-800">5-6 guests</span>
                        <span className="text-lg font-bold text-blue-600">${rental.rates[selectedSeason].fiveToSix}/weekly</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )} */}

          {/* Terms */}
          <div className="mt-10 bg-white border border-gray-200 rounded-2xl p-6 shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Terms & Rules
            </h2>

            <div className="grid sm:grid-cols-1 gap-y-4 gap-x-8 text-sm text-gray-700 pl-10">
              {/* Basic Rules */}
              <div className="flex items-center gap-2">
                <span className="font-medium">Smoking:</span>

                {rental.details?.smokingAllowed ? (
                  <span className="text-green-600 font-semibold">Allowed</span>
                ) : (
                  <span className="text-red-500 font-semibold">
                    Not allowed
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="font-medium">Pets:</span>

                {rental.details?.petFriendly ? (
                  <span className="text-green-600 font-semibold">Allowed</span>
                ) : (
                  <span className="text-red-500 font-semibold">
                    Not allowed
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="font-medium">Party:</span>

                {rental.policies?.partyAllowed ? (
                  <span className="text-green-600 font-semibold">Allowed</span>
                ) : (
                  <span className="text-red-500 font-semibold">
                    Not allowed
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="font-medium">Children:</span>

                {rental.policies?.childrenAllowed ? (
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
                <span>{rental.policies?.cancellationPolicy || 'Standard cancellation policy applies'}</span>
              </div>

              <div className="flex flex-col">
                <span className="font-medium">Damage Policy:</span>
                <span>{rental.policies?.damagePolicy || 'Standard damage policy applies'}</span>
              </div>

              {/* House Rules */}
              {rental.policies?.houseRules && (
                <div className="flex flex-col">
                  <span className="font-medium">House Rules:</span>
                  <span>{rental.policies.houseRules}</span>
                </div>
              )}

              {/* Check-in/out Information */}
              <div className="flex flex-col">
                <span className="font-medium">Check-in Time:</span>
                <span>{rental.details?.checkInTime || '3:00 PM'}</span>
              </div>

              <div className="flex flex-col">
                <span className="font-medium">Check-out Time:</span>
                <span>{rental.details?.checkOutTime || '11:00 AM'}</span>
              </div>

              {rental.details?.minimumStay && (
                <div className="flex flex-col">
                  <span className="font-medium">Minimum Stay:</span>
                  <span>{rental.details.minimumStay} night{rental.details.minimumStay > 1 ? 's' : ''}</span>
                </div>
              )}

              {/* Pricing Information */}
              {rental.pricing?.securityDeposit && (
                <div className="flex flex-col">
                  <span className="font-medium">Security Deposit:</span>
                  <span>${rental.pricing.securityDeposit}</span>
                </div>
              )}
              
              {rental.pricing?.cleaningFee && (
                <div className="flex flex-col">
                  <span className="font-medium">Cleaning Fee:</span>
                  <span>${rental.pricing.cleaningFee}</span>
                </div>
              )}

              {/* Additional Notes */}
              {rental.propertyInfo?.description && (
                <div className="mt-8">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Additional Information:</h3>
                  <div className="rounded-lg p-6">
                    <p className="text-sm leading-relaxed text-gray-700">{rental.propertyInfo.description}</p>
                  </div>
                </div>
              )}

              {/* Agent Information */}
              {rental.agentInfo && (
                <div className="mt-8">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Listed by:</h3>
                  <div className="rounded-lg p-6 bg-gray-50">
                    <p className="text-sm leading-relaxed text-gray-700">
                      <span className="font-medium">{rental.agentInfo.name}</span>
                      {rental.agentInfo.email && (
                        <span className="block text-gray-600">{rental.agentInfo.email}</span>
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Booking Form - Always Visible */}
        <div className="lg:w-[400px] w-full sticky top-28 h-fit bg-white border rounded-xl shadow-xl p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-green-600">
              ${rental.propertyInfo?.pricePerNight || 'N/A'} / Night
            </h2>
            <div className="text-sm text-gray-500 mt-1">
              <p>Dynamic pricing based on season and duration</p>
            </div>
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
                    {[...Array(rental.accommodation?.maxGuests || 8)].map((_, i) => (
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

    </div>
  );
};

export default RentalDetail;
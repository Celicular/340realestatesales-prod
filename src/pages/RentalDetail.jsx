import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle, MapPin, X as CloseIcon } from "lucide-react";
import { IoHomeOutline, IoBed } from "react-icons/io5";
import { BiMaleFemale } from "react-icons/bi";
import { getRentalProperties } from "../firebase/firestore";

const RentalDetail = () => {
  const { slug } = useParams();
  const [rental, setRental] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState("inSeason");
  const [selectedGuests, setSelectedGuests] = useState(1);

  // Handle keyboard navigation for modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isModalOpen) {
        setIsModalOpen(false);
      }

      if (isModalOpen && rental && rental.media?.imageLinks && rental.media.imageLinks.length > 1) {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          const currentIndex = rental.media.imageLinks.indexOf(selectedImage);
          const prevIndex =
            currentIndex === 0 ? rental.media.imageLinks.length - 1 : currentIndex - 1;
          setSelectedImage(rental.media.imageLinks[prevIndex]);
        }
        if (e.key === "ArrowRight") {
          e.preventDefault();
          const currentIndex = rental.media.imageLinks.indexOf(selectedImage);
          const nextIndex =
            currentIndex === rental.media.imageLinks.length - 1 ? 0 : currentIndex + 1;
          setSelectedImage(rental.media.imageLinks[nextIndex]);
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
        const result = await getRentalProperties({ status: 'approved' });
        if (result.success) {
          const foundRental = result.data.find(r => r.propertyInfo?.slug === slug);
          if (foundRental) {
            setRental(foundRental);
            if (foundRental.media?.imageLinks?.length > 0) {
              setSelectedImage(foundRental.media.imageLinks[0]);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching rental property:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRental();
  }, [slug]);

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
      {rental.media?.imageLinks && rental.media.imageLinks.length > 0 && (
        <div className="relative -mx-4 -mt-12 mb-16">
          {/* Full-Screen Hero Section */}
          <div className="relative h-screen min-h-[600px] overflow-hidden">
            {/* Dynamic Background Image */}
            <div className="absolute inset-0">
              <img
                src={selectedImage || rental.media.imageLinks[0]}
                alt={`${rental.propertyInfo?.name || 'Rental Property'} - Hero view`}
                className="w-full h-full object-cover animate-pulse-slow"
                style={{
                  animation: "fadeInScale 1.5s ease-out",
                }}
              />

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
                  <p className="text-xl md:text-2xl text-gray-200 mb-6 animate-slide-in-left-delay">
                    {/* ?{rental.propertyInfo?.type || 'Property Type'} • {rental.accommodation?.maxGuests || "N/A"} Guests */}
                  </p>

                  <div className="flex flex-wrap gap-4 animate-slide-in-left-delay-2">
                    {accommodation.slice(0, 3).map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2  px-4 py-2 rounded-full"
                      >
                        {/* <span className="text-white">{item.icon}</span> */}
                        {/* <span className="text-white font-medium">
                          {item.value}
                        </span> */}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Section - Navigation & Controls */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 animate-fade-in-up-delay">
                {/* Image Counter & Progress */}
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-full font-semibold">
                    {rental.media.imageLinks.indexOf(selectedImage || rental.media.imageLinks[0]) + 1}{" "}
                    of {rental.media.imageLinks.length}
                  </div>

                  <div className="hidden md:block w-32 h-1 bg-white/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white transition-all duration-500 ease-out"
                      style={{
                        width: `${
                          ((rental.media.imageLinks.indexOf(
                            selectedImage || rental.media.imageLinks[0]
                          ) +
                            1) /
                            rental.media.imageLinks.length) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Navigation Controls */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      const currentIndex = rental.media.imageLinks.indexOf(
                        selectedImage || rental.media.imageLinks[0]
                      );

                      const prevIndex =
                        currentIndex === 0
                          ? rental.media.imageLinks.length - 1
                          : currentIndex - 1;

                      setSelectedImage(rental.media.imageLinks[prevIndex]);
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
                      const currentIndex = rental.media.imageLinks.indexOf(
                        selectedImage || rental.media.imageLinks[0]
                      );

                      const nextIndex =
                        currentIndex === rental.media.imageLinks.length - 1
                          ? 0
                          : currentIndex + 1;

                      setSelectedImage(rental.media.imageLinks[nextIndex]);
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
                {rental.media.imageLinks.map((image, index) => (
                  <div
                    key={index}
                    className={`relative flex-shrink-0 cursor-pointer transition-all duration-500 transform hover:scale-110 ${
                      (selectedImage || rental.media.imageLinks[0]) === image
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
                        (selectedImage || rental.media.imageLinks[0]) === image
                          ? "bg-white/30"
                          : "bg-black/0 hover:bg-white/20"
                      }`}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No Images Fallback */}
      {(!rental.media?.imageLinks || rental.media.imageLinks.length === 0) && (
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
            {rental && rental.media.imageLinks && rental.media.imageLinks.length > 1 && (
              <>
                <button
                  onClick={() => {
                    const currentIndex = rental.media.imageLinks.indexOf(selectedImage);

                    const prevIndex =
                      currentIndex === 0
                        ? rental.media.imageLinks.length - 1
                        : currentIndex - 1;

                    setSelectedImage(rental.media.imageLinks[prevIndex]);
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
                    const currentIndex = rental.media.imageLinks.indexOf(selectedImage);

                    const nextIndex =
                      currentIndex === rental.media.imageLinks.length - 1
                        ? 0
                        : currentIndex + 1;

                    setSelectedImage(rental.media.imageLinks[nextIndex]);
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
              {rental && rental.media.imageLinks && rental.media.imageLinks.length > 1 && (
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white bg-black/70 backdrop-blur-sm px-6 py-3 rounded-full text-lg font-medium">
                  {rental.media.imageLinks.indexOf(selectedImage) + 1} of{" "}
                  {rental.media.imageLinks.length}
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {rental && rental.media.imageLinks && rental.media.imageLinks.length > 1 && (
              <div className="mt-8 flex justify-center">
                <div className="flex gap-3 overflow-x-auto max-w-4xl pb-4 scrollbar-hide">
                  {rental.media.imageLinks.map((image, index) => (
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

          <p className="text-gray-500 italic flex pr-4">
            <MapPin />
            {rental.propertyInfo?.address || 'Address not available'}
          </p>

          {/* <p className="text-blue-700 font-semibold">{rental.propertyInfo?.type || 'Property Type'}</p> */}

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
            {rental.description && (
              <p>{rental.description}</p>
            )}
          </div>

          {/* Amenities */}
          {rental.amenities && rental.amenities.length > 0 && (
            <div className="mt-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Amenities</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
                {rental.amenities.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow"
                  >
                    <CheckCircle className="text-green-600 mt-1" size={20} />
                    <span className="text-gray-700 font-medium">{item}</span>
                  </div>
                ))}
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

                {rental.smoking ? (
                  <span className="text-green-600 font-semibold">Allowed</span>
                ) : (
                  <span className="text-red-500 font-semibold">
                    Not allowed
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="font-medium">Pets:</span>

                {rental.pets ? (
                  <span className="text-green-600 font-semibold">Allowed</span>
                ) : (
                  <span className="text-red-500 font-semibold">
                    Not allowed
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="font-medium">Party:</span>

                {rental.party ? (
                  <span className="text-green-600 font-semibold">Allowed</span>
                ) : (
                  <span className="text-red-500 font-semibold">
                    Not allowed
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="font-medium">Children:</span>

                {rental.children ? (
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

                <span>{rental.cancellationPolicy || 'Standard cancellation policy applies'}</span>
              </div>

              <div className="flex flex-col">
                <span className="font-medium">Damage Policy:</span>

                <span>{rental.damagePolicy || 'Standard damage policy applies'}</span>
              </div>

              {/* Additional Notes */}
              {rental.notes && (
                <div className="mt-8">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Notes:</h3>

                  <div className=" rounded-lg p-6">
                    <p className="text-sm leading-relaxed text-gray-700">{rental.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Booking Sidebar */}
        <div className="lg:w-[350px] w-full sticky top-28 h-fit bg-white border rounded-xl shadow-xl p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-green-600">
              ${rental.propertyInfo?.pricePerNight || 'N/A'} / Weekly
            </h2>

            {rental.rates && (rental.rates.inSeason || rental.rates.offSeason) && (
              <p className="text-sm text-gray-500 mt-1">
                Dynamic pricing based on season and guests
              </p>
            )}
          </div>

          {/* Season Selection */}
          {rental.rates && (rental.rates.inSeason || rental.rates.offSeason) && (
            <div className="space-y-3">
              <label className="text-sm font-medium">Season</label>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedSeason("inSeason")}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                    selectedSeason === "inSeason"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  In Season
                </button>

                <button
                  onClick={() => setSelectedSeason("offSeason")}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                    selectedSeason === "offSeason"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Off Season
                </button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <label className="text-sm font-medium">Check-in</label>

            <input
              type="date"
              onFocus={(e) => e.target.showPicker && e.target.showPicker()}
              className="w-full border px-3 py-2 rounded-md"
            />

            <label className="text-sm font-medium">Check-out</label>

            <input
              type="date"
              onFocus={(e) => e.target.showPicker && e.target.showPicker()}
              className="w-full border px-3 py-2 rounded-md"
            />

            <label className="text-sm font-medium">Guests</label>

            <input
              type="number"
              min={1}
              className="w-full border px-3 py-2 rounded-md"
              value={selectedGuests}
              onChange={(e) => setSelectedGuests(Number(e.target.value))}
            />

            <label className="text-sm font-medium">Message to Host</label>

            <textarea
              className="w-full border px-3 py-2 rounded-md"
              rows={3}
              placeholder="Add a message to the host..."
            />

            <button className="w-full bg-indigo-600 text-white rounded-md py-2 hover:bg-indigo-700 transition font-medium">
              Request to Book
            </button>
          </div>

          {/* Pricing Breakdown */}
          {rental.rates && (rental.rates.inSeason || rental.rates.offSeason) && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Pricing Breakdown
              </h3>

              <div className="space-y-2 text-sm">
                {rental.rates[selectedSeason]?.oneToFour && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">1-4 guests</span>

                    <span
                      className={`font-medium ${
                        selectedGuests >= 1 && selectedGuests <= 4
                          ? "text-blue-600"
                          : "text-gray-900"
                      }`}
                    >
                      ${rental.rates[selectedSeason].oneToFour}/weekly
                    </span>
                  </div>
                )}

                {rental.rates[selectedSeason]?.fiveToSix && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">5-6 guests</span>

                    <span
                      className={`font-medium ${
                        selectedGuests >= 5 && selectedGuests <= 6
                          ? "text-blue-600"
                          : "text-gray-900"
                      }`}
                    >
                      ${rental.rates[selectedSeason].fiveToSix}/weekly
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RentalDetail;

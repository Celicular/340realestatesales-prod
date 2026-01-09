import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRef = useRef(null);

  // Direct video URLs from public/videos folder
  const videoUrls = [
    "/videos/vid1.mp4",
    "/videos/vid2.mp4",
    "/videos/vid3.mp4",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentVideoIndex((prev) => (prev + 1) % videoUrls.length);
        setIsTransitioning(false);
      }, 500); // Fade duration
    }, 15000); // Change video every 15 seconds
    return () => clearInterval(interval);
  }, [videoUrls.length]);

  // Auto-play video when index changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch((error) => {
        console.log("Autoplay prevented:", error);
      });
    }
  }, [currentVideoIndex]);

  // Handle video end - transition to next video smoothly
  const handleVideoEnd = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % videoUrls.length);
      setIsTransitioning(false);
    }, 500);
  };

  return (
    <section className="relative min-h-screen mt-3 mx-3 flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video
          key={currentVideoIndex}
          ref={videoRef}
          autoPlay
          muted
          loop={false}
          onEnded={handleVideoEnd}
          className="absolute top-1/2 left-1/2 w-full h-full object-cover pointer-events-none transition-opacity duration-500"
          style={{
            transform: "translate(-50%, -50%)",
            minWidth: "100%",
            minHeight: "100%",
            zIndex: -1,
            opacity: isTransitioning ? 0 : 1,
          }}
        >
          <source src={videoUrls[currentVideoIndex]} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Navigation dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {videoUrls.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentVideoIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentVideoIndex
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to video ${index + 1}`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-alumni font-light mb-4">
          ST JOHN, USVI
        </h1>
        <p className="text-lg sm:text-xl mb-12">
          VIRGIN ISLANDS REAL ESTATE SPECIALISTS
        </p>
        <button
          onClick={() => navigate("/browse-properties")}
          className="border-2 border-white text-white font-alumni font-medium text-base px-8 py-4 hover:bg-white hover:text-black transition-all duration-300 rounded-none uppercase"
        >
          SEARCH PROPERTIES
        </button>
      </div>
    </section>
  );
};

export default HeroSection;

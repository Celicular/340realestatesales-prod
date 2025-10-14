import React, { useState, useEffect } from "react";

const HeroSection = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  // Simple array of video URLs
  const videoUrls = [
    "https://videos.pexels.com/video-files/3773486/3773486-hd_1920_1080_30fps.mp4",
    "https://videos.pexels.com/video-files/7578550/7578550-uhd_2560_1440_30fps.mp4",
    "https://videos.pexels.com/video-files/4770380/4770380-hd_1920_1080_30fps.mp4",
  ];

  // Function to change video
  const changeVideo = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videoUrls.length);
  };

  // Auto-change video every 10 seconds
  useEffect(() => {
    const interval = setInterval(changeVideo, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen  mt-3 mx-3 flex items-center justify-center overflow-hidden"
    >
      {/* Video Background */}
      <video
        key={currentVideoIndex}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
        onEnded={changeVideo}
      >
        <source src={videoUrls[currentVideoIndex]} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Video Navigation Dots */}
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
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8">
        <div className="container-custom">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-light mb-4 leading-tight tracking-wide">
            ST JOHN, USVI
          </h1>

          <p className="text-lg sm:text-xl mb-12 max-w-4xl mx-auto text-white leading-relaxed font-serif">
            VIRGIN ISLANDS REAL ESTATE SPECIALISTS
          </p>

          {/* CTA Button */}
          <div className="flex justify-center items-center">
            <button className="border-2 border-white text-white font-serif font-medium text-base px-8 py-4 hover:bg-white hover:text-black transition-all duration-300 rounded-none tracking-wide uppercase">
              SEARCH PROPERTIES
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

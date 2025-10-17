import React, { useState, useEffect } from "react";

const HeroSection = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const videoUrls = [
    "https://www.youtube.com/embed/uMP_psJAYP8?autoplay=1&mute=1&loop=1&playlist=uMP_psJAYP8&controls=0&showinfo=0&modestbranding=1",
    "https://www.youtube.com/embed/D-ql9hNFn0o?autoplay=1&mute=1&loop=1&playlist=D-ql9hNFn0o&controls=0&showinfo=0&modestbranding=1",
    "https://www.youtube.com/embed/J5fjkkgWfYw?autoplay=1&mute=1&loop=1&playlist=J5fjkkgWfYw&controls=0&showinfo=0&modestbranding=1",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % videoUrls.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen mt-3 mx-3 flex items-center justify-center overflow-hidden">
      {/* YouTube background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <iframe
          key={currentVideoIndex}
          src={videoUrls[currentVideoIndex]}
          title="Background Video"
          allow="autoplay; fullscreen"
          className="absolute top-1/2 left-1/2 pointer-events-none"
          style={{
            width: "100vw",
            height: "100vh",
            minWidth: "177.78vh", // 16:9 ratio to cover height
            minHeight: "100%",
            transform: "translate(-50%, -50%)",
            zIndex: -1,
          }}
        ></iframe>
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
        <button className="border-2 border-white text-white font-alumni font-medium text-base px-8 py-4 hover:bg-white hover:text-black transition-all duration-300 rounded-none uppercase">
          SEARCH PROPERTIES
        </button>
      </div>
    </section>
  );
};

export default HeroSection;

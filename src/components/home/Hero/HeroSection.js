import React, { useState, useEffect } from "react";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import { FaWhatsapp } from "react-icons/fa";
import hero1 from "../../../assets/homehero/hero1.jpeg";
import hero2 from "../../../assets/homehero/hero2.jpg";
import hero3 from "../../../assets/homehero/hero3.jpg";
import hero4 from "../../../assets/homehero/hero4.jpg";

const HeroSection = () => {
  const [currentVideo, setCurrentVideo] = useState(0);

  const [currentImage, setCurrentImage] = useState(0);

  // const heroVideos = [
  //   "https://videos.pexels.com/video-files/3773486/3773486-hd_1920_1080_30fps.mp4",
  //   "https://videos.pexels.com/video-files/7578550/7578550-uhd_2560_1440_30fps.mp4",
  //   "https://videos.pexels.com/video-files/4770380/4770380-hd_1920_1080_30fps.mp4",
  // ];

  const heroImages = [
    // "/images/hero1.jpeg",
    // "/images/hero2.jpg",
    // "/images/hero3.jpg",
    hero1,
    hero2,
    hero3,
    hero4,
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 7000); // 7 seconds per image
    return () => clearInterval(interval);
  }, []);

  //video
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrentVideo((prev) => (prev + 1) % heroVideos.length);
  //   }, 10000);
  //   return () => clearInterval(interval);
  // }, []);

  const socialLinks = [
    {
      icon: Facebook,
      href: "https://www.facebook.com",
      label: "Facebook",
    },
    {
      icon: Instagram,
      href: "https://www.instagram.com/",
      label: "Instagram",
    },
    {
      icon: FaXTwitter,
      href: "https://x.com",
      label: "Twitter",
    },
    {
      icon: FaWhatsapp,
      href: "https://wa.me/",
      label: "Whatsapp",
    },
    {
      icon: Youtube,
      href: "https://www.youtube.com",
      label: "YouTube",
    },
  ];

  return (
    <section id="home" className="relative h-screen overflow-hidden">
      {/* Background Image Carousel */}
      <div className="absolute inset-0 z-0">
        {heroImages.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`hero-${index}`}
            className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${
              currentImage === index ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          />
        ))}
        {/* Optional overlay */}
        <div className="absolute inset-0 bg-black/40 z-20 pointer-events-none" />
      </div>

      {/* Background Video Carousel just comment out as of now buddy  */}

      {/* <div className="absolute inset-0 z-0">
        {heroVideos.map((video, index) => (
          <video
            key={index}
            src={video}
            autoPlay
            muted
            loop
            playsInline
            className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${
              currentVideo === index ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          />
        ))}
       
        <div className="absolute inset-0 bg-black/40 z-20 pointer-events-none" />
      </div> */}

      {/* Social Icons */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-50 flex flex-col gap-4 pointer-events-auto">
        {socialLinks.map((social, idx) => (
          <a
            key={idx}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            className="group p-3 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110 z-50 cursor-pointer relative pointer-events-auto"
            style={{ pointerEvents: "auto" }}
          >
            {React.createElement(social.icon, {
              size: 24,
              className:
                "text-white group-hover:text-blue-300 transition pointer-events-none",
            })}
          </a>
        ))}
      </div>

      {/* Hero Content */}
      <div className="relative z-30 flex items-center justify-center h-full px-6 text-center text-white">
        <div className="max-w-4xl">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-serif font-bold mb-6 drop-shadow-md animate-fade-in">
            Discover Your Paradise
          </h1>
          <p className="text-xl sm:text-2xl lg:text-3xl mb-10 font-light animate-slide-up">
            Luxury Real Estate in St. John, USVI
          </p>
          {/* <SearchForm /> */}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30">
        <div className="animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

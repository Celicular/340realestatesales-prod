import React from "react";

// Sections & Layouts
import HeroSection from "../components/home/Hero/HeroSection";
import AboutSection from "../components/home/Sections/AboutSection";
import TeamSection from "../components/home/Sections/TeamSection";
import ContactSection from "../components/home/Sections/ContactSection";
import AgentsSection from "../components/home/Sections/AgentsSection";
import RentalsSection from "../components/home/Sections/RentalsSection";
import GallerySection from "../components/home/Sections/GallerySection";
import HeroLogos from "../components/home/Sections/HeroLogos";
import AnniversarySection from "../components/home/Sections/AnniverserySection";

function Home() {
  return (
    <div className="App relative scroll-smooth">
      <HeroSection />
      
      <AboutSection />
      <TeamSection />
      <ContactSection />
      <AgentsSection />
      <HeroLogos />
      <RentalsSection />
      <AnniversarySection />
      <GallerySection />
    </div>
  );
}

export default Home;

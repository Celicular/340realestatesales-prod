import React from "react";
import AboutHero from "../components/about/AboutHero";
import OwnershipSection from "./../components/about/OwnershipSection";
import CondosInfoGrid from "../components/about/CondosInfoGrid";
import StJohnMap from "./../components/about/StJohnMap";
import LandSubdivisions from "./../components/about/LandSubdivisions";

const About = () => {
  return (
    <div className="App relative scroll-smooth">
      <AboutHero />|
      <OwnershipSection />
      <CondosInfoGrid />
      <StJohnMap />
      <LandSubdivisions />
    </div>
  );
};

export default About;

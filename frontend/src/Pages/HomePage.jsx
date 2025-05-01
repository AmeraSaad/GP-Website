// src/pages/Homepage.jsx
import React from "react";
import HeroSection from "../components/HeroSection";
import FeatureSection from "../components/FeatureSection";
import Workflow from "../components/Workflow";
import Footer from "../components/Footer";

const Homepage = () => {
  return (
    <div className="max-w-7xl mx-auto pt-20 px-6">
      <div id="home">
        <HeroSection />
      </div>
      <div id="features" className="mt-20">
        <FeatureSection />
      </div>
      <div id="workflow" className="mt-20">
        <Workflow />
      </div>
      <Footer />
    </div>
  );
};

export default Homepage;

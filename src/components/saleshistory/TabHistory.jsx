import React from "react";
import chart from "../../assets/chart.png";
import NumbersSection from "./NumbersSection";

const TabHistory = () => {
  return (
    <div className="max-w-auto mx-auto">
      {/* Numbers Section */}
      <NumbersSection />
      
      {/* Chart Section */}
      <div className="flex items-center justify-center pt-16">
        <img
          src={chart}
          alt="chart"
          loading="lazy"
          className="max-w-4xl h-auto"
        />
      </div>
    </div>
  );
};

export default TabHistory;
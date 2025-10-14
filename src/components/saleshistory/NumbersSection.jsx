import React from "react";

const NumbersSection = () => {
  return (
    <div className="bg-[#6a9a9a] text-white text-center px-4">
      <h2 className="text-3xl font-serif pb-10 tracking-wide pt-8">
        2024 NUMBERS
      </h2>

      {/* Homes */}
      <div className="mb-10">
        <h3 className="text-lg font-semibold mb-2">
          ST JOHN MLS SALES 2024 – HOMES
        </h3>
        <p>43 Sold</p>
        <p>Lowest: $512,000</p>
        <p>Highest: $12,500,000</p>
        <p>Average: $3,432,000</p>
        <p>Total: $127,527,000</p>
      </div>

      {/* Land */}
      <div className="mb-10">
        <h3 className="text-lg font-semibold mb-2">
          ST JOHN MLS SALES 2024 – LAND
        </h3>
        <p>36 Sold</p>
        <p>Lowest: $110,000</p>
        <p>Highest: $2,500,000</p>
        <p>Average: $513,000</p>
        <p>Total: $18,387,000</p>
      </div>

      {/* Condos */}
      <div className="mb-10">
        <h3 className="text-lg font-semibold mb-2">
          ST JOHN MLS SALES 2024 – CONDOS
        </h3>
        <p>8 Sold</p>
        <p>Lowest: $512,000</p>
        <p>Highest: $1,800,000</p>
        <p>Average: $1,102,000</p>
        <p>Total: $8,817,000</p>
      </div>

      {/* Footer note */}
      <p className="mt-8 text-2xl font-light  tracking-wide pb-8">
        FULL HISTORY COMING SOON!
      </p>
    </div>
  );
};

export default NumbersSection;
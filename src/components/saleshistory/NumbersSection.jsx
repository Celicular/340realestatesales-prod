import React from "react";

const NumbersSection = () => {
  return (
    <div className="bg-[#6a9a9a] text-white text-center px-4">
      <h2 className="text-3xl font-alumni pb-10 tracking-wide pt-8">
        2024 NUMBERS
      </h2>

      {/* Homes */}
      <div className="mb-10">
        <h3 className="text-lg font-alumni font-semibold mb-2">
          ST JOHN MLS SALES 2024 – HOMES
        </h3>
        <p className="font-noto">43 Sold</p>
        <p className="font-noto">Lowest: $512,000</p>
        <p className="font-noto">Highest: $12,500,000</p>
        <p className="font-noto">Average: $3,432,000</p>
        <p className="font-noto">Total: $127,527,000</p>
      </div>

      {/* Land */}
      <div className="mb-10">
        <h3 className="text-lg font-alumni font-semibold mb-2">
          ST JOHN MLS SALES 2024 – LAND
        </h3>
        <p className="font-noto">36 Sold</p>
        <p className="font-noto">Lowest: $110,000</p>
        <p className="font-noto">Highest: $2,500,000</p>
        <p className="font-noto">Average: $513,000</p>
        <p className="font-noto">Total: $18,387,000</p>
      </div>

      {/* Condos */}
      <div className="mb-10">
        <h3 className="text-lg font-alumni font-semibold mb-2">
          ST JOHN MLS SALES 2024 – CONDOS
        </h3>
        <p className="font-noto">8 Sold</p>
        <p className="font-noto">Lowest: $512,000</p>
        <p className="font-noto">Highest: $1,800,000</p>
        <p className="font-noto">Average: $1,102,000</p>
        <p className="font-noto">Total: $8,817,000</p>
      </div>

      {/* Footer note */}
      <p className="mt-8 text-2xl font-alumni font-light tracking-wide pb-8">
        FULL HISTORY COMING SOON!
      </p>
    </div>
  );
};

export default NumbersSection;
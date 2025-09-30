import React, { useState } from "react";
import { FaMapMarkerAlt, FaRulerCombined, FaTree, FaWater } from "react-icons/fa";
import { BsHouseDoorFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { landSoldProperties } from "../../data/landSoldData";

const LandSoldCard = ({
  id,
  title,
  location,
  price,
  soldPrice,
  status,
  images,
  description,
  overview,
  details,
  mls,
  soldDate,
}) => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  const nextSlide = () => setCurrent((prev) => (prev + 1) % images.length);
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + images.length) % images.length);

  const handleCardClick = () => {
    navigate(`/landsold/${id}`);
  };

  // Format price
  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return `$${price.toLocaleString()}`;
    }
    return price;
  };

  // Get location display
  const getLocationDisplay = (location) => {
    if (typeof location === 'string') {
      return location;
    }
    if (location && location.address) {
      return location.address;
    }
    return 'Location not specified';
  };

  return (
    <div
      className="bg-white rounded-3xl mt-10 shadow-xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] cursor-pointer"
      onClick={handleCardClick}
    >
      {/* 🖼 Image Carousel */}
      <div className="relative w-full h-72 overflow-hidden">
        {images && images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`${title} Image ${i + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              i === current ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        {images && images.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1 px-2 rounded-full text-lg z-10"
            >
              ‹
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1 px-2 rounded-full text-lg z-10"
            >
              ›
            </button>
          </>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500 text-white">
            {status}
          </span>
        </div>
      </div>

      {/* 📄 Sold Land Property Info */}
      <div className="p-6 md:p-8 flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
          <div className="flex items-center gap-2 mt-1 text-gray-600">
            <FaMapMarkerAlt className="w-4 h-4" />
            <p className="text-sm">{getLocationDisplay(location)}</p>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-2xl text-red-600 font-bold">{formatPrice(soldPrice)}</p>
            <span className="text-sm text-gray-500">Sold {soldDate}</span>
          </div>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{description}</p>

        {/* Land Features */}
        <div className="flex flex-wrap gap-4 mt-2 text-gray-700 text-sm">
          {overview && overview.lotSizeAcres > 0 && (
            <span className="flex items-center gap-2">
              <FaRulerCombined /> {overview.lotSizeAcres} Acres
            </span>
          )}
          {overview && overview.grade && (
            <span className="flex items-center gap-2">
              <FaTree /> {overview.grade} Grade
            </span>
          )}
          {details && details.zoning && (
            <span className="flex items-center gap-2">
              <BsHouseDoorFill /> {details.zoning}
            </span>
          )}
          {details && details.waterfront === "Y" && (
            <span className="flex items-center gap-2">
              <FaWater /> Waterfront
            </span>
          )}
        </div>

        {/* Land Details */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-3">
            Sold Property Details:
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
            {mls && <div><strong>MLS #:</strong> {mls}</div>}
            {overview && overview.grade && <div><strong>Grade:</strong> {overview.grade}</div>}
            {location && location.quarter && <div><strong>Quarter:</strong> {location.quarter}</div>}
            {details && details.zoning && <div><strong>Zoning:</strong> {details.zoning}</div>}
            {details && details.intendedUse && <div><strong>Intended Use:</strong> {details.intendedUse}</div>}
            {details && details.waterfront && <div><strong>Waterfront:</strong> {details.waterfront}</div>}
            <div><strong>Sold Date:</strong> {soldDate}</div>
            <div><strong>Sold Price:</strong> {formatPrice(soldPrice)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LandSold = () => {
  return (
    <div>
      <section className="pb-20 px-4 lg:px-24 bg-gradient-to-br from-gray-50 to-white">
        {/* 🏠 Header */}
        <div className="text-center mb-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Recently Sold Land
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-red-400 to-orange-500 mx-auto mt-4 rounded-full" />
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
            View records of recently sold land properties across St. John's most desirable locations.
          </p>
        </div>

        {/* 🧱 Grid */}
        <div className="w-full py-7">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {landSoldProperties && landSoldProperties.length > 0 ? (
              landSoldProperties.map((property, index) => (
                <LandSoldCard key={index} {...property} />
              ))
            ) : (
              <div className="col-span-2 text-center py-8">
                <p className="text-gray-500">No sold land properties available</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandSold;

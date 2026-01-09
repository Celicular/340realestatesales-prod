import React, { useState, useMemo, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getAllPortfolioItems } from "../../../firebase/firestore";

const NewListings = () => {
  const [propertiesToShow, setPropertiesToShow] = useState(2); // Number to slice
  const [propertyData, setPropertyData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch properties from Firestore - Get latest listings from all categories
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        console.log("🚀 Starting to fetch new listings...");
        setLoading(true);
        setError(null);

        // Get all portfolio items sorted by creation date (latest first)
        const result = await getAllPortfolioItems();
        console.log("📡 API Response:", result);

        if (result.success) {
          console.log("✅ API Success - Raw data:", result.data);

          // Log the first property structure for debugging
          if (result.data.length > 0) {
            console.log("🔍 First property structure:", result.data[0]);
            console.log("🔍 First property keys:", Object.keys(result.data[0]));

            // Debug timestamp fields specifically
            const firstProp = result.data[0];
            console.log("⏰ Timestamp fields in first property:");
            console.log(
              "  - createdAt:",
              firstProp.createdAt,
              typeof firstProp.createdAt
            );
            console.log(
              "  - updatedAt:",
              firstProp.updatedAt,
              typeof firstProp.updatedAt
            );
            console.log(
              "  - listedAt:",
              firstProp.listedAt,
              typeof firstProp.listedAt
            );
            console.log(
              "  - timestamp:",
              firstProp.timestamp,
              typeof firstProp.timestamp
            );
          }

          // Convert array to object format for compatibility
          const dataObject = {};
          result.data.forEach((property, index) => {
            dataObject[property.id || index] = property;
          });

          console.log("🔄 Converted to object format:", dataObject);
          setPropertyData(dataObject);
        } else {
          console.error("❌ API Error:", result.error);
          setError(result.error || "Failed to fetch properties");
        }
      } catch (err) {
        console.error("💥 Fetch Error:", err);
        setError("Error fetching properties: " + err.message);
      } finally {
        setLoading(false);
        console.log("🏁 Fetch completed");
      }
    };

    fetchProperties();
  }, []);

  // Memoize filtered properties - Enhanced data mapping with timestamp sorting
  const filteredProperties = useMemo(() => {
    console.log("🔄 Processing filtered new listings...");
    console.log("📦 Raw propertyData entries:", Object.entries(propertyData));

    const result = Object.entries(propertyData)
      .filter(([id, property]) => {
        // Filter out properties without images
        if (
          property.images &&
          Array.isArray(property.images) &&
          property.images.length > 0
        ) {
          return true;
        } else if (property.image) {
          return true;
        } else if (property.photo) {
          return true;
        } else if (
          property.photos &&
          Array.isArray(property.photos) &&
          property.photos.length > 0
        ) {
          return true;
        }
        console.log(`⚠️ Filtering out property ${id} - no images found`);
        return false;
      })
      .map(([id, property]) => {
        console.log(`🏠 Processing property ${id}:`, property);

        // Enhanced image handling - check multiple possible image sources
        let images = [];
        if (
          property.images &&
          Array.isArray(property.images) &&
          property.images.length > 0
        ) {
          images = property.images;
        } else if (property.image) {
          images = [property.image];
        } else if (property.photo) {
          images = [property.photo];
        } else if (
          property.photos &&
          Array.isArray(property.photos) &&
          property.photos.length > 0
        ) {
          images = property.photos;
        }

        // Enhanced title/name handling
        const title =
          property.title ||
          property.name ||
          property.propertyName ||
          property.listingTitle ||
          "Property";

        // Enhanced price handling - check multiple price fields
        let price =
          property.price ||
          property.soldPrice ||
          property.listingPrice ||
          property.askPrice ||
          property.askingPrice ||
          property.listPrice ||
          0;

        // If price is still 0, try to extract from other possible fields
        if (!price || price === 0) {
          // Check if price is in features or propertyDetails
          if (property.features?.price) {
            price = property.features.price;
          } else if (property.propertyDetails?.price) {
            price = property.propertyDetails.price;
          } else if (property.details?.price) {
            price = property.details.price;
          }
        }

        console.log(`💰 Raw price for ${id}:`, price, typeof price);

        // Enhanced location handling
        let location = "St. John, USVI";
        if (property.location) {
          if (typeof property.location === "string") {
            location = property.location;
          } else if (property.location.address) {
            location = property.location.address;
          } else if (property.location.quarter) {
            location = `${property.location.quarter}, St. John, USVI`;
          }
        } else if (property.address) {
          location = property.address;
        }

        // Get timestamp for sorting (latest first)
        let timestamp = new Date(0); // Default to epoch
        if (property.createdAt) {
          if (property.createdAt.toDate) {
            timestamp = property.createdAt.toDate();
          } else {
            timestamp = new Date(property.createdAt);
          }
        } else if (property.updatedAt) {
          if (property.updatedAt.toDate) {
            timestamp = property.updatedAt.toDate();
          } else {
            timestamp = new Date(property.updatedAt);
          }
        } else if (property.listedAt) {
          if (property.listedAt.toDate) {
            timestamp = property.listedAt.toDate();
          } else {
            timestamp = new Date(property.listedAt);
          }
        }

        const mappedProperty = {
          id,
          title,
          price,
          images,
          description:
            property.description ||
            property.fullDescription ||
            property.listingDescription ||
            "",
          features: {
            totalBeds:
              property.features?.beds ||
              property.features?.totalBeds ||
              property.bedrooms ||
              property.beds ||
              0,
            totalBaths:
              property.features?.baths ||
              property.features?.totalBaths ||
              property.bathrooms ||
              property.baths ||
              0,
            pool: property.features?.pool || property.amenities?.pool || false,
            type:
              property.features?.type ||
              property.type ||
              property.subcategory ||
              property.propertyType ||
              "property",
            properties: 1,
          },
          propertyDetails: property.propertyDetails || property.details || {},
          status: property.status || "for-sale",
          location,
          mls:
            property.mls ||
            property.mlsNumber ||
            property.mlsId ||
            property.mlsNumber ||
            "",
          timestamp, // Add timestamp for sorting
          category: property.category || "residential",
        };

        console.log(`✅ Mapped property ${id}:`, mappedProperty);
        console.log(`🖼️ Images for ${id}:`, images);
        console.log(`🏷️ Title for ${id}:`, title);
        console.log(`💰 Price for ${id}:`, price, `(type: ${typeof price})`);
        console.log(`📍 Location for ${id}:`, location);
        console.log(`⏰ Timestamp for ${id}:`, timestamp);

        return mappedProperty;
      })
      // Sort by timestamp (latest first) and then slice to show only the requested number
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, propertiesToShow);

    console.log("🎯 Final filtered new listings (latest first):", result);
    return result;
  }, [propertiesToShow, propertyData]);

  // Navigation functions - Show two properties at a time
  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0
        ? Math.max(0, filteredProperties.length - 2)
        : prevIndex - 2
    );
  }, [filteredProperties.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex + 2 >= filteredProperties.length ? 0 : prevIndex + 2
    );
  }, [filteredProperties.length]);

  // Get current properties to display (two at a time)
  const currentProperties = filteredProperties.slice(
    currentIndex,
    currentIndex + 2
  );

  // Debug logging to check data mapping
  console.log("=== NEW LISTINGS DEBUG ===");
  console.log("📊 Data Status:", {
    loading,
    error,
    rawPropertyDataCount: Object.keys(propertyData).length,
    filteredPropertiesCount: filteredProperties.length,
    currentIndex,
    propertiesToShow,
  });

  console.log("🏠 Raw Property Data:", propertyData);
  console.log("🔍 Filtered Properties (latest first):", filteredProperties);
  console.log("🎯 Current Properties:", currentProperties);

  console.log(
    "📋 Property Details:",
    currentProperties.map((p, i) => ({
      index: i,
      id: p.id,
      title: p.title,
      price: p.price,
      status: p.status,
      location: p.location,
      imagesCount: p.images?.length || 0,
      features: p.features,
      mls: p.mls,
      timestamp: p.timestamp,
      category: p.category,
    }))
  );

  console.log("=== END DEBUG ===");

  // Format price for display
  const formatPrice = (price) => {
    console.log(`💰 Formatting price:`, price, typeof price);

    // Handle null, undefined, empty string
    if (!price || price === "" || price === null || price === undefined) {
      console.log(`⚠️ No price provided, using fallback`);
      return "Price on Request";
    }

    // Convert to number if it's a string
    let numericPrice;
    if (typeof price === "string") {
      // Remove currency symbols, commas, and whitespace
      const cleanedPrice = price.replace(/[$,£€¥\s]/g, "");
      numericPrice = parseFloat(cleanedPrice);
      console.log(`🔄 Converted string "${price}" to number:`, numericPrice);
    } else if (typeof price === "number") {
      numericPrice = price;
      console.log(`✅ Using number price:`, numericPrice);
    } else {
      console.log(`⚠️ Invalid price type:`, typeof price, price);
      return "Price on Request";
    }

    // Check if the number is valid
    if (isNaN(numericPrice) || numericPrice <= 0) {
      console.log(`⚠️ Invalid numeric price:`, numericPrice);
      return "Price on Request";
    }

    // Format the price
    const formattedPrice = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numericPrice);

    console.log(`✅ Formatted price: ${formattedPrice}`);
    return formattedPrice;
  };

  // Get property status badge
  const getStatusBadge = (property) => {
    const status = property.status?.toLowerCase();
    if (status === "rental" || status === "for-rent") {
      return "For Rent";
    } else if (status === "sold") {
      return "Sold";
    } else {
      return "For Sale";
    }
  };

  // Get property image
  const getPropertyImage = (property) => {
    console.log(
      `🖼️ Getting image for property ${property.id}:`,
      property.images
    );

    if (property.images && property.images.length > 0) {
      const imageUrl = property.images[0];
      console.log(`✅ Using image: ${imageUrl}`);
      return imageUrl;
    }

    // Fallback image
    const fallbackImage =
      "https://www.340realestate.com/static/media/banana10.0bd602c9777af8620d50.jpg";
    console.log(`⚠️ No images found, using fallback: ${fallbackImage}`);
    return fallbackImage;
  };

  // Get property address
  const getPropertyAddress = (property) => {
    console.log(
      `📍 Getting address for property ${property.id}:`,
      property.location
    );

    // Handle location object structure from backend
    if (property.location && typeof property.location === "object") {
      if (property.location.address) {
        console.log(`✅ Using location.address: ${property.location.address}`);
        return property.location.address;
      }
      if (property.location.quarter) {
        const quarterAddress = `${property.location.quarter}, St. John, USVI`;
        console.log(`✅ Using location.quarter: ${quarterAddress}`);
        return quarterAddress;
      }
    }

    // Handle string location
    if (property.location && typeof property.location === "string") {
      console.log(`✅ Using location string: ${property.location}`);
      return property.location;
    }

    // Use title/name as fallback
    if (property.title || property.name) {
      const titleAddress = property.title || property.name;
      console.log(`✅ Using title/name as address: ${titleAddress}`);
      return titleAddress;
    }

    console.log(`⚠️ No location found, using fallback: St. John, USVI`);
    return "St. John, USVI";
  };

  // Get bedrooms and bathrooms
  const getPropertyDetails = (property) => {
    const beds =
      property.features?.totalBeds ||
      property.features?.beds ||
      property.bedrooms ||
      "N/A";
    const baths =
      property.features?.totalBaths ||
      property.features?.baths ||
      property.bathrooms ||
      "N/A";
    return `${beds} BEDS · ${baths} BATHS`;
  };

  // Loading state
  if (loading) {
    return (
      <section className="py-12 px-4 text-center">
        <h2 className="text-3xl font-serif text-[#0e3b3e] tracking-widest uppercase">
          New Listings to the Market
        </h2>
        <p className="mt-2 text-gray-600">Loading latest properties...</p>
        <div className="flex justify-center mt-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d4b196]"></div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-12 px-4 text-center">
        <h2 className="text-3xl font-serif text-[#0e3b3e] tracking-widest uppercase">
          New Listings to the Market
        </h2>
        <p className="mt-2 text-gray-600">Unable to load latest properties</p>
        <p className="text-red-500 text-sm mt-2">{error}</p>
        <div className="mt-4">
          <button
            onClick={() => window.location.reload()}
            className="bg-[#d4b196] text-white px-4 py-2 rounded hover:opacity-90 transition-opacity"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  // No properties state
  if (filteredProperties.length === 0) {
    return (
      <section className="py-12 px-4 text-center">
        <h2 className="text-3xl font-serif text-[#0e3b3e] tracking-widest uppercase">
          New Listings to the Market
        </h2>
        <p className="mt-2 text-gray-600">
          No new listings available at the moment.
        </p>
      </section>
    );
  }

  return (
    <section className="py-12 px-4 text-center">
      {/* Heading */}
      <h2 className="text-3xl font-serif text-[#0e3b3e] tracking-widest uppercase">
        New Listings to the Market
      </h2>
      <p className="mt-2 text-gray-600">
        Browse the latest properties added to our listings.
      </p>

      {/* Properties Grid with Side Arrows */}
      <div className="relative mt-8 max-w-7xl mx-auto px-4 sm:px-8">
        {/* Left Arrow */}
        {filteredProperties.length > 2 && (
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 p-4 text-white transition-all duration-300 rounded-full shadow-xl bg-gradient-to-r from-[#d4b196] to-[#c4a185] hover:from-[#c4a185] hover:to-[#d4b196] hover:scale-110 hover:shadow-2xl z-10 border-2 border-white/20"
            title="Previous properties"
          >
            <ChevronLeft size={20} />
          </button>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentProperties.map((property, index) => (
            <div
              key={property.id || index}
              className="bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 rounded-lg overflow-hidden border border-gray-100"
            >
              <div className="relative group">
                <img
                  src={getPropertyImage(property)}
                  alt={property.title || property.name || "Property"}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Gradient overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Status badges with enhanced styling */}
                <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
                  <span className="bg-[#d4b196]/95 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg border border-white/20">
                    {getStatusBadge(property)}
                  </span>
                  {property.mls && (
                    <span className="bg-gray-800/95 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg border border-white/20">
                      MLS® {property.mls}
                    </span>
                  )}
                </div>
                {/* New Listing Badge - Enhanced Professional Design */}
                <div className="absolute top-3 right-3">
                  <div className="relative">
                    {/* Main badge with gradient and shadow */}
                    <span className="inline-flex items-center gap-1 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg border border-white/20 backdrop-blur-sm animate-pulse">
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      NEW
                    </span>

                    {/* Animated ring effect */}
                    <div className="absolute inset-0 rounded-full border-2 border-emerald-400/30 animate-ping"></div>

                    {/* Subtle glow effect */}
                    <div className="absolute inset-0 rounded-full bg-emerald-400/20 blur-sm -z-10"></div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-[#d4b196] to-[#c4a185] text-left p-5 relative overflow-hidden">
                {/* Subtle pattern overlay */}
                <div className="absolute inset-0 opacity-5">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                  ></div>
                </div>

                <div className="relative z-10">
                  <p className="text-white text-xl font-bold mb-2 tracking-wide">
                    {formatPrice(property.price)}
                  </p>
                  <p className="text-white text-sm font-semibold mb-2 leading-tight">
                    {property.title || property.name || "Property"}
                  </p>
                  <p className="text-white/90 text-sm mb-3 leading-relaxed">
                    {getPropertyAddress(property)}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-white/80 text-xs font-medium">
                      {getPropertyDetails(property)}
                    </p>
                    {/* View Details Arrow */}
                    <div className="flex items-center text-white/80 hover:text-white transition-colors duration-200 cursor-pointer">
                      <span className="text-xs font-medium mr-1">
                        View Details
                      </span>
                      <svg
                        className="w-3 h-3 transform group-hover:translate-x-1 transition-transform duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        {filteredProperties.length > 2 && (
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 p-4 text-white transition-all duration-300 rounded-full shadow-xl bg-gradient-to-r from-[#d4b196] to-[#c4a185] hover:from-[#c4a185] hover:to-[#d4b196] hover:scale-110 hover:shadow-2xl z-10 border-2 border-white/20"
            title="Next properties"
          >
            <ChevronRight size={20} />
          </button>
        )}
      </div>

      {/* View All Button - Enhanced Professional Design */}
      <div className="mt-10 flex justify-center">
        <Link to="/properties">
          <button className="group relative bg-gradient-to-r from-[#d4b196] to-[#c4a185] hover:from-[#c4a185] hover:to-[#d4b196] px-10 py-4 text-white uppercase tracking-widest font-bold text-sm rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-white/20 backdrop-blur-sm overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-11.046-8.954-20-20-20v20h20z'/%3E%3C/g%3E%3C/svg%3E")`,
                }}
              ></div>
            </div>

            <span className="relative z-10 flex items-center gap-3">
              View All Properties
              <svg
                className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>

            {/* Hover overlay effect */}
            <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </Link>
      </div>
    </section>
  );
};

export default NewListings;

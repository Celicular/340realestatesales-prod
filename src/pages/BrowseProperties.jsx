import React, { useState } from "react";
import SEOHead from "../components/SEO/SEOHead";

function BrowseProperties({ bgColor = "bg-slate-50" }) {
  const [iframeLoading, setIframeLoading] = useState(true);
  return (
    <>
      <SEOHead
        title="Browse Properties | 340 Real Estate"
        description="Browse all available properties in St. John, USVI. Search our complete MLS database of residential, commercial, and land properties."
        keywords="St John properties, real estate listings, MLS search, USVI properties"
        image={
          typeof window !== "undefined"
            ? `${window.location.origin}/images/hero1.jpeg`
            : ""
        }
        url={typeof window !== "undefined" ? window.location.href : ""}
        type="website"
      />

      <div className={`min-h-screen ${bgColor}`}>
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white py-16 px-4 sm:px-8 mt-20">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-alumni font-bold mb-4">
              Browse Properties in St. John, USVI
            </h1>
            <p className="text-lg sm:text-xl text-slate-100 mb-6">
              Explore our comprehensive MLS database featuring residential
              homes, commercial properties, and land opportunities across the
              beautiful island of St. John.
            </p>
            <div className="flex flex-wrap gap-8 items-baseline">
              <div>
                <p className="text-sm font-semibold text-slate-300">
                  Search Type
                </p>
                <p className="text-lg font-alumni font-bold text-white mt-1">
                  Complete MLS Database
                </p>
              </div>
              <div className="hidden sm:block text-slate-400">•</div>
              <div>
                <p className="text-sm font-semibold text-slate-300">Coverage</p>
                <p className="text-lg font-alumni font-bold text-white mt-1">St. John & USVI</p>
              </div>
              <div className="hidden sm:block text-slate-400">•</div>
              <div>
                <p className="text-sm font-semibold text-slate-300">Updated</p>
                <p className="text-lg font-alumni font-bold text-white mt-1">Real-Time Data</p>
              </div>
            </div>
          </div>
        </div>

        {/* MLS Listings iframe - Full Width */}
        <div className="w-full py-12">
          <h2 className="text-2xl font-alumni font-bold text-slate-800 mb-6 max-w-6xl mx-auto px-4 sm:px-8">
            MLS Listings Database
          </h2>
          <div className="relative w-full min-h-[90vh]">
            {/* Loading Spinner */}
            {iframeLoading && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
                <div className="flex flex-col items-center">
                  <div className="relative w-16 h-16 mb-4">
                    <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cruzbay-teal border-r-cruzbay-teal animate-spin"></div>
                  </div>
                  <p className="text-slate-600 font-medium">Loading MLS Database...</p>
                </div>
              </div>
            )}
            <iframe
              src="https://my.flexmls.com/tameladonnelly/search/idx_links/20211211180913981114000000/listings"
              title="MLS Search Listings"
              className="w-full min-h-[90vh] border-none shadow-lg"
              allowFullScreen
              onLoad={() => setIframeLoading(false)}
            ></iframe>
          </div>
        </div>

        {/* Information Section - After iframe */}
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-3xl font-alumni font-bold text-slate-700 mb-3">
                🏠
              </div>
              <h3 className="text-xl font-alumni font-semibold text-slate-800 mb-2">
                Residential Properties
              </h3>
              <p className="text-slate-600">
                Discover beautiful homes, villas, and residential properties
                with ocean views and premium island living amenities.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-3xl font-alumni font-bold text-slate-700 mb-3">
                🏢
              </div>
              <h3 className="text-xl font-alumni font-semibold text-slate-800 mb-2">
                Commercial Properties
              </h3>
              <p className="text-slate-600">
                Explore commercial opportunities including retail spaces, office
                buildings, and investment properties.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-3xl font-alumni font-bold text-slate-700 mb-3">
                🌿
              </div>
              <h3 className="text-xl font-alumni font-semibold text-slate-800 mb-2">
                Land & Lots
              </h3>
              <p className="text-slate-600">
                Build your dream property with our selection of land parcels and
                vacant lots in prime locations.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-md mb-12">
            <h2 className="text-2xl font-alumni font-bold text-slate-800 mb-4">
              Search Features
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-600">
              <li className="flex items-start">
                <span className="text-cruzbay-teal font-bold mr-3">✓</span>
                <span>Advanced filtering by price, size, and amenities</span>
              </li>
              <li className="flex items-start">
                <span className="text-cruzbay-teal font-bold mr-3">✓</span>
                <span>Detailed property information and history</span>
              </li>
              <li className="flex items-start">
                <span className="text-cruzbay-teal font-bold mr-3">✓</span>
                <span>High-quality photos and virtual tours</span>
              </li>
              <li className="flex items-start">
                <span className="text-cruzbay-teal font-bold mr-3">✓</span>
                <span>Real-time MLS updates</span>
              </li>
              <li className="flex items-start">
                <span className="text-cruzbay-teal font-bold mr-3">✓</span>
                <span>Neighborhood and market information</span>
              </li>
              <li className="flex items-start">
                <span className="text-cruzbay-teal font-bold mr-3">✓</span>
                <span>Contact our agents directly</span>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-slate-800 text-white py-12 px-4 sm:px-8 mt-12">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl font-alumni font-bold mb-4">
              Need Help Finding Your Perfect Property?
            </h2>
            <p className="text-lg text-slate-100 mb-6">
              Our expert agents are ready to assist you with personalized
              property searches and consultations.
            </p>
            <a
              href="/contact"
              className="inline-block bg-cruzbay-teal hover:bg-cruzbay-teal-dark text-white font-alumni font-medium text-lg px-8 py-3 rounded transition-colors duration-300"
            >
              Contact Our Agents
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default BrowseProperties;

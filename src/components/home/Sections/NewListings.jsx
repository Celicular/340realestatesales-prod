import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const NewListings = () => {
  return (
    <section className="py-12 px-4 text-center">
      {/* Heading */}
      <h2 className="text-3xl font-serif text-[#0e3b3e] tracking-widest uppercase">
        New Listings to the Market
      </h2>
      <p className="mt-2 text-gray-600">
        Browse the available properties in the area below.
      </p>

      {/* Carousel Arrows */}
      <div className="flex justify-end mt-4 gap-2 pr-8">
        <button className="bg-[#d4b196] p-2 text-white hover:opacity-80">
          <ChevronLeft size={20} />
        </button>
        <button className="bg-[#d4b196] p-2 text-white hover:opacity-80">
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 max-w-6xl mx-auto">
        {/* Card 1 */}
        <div className="bg-white shadow-md">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&q=80&w=1200"
              alt="Property 1"
              className="w-full h-64 object-cover"
            />
            <div className="absolute top-2 left-2 flex gap-2">
              <span className="bg-[#d4b196] text-white text-xs px-2 py-1">
                For Lease
              </span>
              <span className="bg-[#d4b196] text-white text-xs px-2 py-1">
                MLS® 25-206
              </span>
            </div>
          </div>
          <div className="bg-[#d4b196] text-left p-4">
            <p className="text-white text-lg font-bold">$3,000</p>
            <p className="text-white text-sm">
              13A/ Apt A Carolina, St John, St. John, VI 00830
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white shadow-md">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&q=80&w=1200"
              alt="Property 2"
              className="w-full h-64 object-cover"
            />
            <div className="absolute top-2 left-2 flex gap-2">
              <span className="bg-[#d4b196] text-white text-xs px-2 py-1">
                For Sale
              </span>
              <span className="bg-[#d4b196] text-white text-xs px-2 py-1">
                MLS® 25-202
              </span>
            </div>
          </div>
          <div className="bg-[#d4b196] text-left p-4">
            <p className="text-white text-lg font-bold">$3,000</p>
            <p className="text-white text-sm">
              300A-1 Chocolate Hole, St John, St. John, VI 00830
            </p>
            <p className="text-white text-xs mt-1">2 BEDS · 2 BATHS · 1,280 SQ.FT.</p>
          </div>
        </div>
      </div>

      {/* View All Button */}
      <div className="mt-8">
        <button className="bg-[#d4b196] px-8 py-3 text-white uppercase tracking-widest hover:opacity-90">
          View All
        </button>
      </div>
    </section>
  );
};

export default NewListings;

import React from "react";
import logo from "../../../assets/logo.png";

export default function ServicesSection() {
  return (
    <section className="w-full flex flex-col items-center py-12">
      {/* Top Icon */}
      <div className="mb-4">
        <img
          src={logo}
          alt="logo"
          className="w-20 h-full object-cover transform group-hover:scale-105 transition duration-500"
        />
      </div>

      {/* Heading */}
      <h2 className="text-2xl md:text-4xl font-serif tracking-[0.2em] mb-10 text-center">
        DREAM BIG WITH US
      </h2>

      {/* 3 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-11/12 max-w-4xl">
        {[
          {
            title: "BUY WITH US",
            img: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
          },
          {
            title: "SELL WITH US",
            img: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
          },
          {
            title: "DESIGN WITH US",
            img: "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
          },
        ].map((card, i) => (
          <div key={i} className="relative group h-96 overflow-hidden">
            {/* Image */}
            <img
              src={card.img}
              alt={card.title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition"></div>

            {/* Text */}
            <div className="absolute bottom-6 left-6 text-white text-lg font-light tracking-[0.15em] uppercase">
              {card.title}
              {/* Underline that doesn’t shift */}
              <div className="w-12 border-b border-white/70 mt-2"></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

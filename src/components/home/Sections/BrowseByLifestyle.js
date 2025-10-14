import React from 'react';

const BrowseByLifestyle = () => {
  const lifestyleCategories = [
    {
      title: "HOMES",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      alt: "Luxurious multi-story home with terracotta roof and infinity pool"
    },
    {
      title: "LAND",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      alt: "Aerial view of verdant hilly coastline with turquoise ocean"
    },
    {
      title: "CONDOS",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      alt: "Aerial view of residential complex with colorful condominium buildings"
    },
    {
      title: "TIMESHARES",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      alt: "Picturesque resort scene with palm trees and modern buildings"
    },
    {
      title: "COMMERCIAL",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      alt: "Fishing rods on boat with bustling harbor background"
    },
    {
      title: "WATERFRONT",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      alt: "Aerial view of lush green island surrounded by turquoise water"
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container-custom">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-serif font-bold text-black tracking-wider uppercase leading-tight">
            BROWSE BY LIFESTYLE
          </h2>
        </div>

        {/* 2x3 Grid of Property Categories - No Gaps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
          {lifestyleCategories.map((category, index) => (
            <div key={index} className="relative group cursor-pointer overflow-hidden">
              <div className="aspect-[4/3] relative">
                {/* Background Image - Clear without overlay */}
                <img 
                  src={category.image} 
                  alt={category.alt}
                  className="w-full h-full object-cover"
                />
                
                {/* White Label with Category Name - Only button color changes on hover */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white px-8 py-4 shadow-lg group-hover:bg-[#D6B69C] transition-colors duration-300">
                    <h3 className="text-xl font-bold font-['Lato'] text-cruzbay-teal group-hover:text-white uppercase tracking-wider transition-colors duration-300">
                      {category.title}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrowseByLifestyle;

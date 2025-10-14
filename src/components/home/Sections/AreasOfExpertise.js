import React from 'react';

const AreasOfExpertise = () => {
  return (
    <section className="relative min-h-screen mx-20 mt-20">
      {/* Background Container with Grid Layout */}
      <div className="grid grid-cols-4 h-full">
        
        {/* Left Side - 1/4 Blank Space */}
        <div className="col-span-1 bg-white"></div>
        
        {/* Right Side - 3/4 Image Coverage */}
        <div className="col-span-3 relative">
          <img 
            src="https://www.340realestate.com/static/media/about2.2a3945f5a8fe9c273b6d.JPG" 
            alt="Aerial view of tropical island with lush greenery and turquoise waters"
            className="w-full h-[80vh] object-cover"
          />
        </div>
      </div>

      {/* Text Box - Positioned in Left 1/4 and Extending Over Image */}
      <div className="absolute inset-0 z-10 flex items-center">
        <div className="container-custom">
          <div className="grid grid-cols-4 h-full items-center">
            
            {/* Text Box Container - Spans 1/4 left + extends into image area */}
            <div className="col-span-2 col-start-1">
              {/* Semi-transparent Text Box */}
              <div className="bg-cruzbay-teal/85 backdrop-blur-sm p-12 rounded-none shadow-2xl">
                {/* Main Heading */}
                <h2 className="text-5xl font-serif font-bold text-white tracking-wider mb-8 uppercase leading-tight">
                  AREAS OF EXPERTISE
                </h2>
                
                {/* Sub-heading */}
                <p className="text-xl font-['Lato'] text-white uppercase tracking-wider mb-6 leading-relaxed">
                  BROWSE VARIOUS PARTS OF ST JOHN AND THE SURROUNDING ISLANDS
                </p>
                
                {/* Description */}
                <p className="text-lg font-['Lato'] text-white/90 leading-relaxed mb-10">
                  These neighborhoods have plenty of beautiful properties to offer. Browse through available listings in the community.
                </p>
                
                {/* Call-to-Action Button */}
                <div className="text-center">
                  <button className="bg-white text-cruzbay-beige font-semibold px-10 py-4 rounded-lg hover:bg-gray-100 transition-colors duration-300 font-['Lato'] text-lg">
                    LEARN MORE
                  </button>
                </div>
              </div>
            </div>
            
            {/* Right Side - Empty space for image to show through */}
            <div className="col-span-2"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AreasOfExpertise;

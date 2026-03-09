import React from 'react';
import slh1 from '../../../assets/slh1.jpeg';

const AreasOfExpertise = () => {
  return (
    <section className="relative min-h-screen px-4 sm:px-6 lg:px-20 mt-10 sm:mt-16 lg:mt-20">
      {/* Mobile Layout - Stacked */}
      <div className="block lg:hidden">
        {/* Image Section */}
        <div className="relative mb-8">
          <img 
            src={slh1} 
            alt="Aerial view of tropical island with lush greenery and turquoise waters"
            className="w-full h-[50vh] sm:h-[60vh] object-cover rounded-lg"
          />
        </div>
        
        {/* Content Section */}
        <div className="bg-white p-6 sm:p-8 shadow-2xl text-left flex flex-col justify-center min-h-[60vh]">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-black tracking-wider mb-6 uppercase leading-tight">
            AREAS OF EXPERTISE
          </h2>
          
          <p className="text-lg sm:text-xl text-black font-serif uppercase tracking-wider mb-4 leading-relaxed">
            BROWSE VARIOUS PARTS OF ST JOHN AND THE SURROUNDING ISLANDS
          </p>
          
          <p className="text-base sm:text-lg font-serif text-gray-700 leading-relaxed mb-8">
            These neighborhoods have plenty of beautiful properties to offer. Browse through available listings in the community.
          </p>
          
          <div className="text-left">
            <button className="bg-gray-800 text-white font-serif font-semibold px-8 py-3 sm:px-10 sm:py-4 rounded-lg hover:bg-gray-700 transition-colors duration-300 text-base sm:text-lg tracking-wide uppercase">
              LEARN MORE
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Layout - Grid */}
      <div className="hidden lg:block">
        {/* Background Container with Grid Layout */}
        <div className="grid grid-cols-4 h-full">
          
          {/* Left Side - 1/4 Blank Space */}
          <div className="col-span-1 bg-white"></div>
          
          {/* Right Side - 3/4 Image Coverage */}
          <div className="col-span-3 relative">
            <img 
              src={slh1} 
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
                <div className="bg-white/95 backdrop-blur-sm p-8 xl:p-12 rounded-none shadow-2xl">
                  {/* Main Heading */}
                  <h2 className="text-4xl xl:text-5xl font-alumni font-bold text-black tracking-wider mb-6 xl:mb-8 uppercase leading-tight">
                    AREAS OF EXPERTISE
                  </h2>
                  
                  {/* Sub-heading */}
                  <p className="text-lg xl:text-xl text-black font-alumni uppercase tracking-wider mb-4 xl:mb-6 leading-relaxed">
                    BROWSE VARIOUS PARTS OF ST JOHN AND THE SURROUNDING ISLANDS
                  </p>
                  
                  {/* Description */}
                  <p className="text-base xl:text-lg font-noto text-gray-700 leading-relaxed mb-8 xl:mb-10">
                    These neighborhoods have plenty of beautiful properties to offer. Browse through available listings in the community.
                  </p>
                  
                  {/* Call-to-Action Button */}
                  <div className="text-center">
                    <button className="bg-gray-800 text-white font-alumni font-semibold px-8 xl:px-10 py-3 xl:py-4 rounded-lg hover:bg-gray-700 transition-colors duration-300 text-base xl:text-lg tracking-wide uppercase">
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
      </div>
    </section>
  );
};

export default AreasOfExpertise;

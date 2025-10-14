import React, { useState } from "react";

const Testimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      text: "This was the second time we listed property with Tammy and there was never any question that we would list our home with her. Tammy is there to meet any challenges that might pop up when selling your home. Once we were under contract we had an issue surface. Rather than having to solve it ourselves Tammy was there to help. Without Tammy our sale could have fallen thru. Buying or selling on St John, Tammy is the realtor you need!",
      author: "Karen Radtke and David Carlson",
    },
    {
      text: "Tammy made our buying experience smooth and enjoyable. Her local expertise and attention to detail ensured everything went perfectly.",
      author: "Michael & Sarah Johnson",
    },
  ];

  const goToPrevious = () => {
    setCurrentTestimonial((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentTestimonial((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="mx-3">
      <section className="relative  flex items-center justify-center min-h-[60vh] py-12">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2070&q=80"
            alt="Tropical island"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl container mx-auto px-6 md:px-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">
            {/* Left - Testimonial Text */}
            <div className="text-white w-full lg:w-1/2 text-center lg:text-left">
              <p className="text-base md:text-lg leading-relaxed text-white/90 font-['Lato'] mb-6">
                “{testimonials[currentTestimonial].text}”
              </p>
              <p className="text-lg font-semibold text-white mb-8">
                — {testimonials[currentTestimonial].author}
              </p>

              {/* <button className="bg-white text-cruzbay-teal font-semibold px-8 py-3 rounded-lg hover:bg-white/90 transition duration-300 font-['Lato'] shadow-md">
                VIEW ALL
              </button> */}
            </div>

            {/* Middle Divider */}
            <div className="hidden lg:flex justify-center items-center">
              <div className="w-px h-32 bg-gradient-to-b from-white/10 via-white/60 to-white/10"></div>
            </div>

            {/* Right - Controls */}
            <div className="text-white w-full lg:w-1/2 text-center lg:text-left">
              <h2 className="text-4xl md:text-5xl font-serif font-bold tracking-wide mb-6">
                TESTIMONIALS
              </h2>

              {/* Decorative Line (visible only on mobile) */}
              <div className="block lg:hidden w-24 h-px bg-white/40 mx-auto lg:mx-0 mb-6"></div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-center lg:justify-start gap-4 text-white/90 font-['Lato']">
                <button
                  onClick={goToPrevious}
                  className="hover:text-white transition duration-300"
                >
                  PREVIOUS
                </button>
                <span className="text-white/50">|</span>
                <button
                  onClick={goToNext}
                  className="hover:text-white transition duration-300"
                >
                  NEXT
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Testimonials;

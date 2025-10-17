import React from "react";
import { motion } from "framer-motion";
import testimonials from "../../assets/testimo.jpg";

const TestimonialHero = () => {
  return (
    <div>
      {/* 🖼 Hero Section with Overlay */}
      <section className="relative h-[55vh] md:h-[60vh] w-full overflow-hidden">
        <img
          src={testimonials}
          alt="St. John"
          className="absolute inset-0 w-full h-full object-cover object-center  scale-105 transition-transform duration-700 ease-in-out"
        />
        <div className="absolute inset-0 bg-black/40 " />
 
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4"
        >
          <h1 className="text-white uppercase text-3xl md:text-5xl font-alumni font-bold tracking-wide mb-4">
            Testimonial
          </h1>          
        </motion.div>
      </section>
    </div>
  );
};

export default TestimonialHero;

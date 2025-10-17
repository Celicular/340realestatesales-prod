import React from "react";
import { motion } from "framer-motion";
import saleshistoryhero from "../../assets/saleshistoryhero.jpeg";

const ContactHero = () => {
  return (
    <div>
      {/* 🖼 Hero Section with Overlay */}
      <section className="relative h-[50vh] md:h-[55vh] w-full overflow-hidden">
        <img
          src={saleshistoryhero}
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
          C0NNECT WITH US
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-tropical-500 to-blue-400 rounded-full mb-4"></div>
          
        </motion.div>
      </section>
    </div>
  );
};

export default ContactHero;

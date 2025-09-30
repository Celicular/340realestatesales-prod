import React from "react";
import { motion } from "framer-motion";
import abouthero from "../../assets/teamabout.jpg";

const AboutUsHero = () => {
  return (
    <div>
      {/* 🖼 Hero Section with Overlay */}
      <section className="relative h-[160vh] w-full overflow-hidden">
        <img
          src={abouthero}
          alt="Aerial view of St. John Island"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover object-center scale-105 transition-transform duration-700 ease-in-out"
        />
        <div className="absolute inset-0 bg-black/40" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4"
        >
          <h1 className="text-white text-3xl md:text-5xl font-bold tracking-wide mb-4 leading-tight">
            About Us
          </h1>

          <div className="h-1 w-32 bg-gradient-to-r from-tropical-500 to-blue-400 rounded-full mb-4"></div>
          <p className="text-white ">
            The Local Experts in St. John Real Estate
          </p>
        </motion.div>
      </section>

      {/* 📜 Informational Section */}
      <section className="relative max-w-6xl mx-auto px-4 py-16 space-y-16">
        {/* Soft overlay behind text */}
        <div className="absolute inset-0 bg-white/90 z-0 rounded-xl" />

        <div className="relative z-10 space-y-16 text-black">
          {/* 📌 Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6 text-gray-950 leading-relaxed"
          >
            <h3 className="text-2xl font-semibold">
              Your Key to Paradise: The Local Experts in St. John Real Estate
            </h3>
            <p>
              Welcome to 340 Real Estate, your dedicated partner in navigating
              the vibrant and unique property market of St. John, U.S. Virgin
              Islands. Our name is a proud nod to our deep roots in this
              community—"340" is our area code, a constant reminder of our local
              commitment and expertise. We don't just sell properties here; we
              live here, we love it here, and we know this island from the sandy
              shores to the highest peaks.
            </p>
            <p>
              At 340 Real Estate, we believe that buying or selling a home in
              St. John is about more than just a transaction; it's about a
              lifestyle. Our team is made up of passionate, long-time residents
              who have an intimate understanding of each neighborhood's unique
              character. Whether you're dreaming of a luxury villa with
              breathtaking ocean views, a charming cottage tucked away in the
              hills, or the perfect plot of land to build your future, our
              unparalleled local knowledge is your greatest asset.
            </p>
            <p>
              Our approach is built on a foundation of integrity, personalized
              service, and a genuine desire to see our clients succeed. We take
              the time to understand your vision and work tirelessly to make it
              a reality. By combining our insider expertise with the latest
              market insights, we ensure a seamless, transparent, and rewarding
              experience from start to finish.
            </p>
            <p>
              Ready to find your piece of paradise? Let's start the
              conversation. Contact 340 Real Estate today and let our local
              knowledge lead you home.
            </p>
          </motion.div>

          {/* 📌 Quick Facts Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8 text-gray-700"
          >
            <ul className="list-disc pl-6 space-y-3 text-base leading-relaxed">
              <li>
                <strong>Size:</strong> 20 square miles – 7 miles long, 3 miles
                wide
              </li>
              <li>
                <strong>Highest Point:</strong> Bordeaux Mountain – 1,277 ft
                above sea level
              </li>
              <li>
                <strong>Map of St. John</strong>
              </li>
            </ul>
            <div className="text-sm text-gray-500 italic leading-relaxed">
              Real estate companies in St. John, USVI; real estate for sale in
              St. Thomas and the Virgin Islands; Caribbean real estate, rentals,
              and more.
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsHero;

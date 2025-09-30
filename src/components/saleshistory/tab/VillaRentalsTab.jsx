import React from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

// Local image imports
import stillWatersImg from "../../../assets/villa/stilwater/image2.jpg";
import desertRoseImg from "../../../assets/villa/desertvilla/image3.jpeg";
import villaBonitaImg from "../../../assets/villa/desertvilla/image4.jpg";
import fishTalesImg from "../../../assets/villa/fish-tales/4.jpg";
import mysticalMermaidImg from "../../../assets/villa/mystical/4.jpg";
import southernExposureImg from "../../../assets/villa/southern/13.jpg";
import frankBayImg from "../../../assets/villa/southern/12.jpg";

const villas = [
  {
    name: "Still Waters",
    image: stillWatersImg,
    description:
      "Still Waters is a stunning and fully private three bedroom, two bath villa with palm trees and secluded pool located in Chocolate Hole just a short 5 minute open-air taxi ride from Cruz Bay, and under 10 minutes to the most beautiful beaches in the world!",
    features: ["3 Bedrooms", "2 Baths", "Ocean Views", "Air Conditioning"],
  },
  {
    name: "Desert Rose Villa",
    image: desertRoseImg,
    description:
      "Desert Rose Villa is beautiful and spacious for easy living in Paradise. A great place to relax, swim and soak in the warm sunshine and watch Coral Bay go by. Only a 10 minute Drive to the most Beautiful Beaches in the World!",
    features: ["Spacious Layout", "Pool", "Sunshine", "Coral Bay Views"],
  },
  {
    name: "Villa Bonita",
    image: villaBonitaImg,
    description:
      "Villa Bonita is a 3 bedroom, 3 1/2 bath turnkey pool villa. Fine craftsmanship and attention to detail with beautiful finishes. Handicap accessible. 3 master suites. Central air. Successful rental.",
    features: ["3 Bedrooms", "3.5 Baths", "Handicap Accessible", "Pool"],
  },
  {
    name: "Fish Tales",
    image: fishTalesImg,
    description:
      "Fish Tales is a cute and comfortable 2 bedroom Caribbean Cottage with memory foam mattresses, dipping pool, and full size laundry. Easily accessed via a large flat driveway.",
    features: ["2 Bedrooms", "2.5 Baths", "Dipping Pool", "WiFi"],
  },
  {
    name: "Mystical Mermaid",
    image: mysticalMermaidImg,
    description:
      "Spacious 2 bed 2 bath home perfect for remote work. Luxury stone villa with modern Caribbean colors, salt water pool, hot tub, mountain views, and fast WiFi.",
    features: ["2 Bedrooms", "2 Baths", "Salt Water Pool", "Mountain Views"],
  },
  {
    name: "The Southern Exposure",
    image: southernExposureImg,
    description:
      "3 bedroom, 3 bath home in Fish Bay with quick access to Cruz Bay. Each bedroom has its own bathroom. Great for up to 6 guests.",
    features: [
      "3 Bedrooms",
      "3 Baths",
      "Private Bathrooms",
      "Fish Bay Location",
    ],
  },
  {
    name: "Frank Bay Pool House",
    image: frankBayImg,
    description:
      "Unparalleled views & island living at its best! Walk to Cruz Bay. Private pool, full kitchen, laundry, and tucked away on a quiet lane above Frank Bay.",
    features: ["Island Views", "Private Pool", "Full Kitchen", "Laundry"],
  },
];

const VillaRentalsTab = () => {
  return (
    <div className="px-6 py-12 max-w-7xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-12 text-green-700">
        Villa Rentals
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {villas.map((villa, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="bg-white shadow-xl rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform duration-300"
          >
            <img
              src={villa.image}
              alt={villa.name}
              className="w-full h-56 object-cover"
            />
            <div className="p-6 space-y-4">
              <h3 className="text-2xl font-bold text-gray-800">{villa.name}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {villa.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {villa.features.map((feature, idx) => (
                  <span
                    key={idx}
                    className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full"
                  >
                    {feature}
                  </span>
                ))}
              </div>
              <button className="mt-4 inline-block text-sm font-semibold text-blue-600 hover:underline">
                More Information
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default VillaRentalsTab;

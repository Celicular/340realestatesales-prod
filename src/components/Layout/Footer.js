import React from "react";
import { Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white  py-16">
      <div className="container-custom">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
          {/* Left Column - Main Title and GET IN TOUCH */}
          <div className="lg:col-span-1 text-center lg:text-left">
            {/* Main Title */}
            <h2 className="text-4xl font-serif font-light text-gray-600 uppercase tracking-wider mb-8">
              340 Real Estate
            </h2>

            {/* GET IN TOUCH Section */}
            <div className="mb-8">
              <h3 className="text-2xl font-serif font-light text-gray-600 uppercase tracking-wider mb-6">
                GET IN TOUCH
              </h3>

              {/* Circular Logo */}
              <div className="relative w-32 h-32 mb-6 mx-auto lg:mx-0">
                <div className="w-full h-full rounded-full border-2 border-cruzbay-teal flex items-center justify-center relative">
                  {/* CRUZ BAY Text - Top Arc */}
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
                    <span className="text-xs font-['Lato'] text-cruzbay-teal uppercase tracking-wider">
                      340
                    </span>
                  </div>

                  {/* REALTY Text - Bottom Arc */}
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                    <span className="text-xs font-['Lato'] text-cruzbay-teal uppercase tracking-wider">
                      USVi
                    </span>
                  </div>

                  {/* ESTD. and 1988 with Lines */}
                  <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
                    <span className="text-xs font-['Lato'] text-cruzbay-teal">
                      Real
                    </span>
                    <div className="w-4 h-px bg-cruzbay-teal mt-1"></div>
                  </div>
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <span className="text-xs font-['Lato'] text-cruzbay-teal">
                      Estate
                    </span>
                    <div className="w-4 h-px bg-cruzbay-teal mt-1"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column - Contact Information */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contact Info Column 1 */}
              <div className="space-y-6 text-center md:text-left">
                {/* Email */}
                <div className="flex items-start space-x-3 justify-center md:justify-start">
                  <Mail className="w-5 h-5 text-cruzbay-teal mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-['Lato'] text-black uppercase tracking-wider mb-1">
                      EMAIL
                    </p>
                    <a
                      href="mailto:340realestateco@gmail.com"
                      className="text-sm font-['Lato'] text-black underline hover:text-cruzbay-teal transition-colors"
                    >
                      340realestateco@gmail.com
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start space-x-3 justify-center md:justify-start">
                  <MapPin className="w-5 h-5 text-cruzbay-teal mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-['Lato'] text-black uppercase tracking-wider mb-1">
                      ADDRESS
                    </p>
                    <p className="text-sm font-['Lato'] text-black">
                      340 Real Estate Company, PO Box 766,{" "}
                    </p>
                    <p className="text-sm font-['Lato'] text-black">
                      St John, VI 00831
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Info Column 2 */}
              <div className="space-y-6 text-center md:text-left">
                {/* Phone */}
                <div className="flex items-start space-x-3 justify-center md:justify-start">
                  <Phone className="w-5 h-5 text-cruzbay-teal mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-['Lato'] text-black uppercase tracking-wider mb-1">
                      PHONE NUMBER
                    </p>
                    <a
                      href="tel:+1 340-643-6068"
                      className="text-sm font-['Lato'] text-black underline hover:text-cruzbay-teal transition-colors"
                    >
                      340-643-6068
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer and Logos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Disclaimer Text */}
          <div className="lg:col-span-2 text-center lg:text-left">
            <p className="text-xs font-['Lato'] text-black leading-relaxed">
              All information is deemed reliable but not guaranteed and should
              be independently reviewed and verified.
            </p>
          </div>
        </div>

        {/* Separator Line */}
        <div className="w-full h-px bg-gray-300 mb-8"></div>

        {/* Social Media Icons */}
        <div className="flex justify-center space-x-4">
          {/* Facebook */}
          <div className="w-10 h-10 bg-cruzbay-beige rounded-full flex items-center justify-center cursor-pointer hover:bg-cruzbay-beige-dark transition-colors">
            <span className="text-white font-bold text-lg">f</span>
          </div>

          {/* Instagram */}
          <div className="w-10 h-10 bg-cruzbay-beige rounded-full flex items-center justify-center cursor-pointer hover:bg-cruzbay-beige-dark transition-colors">
            <svg
              className="w-5 h-5 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </div>

          {/* Google */}
          <div className="w-10 h-10 bg-cruzbay-beige rounded-full flex items-center justify-center cursor-pointer hover:bg-cruzbay-beige-dark transition-colors">
            <span className="text-white font-bold text-lg">G</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
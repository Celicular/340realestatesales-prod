import React from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import logo from "../../assets/logo.png";
import logowritten from "../../assets/340realestate.png"

const Footer = () => {
  return (
    <footer className="bg-white px-8 py-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center">
          {/* Left Section */}
          <div className="mb-8 md:mb-0">
            {/* <h1 className="text-xl font-serif font-light tracking-wide">340 Real Estate</h1> */}
            <img src={ logowritten} alt="340 Real Estate" className="w-auto h-16 object-contain" />
            <p className="mt-4 text-lg font-['Lato'] font-light">GET IN TOUCH</p>
            <div className="mt-4 space-y-2 text-sm font-['Lato'] font-light pl-24">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-600" />
                <div>
                  <p className="font-['Lato'] font-semibold">EMAIL</p>
                  <p className="font-['Lato']">340realestateco@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-600" />
                <div>
                  <p className="font-['Lato'] font-semibold">ADDRESS</p>
                  <p className="font-['Lato']">340 Real Estate Company,</p>
                  <p className="font-['Lato']">ST JOHN VI 00831</p>
                </div>
              </div>
            </div>
          </div>

        {/* Right Section */}
        <div className="mb-8 md:mb-0">
          <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4 text-gray-600" />
            <div>
              <p className="font-['Lato'] font-semibold text-sm">PHONE NUMBER</p>
              <p className="font-['Lato'] text-sm">+1 340-643-6068</p>
            </div>
          </div>
        </div>
      </div>

      {/* Logo and Disclaimer */}
      <div className="max-w-7xl mx-auto mt-8 border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center">
        {/* Company Logo */}
        <div className="mb-4 md:mb-0">
          <img
            src={logo}
            alt="340 Real Estate Logo"
            className="w-32 h-auto object-contain"
          />
        </div>
        
        {/* Disclaimer Text */}
        <div className="flex-1 mx-6">
          <p className="text-xs font-['Lato'] text-gray-500 text-center md:text-left leading-relaxed">
            Information on this site is believed to be accurate but not guaranteed. 340 Real Estate Co LLC is a member of the St. John Board of Realtors, St Thomas Board of Realtors and the Multiple Listing Service.
          </p>
        </div>
        
        {/* Certification Logos */}
        <div className="flex space-x-4 mt-4 md:mt-0">
          <div className="flex items-center space-x-2 bg-white border border-gray-300 px-3 py-2 rounded">
            <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
              <span className="text-white text-xs font-['Lato'] font-bold">R</span>
            </div>
            <span className="text-xs font-['Lato'] text-gray-700 font-semibold">REALTOR®</span>
          </div>
          
          <div className="flex items-center space-x-2 bg-white border border-gray-300 px-3 py-2 rounded">
            <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            <span className="text-xs font-['Lato'] text-gray-700 font-semibold">Equal Housing</span>
          </div>
        </div>
      </div>

      {/* Social Icons */}
      <div className="max-w-7xl mx-auto mt-6 flex justify-end space-x-4">
        {/* Facebook */}
        <a 
          href="#" 
          className="w-10 h-10 rounded-full bg-[#d4b196] flex items-center justify-center text-white cursor-pointer hover:bg-[#c4a185] transition-colors duration-200"
        >
          <span className="font-['Lato'] font-bold text-sm">f</span>
        </a>
        
        {/* Instagram */}
        <a 
          href="#" 
          className="w-10 h-10 rounded-full bg-[#d4b196] flex items-center justify-center text-white cursor-pointer hover:bg-[#c4a185] transition-colors duration-200"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        </a>
        
        {/* Google */}
        <a 
          href="#" 
          className="w-10 h-10 rounded-full bg-[#d4b196] flex items-center justify-center text-white cursor-pointer hover:bg-[#c4a185] transition-colors duration-200"
        >
          <span className="font-['Lato'] font-bold text-sm">G</span>
        </a>
      </div>
    </footer>
  );
};

export default Footer;

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import logowritten from "../../assets/340realestate.png";
// import logo from "../assets/logo.png"; // Ensure you have a logo image in the specified path

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Helper function to check if a link has children (dropdown)
  const isDropdown = (link) => {
    return link.children && link.children.length > 0;
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Meet our Team", path: "/meetourteam" },
    // { name: "Meet our Team", path: "/aboutus" },

    { name: "portfolio", path: "/about" },

    {
      name: "Property Search ↴",
      children: [
        { name: "Residential", path: "/properties" },
        // {
        //   name: "Commercial ↴",
        //   children: [
        //     { name: "For Sales", disabled: true },

        //     {
        //       name: "Recent Sales",
        //       path: "https://my.flexmls.com/TamelaDonnelly/search/email_links/20250816153528152858000000/listings",
        //     },
        //   ],
        // },
        { name: "Land", path: "/landproperties" },
      ],
    },

    { name: "Home Valuation", path: "/saleshistory" },

    ,
    { name: "Testimonials", path: "/testimonial" },
    { name: "About St. John", path: "/about" },
    { name: "Sales History", path: "/saleshistory" },
    { name: "Contact Us", path: "/contact" },
    // {
    //   name: "Attraction ↴",
    //   children: [
    //     { name: "Reef Bay Trail", path: "https://www.nps.gov/thingstodo/reef-bay-trail.htm" },
    //     { name: "Explore St. John", path: "https://explorestj.com" },
    //     { name: "Videos", path: "/attraction/video" },
    //   ],
    // },

    { name: "Blogs", path: "/blogs" },
    { name: "Incentives", path: "/incentives" },
  ];

  // Handle scroll to change header appearance
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-lg py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Left Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <div className="relative group">
              <button
                className={`flex items-center space-x-1 font-alumni font-medium text-xl transition-colors duration-300 ${
                  isScrolled
                    ? "text-gray-700 hover:text-cruzbay-teal"
                    : "text-white hover:text-cruzbay-coral"
                }`}
              >
                <span>Property Search</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <Link
                  to="/properties"
                  className="block px-4 py-2 text-gray-700 hover:bg-cruzbay-teal hover:text-black rounded-t-lg transition-colors"
                >
                  Property
                </Link>
                <Link
                  to="/contact"
                  className="block px-4 py-2 text-gray-700 hover:bg-cruzbay-teal hover:text-black transition-colors"
                >
                  Land Property
                </Link>
                {/* <Link
                  to="/properties"
                  className="block px-4 py-2 text-gray-700 hover:bg-cruzbay-teal hover:text-white rounded-b-lg transition-colors"
                >
                  Rent Property
                </Link> */}
              </div>
            </div>

            <Link
              to="/about"
              className={`font-alumni font-medium text-xl transition-colors duration-300 ${
                isScrolled
                  ? "text-gray-700 hover:text-cruzbay-teal"
                  : "text-white hover:text-cruzbay-coral"
              }`}
            >
              About St John
            </Link>
            <Link
              to="/about-340-realestate-team"
              className={`font-alumni font-medium text-xl transition-colors duration-300 ${
                isScrolled
                  ? "text-gray-700 hover:text-cruzbay-teal"
                  : "text-white hover:text-cruzbay-coral"
              }`}
              a
            >
              About Us
            </Link>
          </nav>

          {/* Center Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img
              src={logowritten}
              alt="340 Real Estate Logo"
              className="h-20 w-auto object-contain"
            />
            {/*             <h1
              className={`text-3xl font-alumni font-bold transition-colors duration-300 ${
                isScrolled ? "text-cruzbay-teal" : "text-white"
              }`}
            >
              340 Real Estate
            </h1> */}
          </Link>

          {/* Right Navigation */}
          <div className="flex items-center space-x-6">
            <Link
              to="/saleshistory"
              className={`hidden lg:block font-alumni font-medium text-xl transition-colors duration-300 ${
                isScrolled
                  ? "text-gray-700 hover:text-cruzbay-teal"
                  : "text-white hover:text-cruzbay-coral"
              }`}
            >
              Sales History
            </Link>
            <Link
              to="/contact"
              className={`hidden lg:block font-alumni font-medium text-xl transition-colors duration-300 ${
                isScrolled
                  ? "text-gray-700 hover:text-cruzbay-teal"
                  : "text-white hover:text-cruzbay-coral"
              }`}
            >
              Contact Us
            </Link>
            <a
              href="tel:+13406436068"
              className={`hidden lg:block font-alumni font-medium text-xl transition-colors duration-300 ${
                isScrolled
                  ? "text-cruzbay-teal hover:text-cruzbay-teal-dark"
                  : "text-white hover:text-cruzbay-coral"
              }`}
            >
              +1 340-643-6068
            </a>

            {/* Hamburger Menu Button - Always visible */}
            <button
              onClick={toggleMenu}
              className={`p-2 rounded-lg transition-colors duration-300 ${
                isScrolled
                  ? "text-gray-700 hover:bg-gray-100"
                  : "text-white hover:bg-white/10"
              }`}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>

            {/* MODAL / DRAWER - Placed outside the header for correct stacking */}
            {isMenuOpen && (
              <>
                {/* Overlay */}
                <div
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[90] transition-opacity duration-300"
                  onClick={() => setIsMenuOpen(false)}
                />

                {/* Drawer */}
                <div className="fixed top-0 right-0 h-full w-full max-w-full bg-[#fefaf6]/80 backdrop-blur-2xl shadow-[0_0_30px_rgba(0,0,0,0.2)] z-[100] flex flex-col animate-slide-in border-l border-[#e5dcd0]">
                  {/* Drawer Header */}
                  <div className="flex items-center justify-between px-6 py-6 border-b border-[#e7d8ca]">
                    <button
                      onClick={() => setIsMenuOpen(false)}
                      className="p-2 rounded-full hover:bg-[#f1e8dd] transition duration-300 shadow-md border border-[#ddd]"
                      aria-label="Close Menu"
                    >
                      <X size={28} className="text-[#2d1f15]" />
                    </button>
                    <img
                      src={logowritten}
                      alt="340 Real Estate Logo"
                      className="h-16 w-auto object-contain"
                    />
                  </div>

                  {/* Nav links */}
                  <nav className="flex-1 overflow-y-auto px-6 py-4 space-y-3 text-right">
                    {navLinks.map((link) =>
                      isDropdown(link) ? (
                        <div key={link.name} className="mb-5">
                          <span className="block text-lg font-semibold font-alumni text-[#4d3c2e] mb-2 tracking-wide text-right">
                            {link.name}
                          </span>
                          <div className="pr-3 space-y-2">
                            {link.children.map((child) =>
                              child.children ? (
                                // Nested dropdown
                                <div key={child.name} className="mb-3">
                                  <span className="block px-4 py-2 rounded-xl text-base font-alumni text-[#523d2c] font-semibold text-right">
                                    {child.name}
                                  </span>
                                  <div className="pr-4 space-y-1 mt-1">
                                    {child.children.map((grandChild) =>
                                      grandChild.disabled ||
                                      !grandChild.path ? (
                                        <span
                                          key={grandChild.name}
                                          className="block px-4 py-2 rounded-xl text-sm font-noto text-gray-400 cursor-not-allowed text-right"
                                        >
                                          {grandChild.name}
                                        </span>
                                      ) : grandChild.path.startsWith("http") ? (
                                        <a
                                          key={grandChild.name}
                                          href={grandChild.path}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          onClick={() => setIsMenuOpen(false)}
                                          className="block px-4 py-2 rounded-xl text-sm font-noto text-[#523d2c] hover:bg-[#f4eee9] hover:text-[#a67c52] transition-all duration-200 text-right"
                                        >
                                          {grandChild.name}
                                        </a>
                                      ) : (
                                        <Link
                                          key={grandChild.name}
                                          to={grandChild.path}
                                          onClick={() => setIsMenuOpen(false)}
                                          className="block px-4 py-2 rounded-xl text-sm font-noto text-[#523d2c] hover:bg-[#f4eee9] hover:text-[#a67c52] transition-all duration-200 text-right"
                                        >
                                          {grandChild.name}
                                        </Link>
                                      )
                                    )}
                                  </div>
                                </div>
                              ) : child.disabled || !child.path ? (
                                <span
                                  key={child.name}
                                  className="block px-4 py-2 rounded-xl text-base font-noto text-gray-400 cursor-not-allowed text-right"
                                >
                                  {child.name}
                                </span>
                              ) : child.path.startsWith("http") ? (
                                <a
                                  key={child.name}
                                  href={child.path}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => setIsMenuOpen(false)}
                                  className="block px-4 py-2 rounded-xl text-base font-noto text-[#523d2c] hover:bg-[#f4eee9] hover:text-[#a67c52] transition-all duration-200 text-right"
                                >
                                  {child.name}
                                </a>
                              ) : (
                                <Link
                                  key={child.name}
                                  to={child.path}
                                  onClick={() => setIsMenuOpen(false)}
                                  className="block px-4 py-2 rounded-xl text-base font-noto text-[#523d2c] hover:bg-[#f4eee9] hover:text-[#a67c52] transition-all duration-200 text-right"
                                >
                                  {child.name}
                                </Link>
                              )
                            )}
                          </div>
                        </div>
                      ) : (
                        <Link
                          key={link.name}
                          to={link.path}
                          onClick={() => setIsMenuOpen(false)}
                          className={`block px-4 py-3 rounded-xl text-lg font-semibold font-alumni tracking-wide transition duration-300 hover:bg-[#f2eae1] hover:text-[#a67c52] text-right ${
                            location.pathname === link.path
                              ? "text-[#a67c52]"
                              : "text-[#3b2b20]"
                          }`}
                        >
                          {link.name}
                        </Link>
                      )
                    )}
                  </nav>
                </div>

                {/* Animation */}
                <style>{`
      @keyframes slide-in {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
      }
      .animate-slide-in {
        animation: slide-in 0.35s ease-in-out;
      }
    `}</style>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu - Full Screen Overlay */}
        {isMenuOpen && (
          <div className="fixed inset-0 top-16 bg-black/50 backdrop-blur-sm z-40 lg:hidden">
            <div className="bg-white h-full w-full mt-4 shadow-2xl">
              <nav className="flex flex-col space-y-2 px-6 py-8">
                <Link
                  to="/properties"
                  onClick={toggleMenu}
                  className="py-3 text-gray-700 hover:text-cruzbay-teal font-alumni font-medium text-lg transition-colors border-b border-gray-100"
                >
                  Services
                </Link>
                <Link
                  to="/about"
                  onClick={toggleMenu}
                  className="py-3 text-gray-700 hover:text-cruzbay-teal font-alumni font-medium text-lg transition-colors border-b border-gray-100"
                >
                  About Us
                </Link>
                <Link
                  to="/about-340-realestate-team"
                  onClick={toggleMenu}
                  className="py-3 text-gray-700 hover:text-cruzbay-teal font-alumni font-medium text-lg transition-colors border-b border-gray-100"
                >
                  About St John
                </Link>
                <Link
                  to="/saleshistory"
                  onClick={toggleMenu}
                  className="py-3 text-gray-700 hover:text-cruzbay-teal font-alumni font-medium text-lg transition-colors border-b border-gray-100"
                >
                  Sales History
                </Link>
                <Link
                  to="/contact"
                  onClick={toggleMenu}
                  className="py-3 text-gray-700 hover:text-cruzbay-teal font-alumni font-medium text-lg transition-colors border-b border-gray-100"
                >
                  Contact Us
                </Link>
                <a
                  href="tel:+13406436068"
                  onClick={toggleMenu}
                  className="mt-6 py-3 px-4 bg-cruzbay-teal text-white text-center rounded-lg hover:bg-cruzbay-teal-dark font-alumni font-medium text-lg transition-colors"
                >
                  +1 340-643-6068
                </a>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

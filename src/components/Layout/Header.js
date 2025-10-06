import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import villas from "../../data/Villas";
import { selectVilla } from "../../redux/slices/villaSlice";
import { getRentalProperties } from "../../firebase/firestore";
import logo from "../../assets/logo.png";

// const HEADER_BG = "#ede4de";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [rentalProperties, setRentalProperties] = useState([]);
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
  }, [isMenuOpen]);

  // Fetch rental properties for dropdown
  useEffect(() => {
    const fetchRentalProperties = async () => {
      try {
        const result = await getRentalProperties({ status: "approved" });
        if (result.success) {
          setRentalProperties(result.data);
        }
      } catch (error) {
        console.error("Error fetching rental properties for header:", error);
      }
    };

    fetchRentalProperties();
  }, []);

  // All links for mobile menu
  const navLinks = [
    { name: "Home", path: "/" },
    {
      name: "About ↴",
      children: [
        {
          name: "About Us",
          path: "/aboutus",
        },
        {
          name: "About St. John",
          path: "/about",
        },
      ],
    },

    {
      name: "Rentals ↴",
      children: [
        // Premium Villas
        // ...villas.map((villa) => ({
        //   name: villa.name,
        //   slug: villa.slug,
        //   path: `/villa-rentals/${villa.slug}`,
        // })),
        // Agent Listings (will be populated dynamically)
        ...(rentalProperties.length > 0
          ? [
              { name: "--- Agent Listings ---", path: "#", disabled: true },
              ...rentalProperties.map((rental) => ({
                name: rental.propertyInfo?.name || "Unnamed Property",
                path: `/rental/${rental.propertyInfo?.slug || rental.id}`,
              })),
            ]
          : []),
      ],
    },

    { name: "Testimonials", path: "/testimonial" },
    // { name: "For Sale", path: "/properties" },
    {
      name: "Property Search ↴",
      children: [
        {
          name: "Residential",
          path: "/properties",
        },
        {
          name: "Commercial ↴",
          children: [
            {
              name: "For Sales",
              // path: "https://my.flexmls.com/TamelaDonnelly/search/email_links/20250816155435529387000000/listings",
            },
            {
              name: "Recent Sales",
              path: "https://my.flexmls.com/TamelaDonnelly/search/email_links/20250816153528152858000000/listings",
            },
          ],
        },
        {
          name: "Land",
          path: "/landproperties",
        },
      ],
    },

    { name: "Sales History", path: "/saleshistory" },

    {
      name: "Attraction ↴",
      children: [
        {
          name: "Reef Bay Trail",
          path: "https://www.nps.gov/thingstodo/reef-bay-trail.htm",
        },
        { name: "Explore St. John", path: "https://explorestj.com" },
        { name: "Videos", path: "/attraction/video" },
      ],
    },
    {
      name: "Blogs ↴",
      children: [
        { name: "Blogs", path: "/blogs" },
        // { name: "Video Blogs", path: "/blogs/video" },
      ],
    },
    { name: "Incentives", path: "/incentives" },
  ];

  // Only show these on desktop
  const desktopNavLinks = navLinks.filter(
    (link) =>
      link.name === "Home" ||
      link.name.startsWith("About") ||
      link.name.startsWith("Rentals") ||
      link.name === "Testimonials" ||
      link.name === "For Sale"
  );

  // Only show these in desktop hamburger
  const desktopHamburgerLinks = navLinks.filter(
    (link) =>
      link.name === "Sales History" ||
      link.name.startsWith("Attraction") ||
      link.name.startsWith("Blogs") ||
      link.name === "Incentives"
  );

  const isDropdown = (item) => item.children && item.children.length > 0;

  // Responsive check
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Hamburger icon animation (simple swap for now)
  const HamburgerIcon = ({ open }) => (
    <span className="inline-block transition-transform duration-300">
      {open ? <X size={32} /> : <Menu size={32} />}
    </span>
  );

  return (
    <header
      className={`fixed top-0 h-24 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        isScrolled ? "bg-[#fbf9f8] shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center text-sm justify-between h-16 lg:h-20">
          {/* Left Side Navigation */}
          <nav className="hidden lg:flex gap-x-2 uppercase">
            {/* Property Search Dropdown */}
            <div className="relative group">
              <span
                className={`cursor-pointer font-barlow text-sm px-2 py-1 transition-all duration-200 ${
                  isScrolled
                    ? "text-[#3c6a72] hover:text-[#285053]"
                    : "text-white hover:text-blue-200"
                } group-hover:text-blue-500`}
              >
                Property Search ↴
              </span>
              {/* Dropdown */}
              <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg opacity-0 invisible group-hover:visible group-hover:opacity-100 group-hover:translate-y-1 transform transition-all duration-300 z-50">
                <Link
                  to="/properties"
                  className="block px-4 py-2 text-md font-barlow text-blue-800 font-semibold hover:text-blue-600 hover:bg-blue-50"
                >
                  Residential
                </Link>
                {/* Commercial with nested dropdown */}
                <div className="relative group/commercial">
                  <span className="block px-4 py-2 text-md font-barlow text-blue-800 font-semibold hover:text-blue-600 hover:bg-blue-50 cursor-pointer group-hover/commercial:text-blue-600 group-hover/commercial:bg-blue-50">
                    Commercial ↴
                  </span>
                  {/* Nested dropdown for Commercial */}
                  <div className="absolute left-full top-0 ml-1 w-40 bg-white shadow-lg opacity-0 invisible group-hover/commercial:visible group-hover/commercial:opacity-100 transform transition-all duration-300 z-50">
                    <a
                      href="#"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-2 text-sm font-barlow text-blue-800 font-semibold hover:text-blue-600 hover:bg-blue-50"
                    >
                      For Sales
                    </a>
                    <a
                      href="https://my.flexmls.com/TamelaDonnelly/search/email_links/20250816153528152858000000/listings"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-2 text-sm font-barlow text-blue-800 font-semibold hover:text-blue-600 hover:bg-blue-50"
                    >
                      Recent Sales
                    </a>
                  </div>
                </div>
                <Link
                  to="/landproperties"
                  className="block px-4 py-2 text-md font-barlow text-blue-800 font-semibold hover:text-blue-600 hover:bg-blue-50"
                >
                  Land
                </Link>
              </div>
            </div>

        
            <div className="relative group">
              <span
                className={`cursor-pointer font-barlow text-sm px-2 py-1 transition-all duration-200 ${
                  isScrolled
                    ? "text-[#3c6a72] hover:text-[#285053]"
                    : "text-white hover:text-blue-200"
                } group-hover:text-blue-500 ${
                  (location.pathname === "/about" || location.pathname === "/aboutus") && isScrolled
                    ? "font-bold underline"
                    : ""
                }`}
              >
                About ↴
              </span>
              {/* Dropdown */}
              <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg opacity-0 invisible group-hover:visible group-hover:opacity-100 group-hover:translate-y-1 transform transition-all duration-300 z-50">
                <Link
                  to="/aboutus"
                  className="block px-4 py-2 text-md font-barlow text-blue-800 font-semibold hover:text-blue-600 hover:bg-blue-50"
                >
                  About Us
                </Link>
                <Link
                  to="/about"
                  className="block px-4 py-2 text-md font-barlow text-blue-800 font-semibold hover:text-blue-600 hover:bg-blue-50"
                >
                  About St. John
                </Link>
              </div>
            </div>
          </nav>

          {/* Logo - Centered */}
          <div className="flex-1 flex lg:justify-center pt-4 sm:justify-start">
            <Link to="/" className="flex items-center space-x-3">
              <img
                src={logo}
                alt="340 Real Estate logo"
                className="h-16 w-auto sm:w-16"
              />
              <div className="leading-tight">
                <h1
                  className={`text-sm sm:text-xl font-bold font-barlow transition-colors uppercase duration-300`}
                  style={{
                    color: isScrolled ? "#2d3a3a" : "#ffffff",
                    letterSpacing: "1px",
                  }}
                >
                  340 REAL ESTATE
                </h1>
              </div>
            </Link>
          </div>

          {/* Right Side Elements */}
          <div className="hidden lg:flex items-center gap-x-2 uppercase">
            {/* Rental Dropdown */}
            <div className="relative group">
              <span
                className={`cursor-pointer font-barlow text-sm px-2 py-1 transition-all duration-200 ${
                  isScrolled
                    ? "text-[#3c6a72] hover:text-[#285053]"
                    : "text-white hover:text-blue-200"
                } group-hover:text-blue-500`}
              >
                Rental ↴
              </span>
              {/* Dropdown */}
              <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg opacity-0 invisible group-hover:visible group-hover:opacity-100 group-hover:translate-y-1 transform transition-all duration-300 z-50 rounded-lg overflow-hidden">
                {/* Existing Villas Section */}
                <div className="bg-gray-50 px-3 py-2 border-b">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Premium Villas
                  </span>
                </div>
                {/* {villas.map((villa) => (
                  <Link
                    key={villa.name}
                    to={`/villa-rentals/${villa.slug}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 text-md font-barlow text-blue-800 font-semibold hover:text-blue-600 hover:bg-blue-50 border-b border-gray-100"
                  >
                    {villa.name}
                  </Link>
                ))} */}

                {/* Rental Properties Section */}
                {rentalProperties.length > 0 && (
                  <>
                    {/* <div className="bg-blue-50 px-3 py-2 border-b">
                      <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Agent Listings</span>
                    </div> */}
                    {rentalProperties.map((rental) => (
                      <Link
                        key={rental.id}
                        to={`/rental/${rental.propertyInfo?.slug || rental.id}`}
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-4 py-2 text-md font-barlow text-blue-800 font-semibold hover:text-blue-600 hover:bg-blue-50 border-b border-gray-100"
                      >
                        {rental.propertyInfo?.name || "Unnamed Property"}
                      </Link>
                    ))}
                  </>
                )}
              </div>
            </div>

            {/* Testimonial */}
            <Link
              to="/testimonial"
              className={`font-barlow text-sm px-2 py-1 rounded-md transition-all duration-200 ${
                isScrolled
                  ? "text-[#3c6a72] hover:text-[#285053]"
                  : "text-white hover:text-blue-200"
              } ${
                location.pathname === "/testimonial" && isScrolled
                  ? "font-bold underline"
                  : ""
              }`}
            >
              Testimonial
            </Link>

            {/* Phone Number */}
            <a
              href="tel:+13406436068"
              className={`font-barlow text-sm px-2 py-1 transition-all duration-200 ${
                isScrolled
                  ? "text-[#3c6a72] hover:text-[#285053]"
                  : "text-white hover:text-blue-200"
              }`}
            >
              +1 340-643-6068
            </a>
          </div>

          {/* Hamburger Menu Button (touching the phone number) */}
          <div className="flex justify-end ml-2">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 transition-all duration-300  ${
                isMenuOpen ? " " : ""
              }`}
              aria-label="Toggle Menu"
              aria-expanded={isMenuOpen}
            >
              <HamburgerIcon open={isMenuOpen} />
            </button>
          </div>
        </div>

        {/* Overlay and Drawer */}
        {isMenuOpen && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Drawer */}
            <div className="fixed top-0 right-0 h-full w-[85vw] sm:w-[22rem] max-w-full bg-[#fefaf6]/80 backdrop-blur-2xl rounded-l-[2.5rem] shadow-[0_0_30px_rgba(0,0,0,0.2)] z-50 flex flex-col animate-slide-in border-l border-[#e5dcd0]">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-6 border-b border-[#e7d8ca]">
                <span className="text-2xl font-mont  text-[#2d1f15] tracking-wide">
                  St John{" "}
                </span>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-[#f1e8dd] transition duration-300 shadow-md border border-[#ddd]"
                  aria-label="Close Menu"
                >
                  <X size={28} className="text-[#2d1f15]" />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                {(isMobile ? navLinks : desktopHamburgerLinks).map((link) =>
                  isDropdown(link) ? (
                    <div key={link.name} className="mb-5">
                      <span className="block text-lg font-semibold font-mont text-[#4d3c2e] mb-2 tracking-wide">
                        {link.name}
                      </span>
                      <div className="pl-3 space-y-2">
                        {link.children.map((child) =>
                          child.children ? (
                            // Nested dropdown
                            <div key={child.name} className="mb-3">
                              <span className="block px-4 py-2 rounded-xl text-base font-barlow text-[#523d2c] font-semibold">
                                {child.name}
                              </span>
                              <div className="pl-4 space-y-1 mt-1">
                                {child.children.map((grandChild) =>
                                  grandChild.path.startsWith("http") ? (
                                    <a
                                      key={grandChild.name}
                                      href={grandChild.path}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={() => setIsMenuOpen(false)}
                                      className="block px-4 py-2 rounded-xl text-sm font-barlow text-[#523d2c] hover:bg-[#f4eee9] hover:text-[#a67c52] transition-all duration-200"
                                    >
                                      {grandChild.name}
                                    </a>
                                  ) : (
                                    <Link
                                      key={grandChild.name}
                                      to={grandChild.path}
                                      onClick={() => setIsMenuOpen(false)}
                                      className="block px-4 py-2 rounded-xl text-sm font-barlow text-[#523d2c] hover:bg-[#f4eee9] hover:text-[#a67c52] transition-all duration-200"
                                    >
                                      {grandChild.name}
                                    </Link>
                                  )
                                )}
                              </div>
                            </div>
                          ) : child.path.startsWith("http") ? (
                            <a
                              key={child.name}
                              href={child.path}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => setIsMenuOpen(false)}
                              className="block px-4 py-2 rounded-xl text-base font-barlow text-[#523d2c] hover:bg-[#f4eee9] hover:text-[#a67c52] transition-all duration-200"
                            >
                              {child.name}
                            </a>
                          ) : (
                            <Link
                              key={child.name}
                              to={child.path}
                              onClick={() => {
                                // Don't dispatch selectVilla here - let VillaDetail handle it
                                setIsMenuOpen(false);
                              }}
                              className="block px-4 py-2 rounded-xl text-base font-barlow text-[#523d2c] hover:bg-[#f4eee9] hover:text-[#a67c52] transition-all duration-200"
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
                      className={`block px-4 py-3 rounded-xl text-lg font-semibold font-mont tracking-wide transition duration-300 hover:bg-[#f2eae1] hover:text-[#a67c52] ${
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
    </header>
  );
};

export default Header;

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectAllBlogs } from "../../redux/slices/blogslice";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import blog1 from "../../assets/articles/340realestate-intro.jpg";
import blog2 from "../../assets/articles/Honeymoon-Beach.jpg";
import blog3 from "../../assets/articles/property-types-stjohn.jpg";

// Sample HD hero images (royalty-free)
const heroImages = [
  blog1,
  blog2,
  blog3,
  // "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",

  // "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
];

const BlogList = () => {
  const blogs = useSelector(selectAllBlogs);
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 4000); // 4 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {/* Hero Slideshow */}
      <div className="relative h-[80vh] w-full overflow-hidden">
        {heroImages.map((img, idx) => (
          <motion.img
            key={idx}
            src={img}
            alt={`Slide ${idx}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: currentSlide === idx ? 1 : 0 }}
            transition={{ duration: 1 }}
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        ))}
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-center px-6">
          <h1 className="text-4xl md:text-6xl text-white font-bold mb-4">
            Welcome to Our Blog
          </h1>
          <p className="text-white text-lg md:text-xl max-w-2xl">
            Explore insights, stories, and beautiful moments from paradise.
          </p>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-6 max-w-7xl mx-auto mt-10">
        {blogs.map((blog) => (
          <motion.div
            key={blog.id}
            className="bg-white shadow-md rounded-xl overflow-hidden cursor-pointer hover:shadow-xl transition duration-300"
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate(`/blog/${blog.id}`)}
          >
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 space-y-2">
              <h2 className="text-xl font-semibold text-gray-800">
                {blog.title}
              </h2>
              <p className="text-gray-600 text-sm line-clamp-3">
                {blog.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BlogList;

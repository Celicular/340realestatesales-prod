import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAllBlogs } from "../redux/slices/blogslice";
import { motion } from "framer-motion";

const BlogDetails = () => {
  const { id } = useParams();
  const blog = useSelector(selectAllBlogs).find((b) => String(b.id) === id);

  if (!blog) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-red-500">🚫 Blog not found.</p>
      </div>
    );
  }

  // Description parsing utility
  const renderDescription = (desc) => {
    return desc.split("\n").map((line, index) => {
      if (line.startsWith("##")) {
        return (
          <h2
            key={index}
            className="text-2xl font-bold mt-6 mb-2 text-gray-800"
          >
            {line.replace("##", "").trim()}
          </h2>
        );
      } else if (line.startsWith("-")) {
        return (
          <li key={index} className="ml-5 list-disc text-gray-600 text-base">
            {line.replace("-", "").trim()}
          </li>
        );
      } else {
        return (
          <p key={index} className="text-gray-700 text-base mb-3">
            {line.trim()}
          </p>
        );
      }
    });
  };

  return (
    <div>
      {/* Hero Section */}
      <motion.div
        className="h-[80vh] w-full relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <img
          src="https://www.waveestate.in/blogs/wp-content/uploads/2016/01/NRI-Real-Estate.jpg"
          alt={blog.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <h1 className="text-white text-4xl md:text-5xl font-bold text-center px-4">
            {blog.title}
          </h1>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-6">
        {/* Blog Content Image */}
        <motion.img
          src={blog?.coverImage}
          alt={blog.title}
          className="w-full h-[300px] object-cover rounded-xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        />

        {/* Description */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          {renderDescription(blog.description)}
        </motion.div>
      </div>
    </div>
  );
};

export default BlogDetails;

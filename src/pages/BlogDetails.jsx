import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { getBlog, updateBlog } from "../firebase/firestore";
import hardcodedBlogs from "../data/Blogs";
import newImage from "../assets/new.jpg";

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBlog = async () => {
      try {
        setLoading(true);
        
        // First, check if it's a hardcoded blog
        const hardcodedBlog = hardcodedBlogs.find(blog => blog.id === id);
        
        if (hardcodedBlog) {
          // It's a hardcoded blog
          setBlog(hardcodedBlog);
          setLoading(false);
          return;
        }
        
        // If not found in hardcoded blogs, try fetching from backend
        const result = await getBlog(id);
        if (result.success) {
          setBlog(result.data);
          // Increment view count for backend blogs only
          await updateBlog(id, { views: (result.data.views || 0) + 1 });
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError('Failed to fetch blog');
        console.error('Error fetching blog:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadBlog();
  }, [id]);

  const formatDate = (dateField) => {
    if (!dateField) return 'Recent';
    
    let date;
    if (dateField.seconds) {
      // Firestore timestamp
      date = new Date(dateField.seconds * 1000);
    } else if (dateField instanceof Date) {
      // Regular Date object
      date = dateField;
    } else if (typeof dateField === 'string') {
      // String date
      date = new Date(dateField);
    } else {
      return 'Recent';
    }
    
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading blog...</span>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-red-500">🚫 {error || 'Blog not found.'}</p>
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
      } else if (line.startsWith("**") && line.endsWith("**")) {
        // Handle bold text
        return (
          <p key={index} className="text-gray-700 text-base mb-3 font-bold">
            {line.replace(/\*\*/g, "").trim()}
          </p>
        );
      } else if (line.startsWith("-")) {
        return (
          <li key={index} className="ml-5 list-disc text-gray-600 text-base">
            {line.replace("-", "").trim()}
          </li>
        );
      } else if (line.includes("[") && line.includes("](")) {
        // Handle markdown links and images
        if (line.startsWith("![")) {
          // Handle markdown images: ![alt text](image-url)
          const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/;
          const match = line.match(imageRegex);
          if (match) {
            const [, altText, imageSrc] = match;
            
            // Hardcode image for the welcome blog
            let finalImageSrc = imageSrc;
            console.log('Blog ID:', blog?.id, 'Image src:', imageSrc); // Debug log
            
            if (blog?.id === "340-real-estate-first-blog" && imageSrc === "new.jpg") {
              console.log('Using newImage for welcome blog'); // Debug log
              finalImageSrc = newImage;
            } else {
              finalImageSrc = imageSrc.startsWith('/') ? imageSrc : `/${imageSrc}`;
            }
            
            return (
              <div key={index} className="my-6 flex justify-center">
                <img
                  src={finalImageSrc}
                  alt={altText}
                  className="max-w-sm w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            );
          }
        } else {
          // Handle markdown links
          const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
          const parts = line.split(linkRegex);
          return (
            <p key={index} className="text-gray-700 text-base mb-3">
              {parts.map((part, partIndex) => {
                if (partIndex % 3 === 1) {
                  // This is link text
                  return (
                    <a
                      key={partIndex}
                      href={parts[partIndex + 1]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      {part}
                    </a>
                  );
                } else if (partIndex % 3 === 2) {
                  // This is the URL, skip it as it's already used
                  return null;
                }
                // Regular text
                return part;
              })}
            </p>
          );
        }
      } else if (line.trim() === "") {
        return <br key={index} />;
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
      <motion.div
        className="h-[80vh] w-full relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {blog.coverImage ? (
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-purple-700"></div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-white text-4xl md:text-5xl font-bold mb-4">
              {blog.title}
            </h1>
            {blog.subtitle && (
              <p className="text-gray-200 text-xl md:text-2xl mb-6">
                {blog.subtitle}
              </p>
            )}
            <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-gray-300">
              <span>By {blog.author?.name || blog.author || 'Admin'}</span>
              <span>•</span>
              <span>{formatDate(blog.createdAt || blog.publishedAt)}</span>
              <span>•</span>
              <span>{blog.views || 0} views</span>
              {blog.category && (
                <>
                  <span>•</span>
                  <span className="bg-blue-600 px-2 py-1 rounded">{blog.category}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        {/* Blog Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <motion.div
            className="flex flex-wrap gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {blog.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </motion.div>
        )}

        {/* Description */}
        <motion.div
          className="prose prose-lg max-w-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="space-y-4 text-gray-700 leading-relaxed">
            {renderDescription(blog.description)}
          </div>
        </motion.div>

        {/* Author Info */}
        {blog.author && (
          <motion.div
            className="border-t pt-8 mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {(blog.author.name || blog.author)?.substring(0, 2).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{blog.author.name || blog.author}</h3>
                {blog.author.role && (
                  <p className="text-sm text-gray-600">{blog.author.role}</p>
                )}
                {blog.author.email && (
                  <p className="text-sm text-gray-500">{blog.author.email}</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BlogDetails;

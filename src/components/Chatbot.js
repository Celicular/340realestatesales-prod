import { useState, useEffect } from "react";
import avatar from "../assets/avatar.jpeg";

const ChatbotButton = () => {
  const [tawkLoaded, setTawkLoaded] = useState(false);

  useEffect(() => {
    // Initialize Tawk.to API
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    // Create and insert the script
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://embed.tawk.to/68d2e18a689fd0192638819f/1j5tg9vn5";
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");

    // Track when script loads
    script.onload = () => {
      setTawkLoaded(true);
    };

    // Insert the script
    const firstScript = document.getElementsByTagName("script")[0];
    firstScript.parentNode.insertBefore(script, firstScript);

    // Cleanup function
    return () => {
      // Remove the script if component unmounts
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const openTawk = () => {
    if (window.Tawk_API && window.Tawk_API.maximize) {
      window.Tawk_API.maximize();
    } else if (window.Tawk_API && window.Tawk_API.toggle) {
      window.Tawk_API.toggle();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={openTawk}
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 bg-white p-1 sm:p-2 rounded-full shadow-lg border border-gray-200 hover:shadow-xl ring-1 ring-blue-500/30 hover:ring-blue-500 transition-all duration-300 group"
        aria-label="Chat with 340RealEstateStJohn"
        title="Chat with 340RealEstateStJohn"
      >
        {/* <img
          src={avatar}
          alt="Chatbot Assistant"
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover group-hover:scale-105 transition-transform duration-300"
        /> */}
      </button>
    </>
  );
};

export default ChatbotButton;

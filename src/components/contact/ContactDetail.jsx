import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { sendContactFormEmail } from '../../services/emailService';
import team from "../../assets/team.jpeg"

const ContactDetail = () => {
  const formRef = useRef();
  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    phone: "",
    homes: false,
    land: false,
    condos: false,
    timeshares: false,
    commercial: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitStatus(null);

    try {
      const result = await sendContactFormEmail(formData);

      if (result.success) {
        setSubmitStatus('success');
        setFormData({
          user_name: "",
          user_email: "",
          phone: "",
          homes: false,
          land: false,
          condos: false,
          timeshares: false,
          commercial: false,
        });
        if (formRef.current) {
          formRef.current.reset();
        }
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error("Contact Form Error:", error);
      setSubmitStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const resetStatus = () => {
    setSubmitStatus(null);
  };

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-light text-gray-800 uppercase tracking-wider mb-4">
            SUBMIT A MESSAGE
          </h1>
          <p className="text-base font-sans text-gray-700 max-w-2xl mx-auto">
            Complete the following information to receive your instant email notices of new St John listings & price reductions.
          </p>
        </div>

        {/* Main Content - Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Image */}
          <div className="order-2 lg:order-1">
            <div className="relative">
              <img
                src={team}
                alt="Five women on a beach"
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="order-1 lg:order-2">
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
              {/* Success/Error Messages */}
              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md flex items-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>Message sent successfully! We'll get back to you soon.</span>
                  <button
                    type="button"
                    onClick={resetStatus}
                    className="ml-auto text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </motion.div>
              )}

              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md flex items-center gap-2"
                >
                  <AlertCircle className="w-5 h-5" />
                  <span>Failed to send message. Please try again.</span>
                  <button
                    type="button"
                    onClick={resetStatus}
                    className="ml-auto text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </motion.div>
              )}

              {/* Form Fields */}
              <div className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-sans text-gray-800 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <div className="absolute bottom-0 left-0 w-full h-px bg-gray-300"></div>
                    <input
                      type="text"
                      name="user_name"
                      required
                      value={formData.user_name}
                      onChange={handleChange}
                      className="w-full bg-transparent border-0 border-b border-gray-300 px-0 py-3 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-gray-500 transition-colors"
                      placeholder=""
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-sans text-gray-800 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <div className="absolute bottom-0 left-0 w-full h-px bg-gray-300"></div>
                    <input
                      type="email"
                      name="user_email"
                      required
                      value={formData.user_email}
                      onChange={handleChange}
                      className="w-full bg-transparent border-0 border-b border-gray-300 px-0 py-3 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-gray-500 transition-colors"
                      placeholder=""
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-sans text-gray-800 mb-2">
                    Phone
                  </label>
                  <div className="relative">
                    <div className="absolute bottom-0 left-0 w-full h-px bg-gray-300"></div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-transparent border-0 border-b border-gray-300 px-0 py-3 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-gray-500 transition-colors"
                      placeholder=""
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Checkbox Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-sans text-gray-800 font-medium">
                  Please send me info on:
                </h3>
                
                <div className="space-y-3">
                  {[
                    { name: 'homes', label: 'Homes for Sale' },
                    { name: 'land', label: 'Land for Sale' },
                    { name: 'condos', label: 'Condos for Sale' },
                    { name: 'timeshares', label: 'Timeshares for Sale' },
                    { name: 'commercial', label: 'Commercial Opportunities' }
                  ].map((option) => (
                    <label key={option.name} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name={option.name}
                        checked={formData[option.name]}
                        onChange={handleChange}
                        className="w-4 h-4 text-gray-600 border-gray-300 rounded focus:ring-gray-500"
                        disabled={isLoading}
                      />
                      <span className="text-sm font-sans text-gray-800">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
                className="w-full bg-gray-800 text-white font-sans text-sm py-3 px-6 hover:bg-gray-700 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Submit'
                )}
              </motion.button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactDetail;

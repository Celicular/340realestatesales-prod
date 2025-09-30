import React, { useState, useMemo, useCallback } from "react";
import PropertiesHero from "./../components/properties/PropertiesHero";
import PropertiesForSale from "../components/properties/PropertiesForSale";
import SoldProperty from "../components/soldproperty/SoldProperty";
import LandProperty from "../components/land/LandProperty";
import { Home, MapPin, DollarSign, CheckCircle, Crown, Building, TreePine } from "lucide-react";
import { propertyData } from "../data/SalesData.js";

const Properties = () => {
  const [mainTab, setMainTab] = useState("sale");
  const [subTab, setSubTab] = useState("house");
  const [propertiesToShow, setPropertiesToShow] = useState(2); // Number to slice

  // Memoize property categories to avoid recalculation
  const propertyCategories = useMemo(() => {
    const categories = new Set();
    Object.values(propertyData).forEach(property => {
      if (property.category) {
        categories.add(property.category);
      }
    });
    return Array.from(categories).sort();
  }, []);

  // Memoize filtered properties to avoid recalculation on every render
  const filteredProperties = useMemo(() => {
    if (mainTab === "sale") {
      if (subTab) {
        // Filter by specific category if sub-tab is selected
        return Object.entries(propertyData)
          .filter(([key, property]) => property.category === subTab)
          .map(([id, property]) => ({
            id,
            title: property.title,
            price: property.price,
            images: property.images,
            description: property.description || property.fullDescription,
            features: {
              totalBeds: property.features?.beds,
              totalBaths: property.features?.baths,
              pool: property.features?.pool,
              type: property.features?.type,
              properties: 1,
            },
            propertyDetails: property.propertyDetails,
          }));
      } else {
        // Show limited properties when no sub-tab is selected
        return Object.entries(propertyData)
          .slice(0, propertiesToShow)
          .map(([id, property]) => ({
            id,
            title: property.title,
            price: property.price,
            images: property.images,
            description: property.description || property.fullDescription,
            features: {
              totalBeds: property.features?.beds,
              totalBaths: property.features?.baths,
              pool: property.features?.pool,
              type: property.features?.type,
              properties: 1,
            },
            propertyDetails: property.propertyDetails,
          }));
      }
    }
    return [];
  }, [mainTab, subTab, propertiesToShow]);

  const renderContent = () => {
    if (mainTab === "sale") {
      return <PropertiesForSale 
        selectedCategory={subTab} 
        propertiesToShow={propertiesToShow}
        filteredProperties={filteredProperties}
      />;
    }
    if (mainTab === "sold") {
      return <SoldProperty />;
    }
  };

    // Memoize main tabs
  const mainTabs = useMemo(() => [
    {
      id: "sale",
      label: "FOR SALE",
      icon: DollarSign,
    },
    {
      id: "sold",
      label: "RECENT SALES",
      icon: CheckCircle,
    },
  ], []);

  // Memoize sub tabs
  const subTabs = useMemo(() => {
    if (mainTab === "sale") {
      return propertyCategories.map(category => ({
        id: category,
        label: category.charAt(0).toUpperCase() + category.slice(1),
        icon: category === "villa" ? Building : 
              category === "combo" ? Crown : 
              category === "cottage" ? Home : 
              category === "house" ? Building : 
              category === "condo" ? Building : TreePine,
      }));
    }
    return [];
  }, [mainTab, propertyCategories]);

  // Memoize sub tab click handler
  const handleSubTabClick = useCallback((tabId) => {
    setSubTab(tabId);
    setPropertiesToShow(2); // Reset to 2 when switching tabs
  }, []);

  return (
    <div className="App relative scroll-smooth">
      {/* Hero Section */}
      <PropertiesHero />

      {/* Professional Tab Container */}
      <div className="relative bg-gradient-to-b from-white via-slate-50/30 to-white">
        <div className="container mx-auto px-4 py-8">
       

                     {/* Main Tabs - 50-50 Screen Width with Individual Centering */}
           <div className="flex mb-8 relative">
             <div className="w-1/2 flex justify-center">
               <button
                                   onClick={useCallback(() => {
                    setMainTab("sale");
                    setSubTab(""); // Don't set any sub-tab initially
                    setPropertiesToShow(2); // Reset to 2 when clicking FOR SALE
                  }, [])}
                 className={`relative flex items-center justify-center gap-3 px-8 py-6 text-lg font-semibold transition-all duration-300 ${
                   mainTab === "sale"
                     ? "text-slate-800 border-b-2 border-slate-800"
                     : "text-slate-500 hover:text-slate-700 hover:border-b-2 hover:border-slate-300"
                 }`}
               >
                 <DollarSign className="w-6 h-6" />
                 FOR SALE
               </button>
             </div>
             {/* Vertical Border in Middle */}
             <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-slate-300 to-transparent shadow-sm"></div>
             <div className="w-1/2 flex justify-center">
               <button
                 onClick={useCallback(() => {
                   setMainTab("sold");
                   setSubTab(""); // No sub-tab needed for sold
                 }, [])}
                 className={`relative flex items-center justify-center gap-3 px-8 py-6 text-lg font-semibold transition-all duration-300 ${
                   mainTab === "sold"
                     ? "text-slate-800 border-b-2 border-slate-800"
                     : "text-slate-500 hover:text-slate-700 hover:border-b-2 hover:border-slate-300"
                 }`}
               >
                 <CheckCircle className="w-6 h-6" />
                 RECENT SALES
               </button>
             </div>
           </div>

          {/* Top Border */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent shadow-sm mb-8"></div>

                     {/* Sub Header */}
           {/* <div className="text-center mb-6">
             <h2 className="text-2xl md:text-3xl font-semibold text-slate-700 mb-2">
               {mainTab === "sale"
                 ? "Available for Sale"
                 : "Recent Sale Records"}
             </h2>
             <p className="text-slate-500 text-base">
               {mainTab === "sale"
                 ? "Browse properties and land currently available for purchase"
                 : "View records of recently sold properties and land"}
             </p>
           </div> */}

          {/* Sub Tabs - Only show for "For Sale" tab */}
          {mainTab === "sale" && subTabs.length > 0 && (
            <>
                             {/* Sub Tabs - 50-50 Screen Width with Individual Centering */}
               <div className="flex mb-10 relative">
                 {subTabs.map((tab, index) => (
                   <div key={tab.id} className="w-1/2 flex justify-center">
                     {index > 0 && (
                       <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-slate-300 to-transparent shadow-sm"></div>
                     )}
                     <button
                       onClick={() => handleSubTabClick(tab.id)}
                       className={`relative flex items-center justify-center gap-2.5 px-6 py-4 text-base font-medium transition-all duration-300 ${
                         subTab === tab.id
                           ? "text-slate-800 border-b-2 border-slate-800"
                           : "text-slate-500 hover:text-slate-700 hover:border-b-2 hover:border-slate-300"
                       }`}
                     >
                       <tab.icon className="w-5 h-5" />
                       {tab.label}
                     </button>
                   </div>
                 ))}
               </div>

              {/* Middle Border */}
              <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent shadow-sm mb-8"></div>
            </>
          )}

          {/* Middle Border - Divided into Two */}
          <div className="flex mb-8">
            <div className="w-1/2 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent shadow-sm"></div>
            <div className="w-1/2 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent shadow-sm"></div>
          </div>

                     {/* Content Area */}
           <div className="relative max-w-7xl mx-auto">
             <div className="bg-white rounded-xl overflow-hidden shadow-lg">
               <div className="p-6">
                 {renderContent()}
               </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// Index exports for easy access
export { Properties };

// Export tab configurations for reuse
export const tabConfig = {
  mainTabs: [
    {
      id: "sale",
      label: "FOR SALE",
      icon: DollarSign,
    },
    {
      id: "sold",
      label: "RECENT SALES",
      icon: CheckCircle,
    },
  ],
  getSubTabs: (mainTab, propertyData) => {
    if (mainTab === "sale") {
      const categories = new Set();
      Object.values(propertyData).forEach(property => {
        if (property.category) {
          categories.add(property.category);
        }
      });
      const propertyCategories = Array.from(categories).sort();
      
             return [
         ...propertyCategories.map(category => ({
           id: category,
           label: category.charAt(0).toUpperCase() + category.slice(1),
           icon: category === "villa" ? Building : 
                 category === "combo" ? Crown : 
                 category === "cottage" ? Home : 
                 category === "house" ? Building : 
                 category === "condo" ? Building : TreePine,
         }))
       ];
    }
    return [];
  },
};

// Export content mapping for reuse
export const contentMapping = {
  sale: {
    villa: "Villa Properties",
    combo: "Combo Properties", 
    cottage: "Cottage Properties",
    house: "House Properties",
    condo: "Condo Properties",
  },
  sold: {
    default: "SoldProperty",
  },
};

// Export default state values
export const defaultStates = {
  mainTab: "sale",
  subTab: "house",
};

export default Properties;

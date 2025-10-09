import React, { useState } from 'react';
import { Database, Play, CheckCircle, AlertCircle } from 'lucide-react';
import { addPortfolioItem } from '../../firebase/firestore';
import { propertyData } from '../../data/SalesData';
import { landProperties } from '../../data/LandSaleData';

const DataSeeder = () => {
  const [seeding, setSeeding] = useState(false);
  const [result, setResult] = useState(null);

  // Helper function to create portfolio item
  const createPortfolioItem = (data, category, subcategory, status) => {
    const baseItem = {
      title: data.title,
      category: category, // 'residential', 'commercial', 'land'
      subcategory: subcategory, // 'villa', 'cottage', 'house', 'combo', 'land'
      status: status, // 'for-sale', 'recent-sale'
      price: data.price,
      location: data.location || {},
      images: data.images || [],
      description: data.description || data.fullDescription || '',
      features: data.features || {},
      amenities: data.amenities || [],
      createdAt: new Date(),
      updatedAt: new Date(),
      source: 'sales-data'
    };

    // Add specific fields based on category
    if (category === 'residential') {
      baseItem.propertyType = subcategory;
      baseItem.showPackageDetails = data.showPackageDetails || false;
      baseItem.propertyDetails = data.propertyDetails || null;
    }

    if (category === 'land') {
      baseItem.overview = data.overview || {};
      baseItem.details = data.details || {};
      baseItem.mls = data.mls || '';
      baseItem.type = data.type || 'Land';
    }

    return baseItem;
  };

  const handleSeedPortfolios = async () => {
    setSeeding(true);
    setResult(null);
    
    try {
      let successCount = 0;
      let errorCount = 0;
      const errors = [];

      // Seed residential portfolio
      console.log('🏠 Seeding Residential Portfolio...');
      const residentialProperties = Object.values(propertyData);
      
      for (const property of residentialProperties) {
        try {
          // Determine subcategory based on property data
          let subcategory = property.category || 'house';
          if (subcategory === 'Villa') subcategory = 'villa';
          
          const portfolioItem = createPortfolioItem(
            property, 
            'residential', 
            subcategory, 
            'for-sale'
          );
          
          const result = await addPortfolioItem(portfolioItem, 'residential');
          if (result.success) {
            console.log(`✅ Added ${property.title} to residential portfolio`);
            successCount++;
          } else {
            console.error(`❌ Error adding ${property.title}:`, result.error);
            errors.push(`${property.title}: ${result.error}`);
            errorCount++;
          }
        } catch (error) {
          console.error(`❌ Error adding ${property.title}:`, error);
          errors.push(`${property.title}: ${error.message}`);
          errorCount++;
        }
      }

      // Seed land portfolio
      console.log('🏞️ Seeding Land Portfolio...');
      for (const land of landProperties) {
        try {
          const portfolioItem = createPortfolioItem(
            land, 
            'land', 
            'land', 
            'for-sale'
          );
          
          const result = await addPortfolioItem(portfolioItem, 'land');
          if (result.success) {
            console.log(`✅ Added ${land.title} to land portfolio`);
            successCount++;
          } else {
            console.error(`❌ Error adding ${land.title}:`, result.error);
            errors.push(`${land.title}: ${result.error}`);
            errorCount++;
          }
        } catch (error) {
          console.error(`❌ Error adding ${land.title}:`, error);
          errors.push(`${land.title}: ${error.message}`);
          errorCount++;
        }
      }

      // Create some sample recent sales
      console.log('💰 Creating sample recent sales...');
      const sampleSales = [
        {
          title: "Sunset Paradise Villa",
          category: 'residential',
          subcategory: 'villa',
          status: 'recent-sale',
          price: "$1,850,000",
          soldPrice: "$1,825,000",
          soldDate: new Date('2024-09-15'),
          location: {
            address: "Cruz Bay, St. John, VI 00830",
            quarter: "Cruz Bay"
          },
          images: [],
          description: "Beautiful 4-bedroom villa with ocean views recently sold.",
          features: {
            beds: 4,
            baths: 3,
            pool: true,
            sqft: "3,200"
          },
          amenities: ["Ocean Views", "Pool", "Gourmet Kitchen"],
          createdAt: new Date(),
          updatedAt: new Date(),
          source: 'manual'
        },
        {
          title: "Coral Bay Land Parcel",
          category: 'land',
          subcategory: 'land',
          status: 'recent-sale',
          price: "$295,000",
          soldPrice: "$285,000",
          soldDate: new Date('2024-08-20'),
          location: {
            address: "Coral Bay, St. John, VI 00830",
            quarter: "Coral Bay"
          },
          images: [],
          description: "Prime building lot with harbor views recently sold.",
          overview: {
            lotSizeSqFt: 21000,
            lotSizeAcres: 0.48
          },
          createdAt: new Date(),
          updatedAt: new Date(),
          source: 'manual'
        }
      ];

      for (const sale of sampleSales) {
        try {
          const result = await addPortfolioItem(sale, sale.category);
          if (result.success) {
            console.log(`✅ Added recent sale ${sale.title}`);
            successCount++;
          } else {
            console.error(`❌ Error adding recent sale ${sale.title}:`, result.error);
            errors.push(`${sale.title}: ${result.error}`);
            errorCount++;
          }
        } catch (error) {
          console.error(`❌ Error adding recent sale ${sale.title}:`, error);
          errors.push(`${sale.title}: ${error.message}`);
          errorCount++;
        }
      }

      if (errorCount === 0) {
        setResult({ 
          success: true, 
          message: `Successfully seeded ${successCount} portfolio items!` 
        });
      } else {
        setResult({ 
          success: false, 
          error: `Seeded ${successCount} items, but ${errorCount} failed. Errors: ${errors.join(', ')}`
        });
      }
    } catch (error) {
      console.error('💥 Error seeding portfolios:', error);
      setResult({ success: false, error: error.message });
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center space-x-4 mb-6">
        <div className="p-3 bg-blue-50 rounded-lg">
          <Database className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Data Seeder</h3>
          <p className="text-gray-600">Seed portfolio data from SalesData.js</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-yellow-800">Important</h4>
              <p className="text-sm text-yellow-700 mt-1">
                This will populate the portfolio collections with data from your SalesData.js and LandSaleData.js files. 
                Only run this once to avoid duplicates.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleSeedPortfolios}
          disabled={seeding}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
        >
          <Play className="h-4 w-4" />
          <span>{seeding ? 'Seeding...' : 'Seed Portfolio Data'}</span>
        </button>

        {result && (
          <div className={`border rounded-lg p-4 ${
            result.success 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-start space-x-3">
              {result.success ? (
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              )}
              <div>
                <h4 className={`text-sm font-medium ${
                  result.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {result.success ? 'Success' : 'Error'}
                </h4>
                <p className={`text-sm mt-1 ${
                  result.success ? 'text-green-700' : 'text-red-700'
                }`}>
                  {result.success ? result.message : result.error}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataSeeder;
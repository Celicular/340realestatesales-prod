// Script to seed portfolio data from salesData to Firestore
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config.js';
import { propertyData } from '../data/SalesData.js';
import { landProperties } from '../data/LandSaleData.js';

// Portfolio Collections
const RESIDENTIAL_PORTFOLIO = 'residentialPortfolio';
const LAND_PORTFOLIO = 'landPortfolio';

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

// Function to seed residential portfolio
const seedResidentialPortfolio = async () => {
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
      
      const docRef = await addDoc(collection(db, RESIDENTIAL_PORTFOLIO), portfolioItem);
      console.log(`✅ Added ${property.title} to residential portfolio with ID: ${docRef.id}`);
    } catch (error) {
      console.error(`❌ Error adding ${property.title}:`, error);
    }
  }
};

// Function to seed land portfolio
const seedLandPortfolio = async () => {
  console.log('🏞️ Seeding Land Portfolio...');
  
  for (const land of landProperties) {
    try {
      const portfolioItem = createPortfolioItem(
        land, 
        'land', 
        'land', 
        'for-sale'
      );
      
      const docRef = await addDoc(collection(db, LAND_PORTFOLIO), portfolioItem);
      console.log(`✅ Added ${land.title} to land portfolio with ID: ${docRef.id}`);
    } catch (error) {
      console.error(`❌ Error adding ${land.title}:`, error);
    }
  }
};

// Function to create sample recent sales
const seedRecentSales = async () => {
  console.log('💰 Creating sample recent sales...');
  
  // Create some sample recent sales from existing data
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
      images: ["https://example.com/villa1.jpg"],
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
      images: ["https://example.com/land1.jpg"],
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
      const collectionName = sale.category === 'residential' ? RESIDENTIAL_PORTFOLIO : LAND_PORTFOLIO;
      const docRef = await addDoc(collection(db, collectionName), sale);
      console.log(`✅ Added recent sale ${sale.title} with ID: ${docRef.id}`);
    } catch (error) {
      console.error(`❌ Error adding recent sale ${sale.title}:`, error);
    }
  }
};

// Main seeding function
export const seedAllPortfolios = async () => {
  try {
    console.log('🚀 Starting portfolio seeding...');
    
    await seedResidentialPortfolio();
    await seedLandPortfolio();
    await seedRecentSales();
    
    console.log('🎉 Portfolio seeding completed successfully!');
    return { success: true, message: 'All portfolios seeded successfully' };
  } catch (error) {
    console.error('💥 Error seeding portfolios:', error);
    return { success: false, error: error.message };
  }
};

// Browser-compatible - no process.exit in browser environment
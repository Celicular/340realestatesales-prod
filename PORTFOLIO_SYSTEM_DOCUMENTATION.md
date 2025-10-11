# Portfolio Management System Documentation

## Overview

I've successfully created a comprehensive portfolio management system for your 340 Real Estate application with 3 collections in Firestore:

1. **Residential Portfolio** (`residentialPortfolio`)
2. **Commercial Portfolio** (`commercialPortfolio`) 
3. **Land Portfolio** (`landPortfolio`)

## Features Implemented

### 1. Firebase Collections Structure

Each portfolio collection stores items with the following structure:

```javascript
{
  id: "auto-generated",
  title: "Property Title",
  category: "residential" | "commercial" | "land",
  subcategory: "villa" | "cottage" | "house" | "combo" | "office" | "retail" | "land",
  status: "for-sale" | "recent-sale",
  price: "$1,500,000" | "Price on request",
  soldPrice: "$1,450,000", // Only for recent-sale status
  soldDate: Date, // Only for recent-sale status
  location: {
    address: "Street address",
    quarter: "Coral Bay" | "Cruz Bay" | "East End",
    country: "US",
    subdivision: "Optional subdivision name"
  },
  images: ["url1", "url2", ...],
  description: "Property description",
  features: { // For residential/commercial only
    beds: 3,
    baths: 2,
    sqft: "2,500",
    pool: true
  },
  amenities: ["Ocean Views", "Pool", "Gourmet Kitchen"],
  overview: { // For land only
    lotSizeSqFt: 25000,
    lotSizeAcres: 0.57,
    grade: "Moderate"
  },
  details: { // For land only
    zoning: "R-1 Residential",
    access: "paved road"
  },
  mls: "25-80", // For land properties
  type: "Land", // For land properties
  createdAt: Date,
  updatedAt: Date,
  source: "sales-data" | "manual"
}
```

### 2. Portfolio Categories & Subcategories

#### Residential Portfolio
- **Villa**: Luxury villas with pools and ocean views
- **Cottage**: Cozy cottages with tropical settings
- **House**: Traditional houses and family homes
- **Combo**: Package deals with multiple properties

#### Commercial Portfolio  
- **Office**: Commercial office spaces
- **Retail**: Retail and shopping locations
- **Warehouse**: Industrial and warehouse spaces
- **Mixed**: Mixed-use developments

#### Land Portfolio
- **Land**: Raw land parcels
- **Building Lot**: Ready-to-build lots
- **Farm Land**: Agricultural land parcels

### 3. Status Types

- **For Sale**: Currently available properties
- **Recent Sale**: Recently sold properties with sold price and date

### 4. Admin Dashboard Integration

The admin dashboard now includes a **Portfolio Management** tab with:

- **Statistics Dashboard**: Shows total items, for sale count, recent sales, and category breakdowns
- **Advanced Filtering**: Filter by category, status, subcategory, and search functionality
- **CRUD Operations**: Create, Read, Update, Delete portfolio items
- **Data Seeder**: One-click import from existing SalesData.js and LandSaleData.js
- **Image Management**: Add/remove property images via URLs
- **Amenities Management**: Add/remove property amenities dynamically

### 5. Agent Dashboard Integration

Agents can also access portfolio management with the same functionality as admins.

### 6. Data Migration

The system includes automatic data migration from your existing:
- `SalesData.js` → Residential Portfolio
- `LandSaleData.js` → Land Portfolio

## Files Created/Modified

### New Files Created:
1. `src/components/admin/PortfolioManagement.jsx` - Main portfolio management component
2. `src/components/admin/PortfolioItemForm.jsx` - Form for adding/editing portfolio items
3. `src/components/admin/DataSeeder.jsx` - Data seeding component
4. `src/scripts/seedPortfolio.js` - Portfolio seeding script
5. `src/scripts/seedPortfolioNode.js` - Node.js seeding script

### Files Modified:
1. `src/firebase/firestore.js` - Added portfolio CRUD functions
2. `src/components/dashboard/AdminDashboard.jsx` - Added portfolio management tab
3. `src/components/dashboard/AgentDashboard.jsx` - Added portfolio management tab

## New Firestore Functions Added

### Portfolio Management Functions:
- `addPortfolioItem(portfolioData, category)` - Add new portfolio item
- `getPortfolioItems(category, filters)` - Get portfolio items with filtering
- `updatePortfolioItem(category, itemId, updateData)` - Update portfolio item
- `deletePortfolioItem(category, itemId)` - Delete portfolio item
- `getAllPortfolioItems(filters)` - Get all portfolio items across categories

## How to Use

### 1. Access Portfolio Management
- **Admin**: Login → Admin Dashboard → Portfolio Management tab
- **Agent**: Login → Agent Dashboard → Portfolio Management tab

### 2. Seed Initial Data
1. Go to Portfolio Management
2. Find the "Data Seeder" section
3. Click "Seed Portfolio Data" to import from SalesData.js and LandSaleData.js
4. This will populate your collections with existing property data

### 3. Add New Portfolio Items
1. Click "Add Portfolio Item" button
2. Fill out the comprehensive form:
   - Basic info (title, price, category, status)
   - Location details
   - Property features (beds, baths, etc.)
   - Images (via URLs)
   - Amenities
   - Description
3. Submit to add to Firestore

### 4. Manage Existing Items
- **Filter**: Use the filter bar to find specific properties
- **Search**: Search by title, location, or description
- **Edit**: Click "Edit" on any property card
- **Delete**: Click "Delete" to remove (with confirmation)

### 5. View Statistics
The dashboard shows real-time statistics:
- Total portfolio items
- Items for sale vs recent sales
- Breakdown by category (residential, commercial, land)

## Database Structure

### Firestore Collections:
- `residentialPortfolio/` - All residential properties
- `commercialPortfolio/` - All commercial properties  
- `landPortfolio/` - All land parcels

### Sample Query Examples:
```javascript
// Get all residential properties for sale
const forSaleHomes = await getPortfolioItems('residential', { status: 'for-sale' });

// Get all recent land sales
const recentLandSales = await getPortfolioItems('land', { status: 'recent-sale' });

// Get all villas
const villas = await getPortfolioItems('residential', { subcategory: 'villa' });
```

## Benefits

1. **Organized Data**: Clean separation of property types
2. **Scalable**: Easy to add new categories and properties
3. **User-Friendly**: Intuitive admin interface
4. **Flexible Filtering**: Multiple filter options for finding properties
5. **Data Migration**: Seamlessly import existing data
6. **Dual Status Tracking**: Manage both active listings and sales history
7. **Rich Property Details**: Support for images, amenities, and detailed descriptions

## Next Steps

1. **Test the System**: Access the admin dashboard and try the portfolio management
2. **Seed Data**: Use the data seeder to import your existing property data
3. **Add New Properties**: Test adding new properties manually
4. **Custom Fields**: Extend the schema if you need additional property fields
5. **Frontend Display**: Create public-facing pages to display the portfolio data

The system is now ready for use and provides a comprehensive solution for managing your real estate portfolios with separate collections for different property types while maintaining the distinction between current listings and recent sales.
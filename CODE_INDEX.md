# 340 Real Estate St. John - Complete Code Index

## 📋 Project Overview
**Project Name:** 340 Real Estate  
**Type:** React-based Real Estate Website  
**Location:** St. John, USVI  
**Tech Stack:** React 19, Firebase, Redux Toolkit, Tailwind CSS, React Router v7

---

## 🏗️ Project Structure

### 📁 Root Directory
```
340realestatestjohn/
├── build/                    # Production build output
├── public/                   # Static assets
├── src/                      # Source code
├── node_modules/             # Dependencies
├── package.json              # Project configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── postcss.config.js         # PostCSS configuration
├── vercel.json              # Vercel deployment config
└── README.md                # Project documentation
```

---

## 🎯 Core Application Files

### 📄 Main Entry Points
- **`src/index.js`** - Application entry point with React 19, Redux store, and Google Analytics
- **`src/App.js`** - Main application component with routing and lazy loading
- **`src/App.css`** - Global application styles
- **`src/index.css`** - Base CSS styles

### 🔧 Configuration Files
- **`package.json`** - Dependencies and scripts
- **`tailwind.config.js`** - Tailwind CSS configuration
- **`postcss.config.js`** - PostCSS configuration
- **`vercel.json`** - Vercel deployment settings

---

## 🧩 Components Directory (`src/components/`)

### 🏠 Layout Components
- **`Layout/Header.js`** - Main navigation header
- **`Layout/Footer.js`** - Site footer
- **`ScrollToTop.jsx`** - Scroll to top functionality

### 🏡 Home Page Components (`home/`)
- **`Hero/HeroSection.js`** - Main hero section
- **`Hero/SearchForm.js`** - Property search form
- **`Sections/AboutSection.js`** - About section
- **`Sections/AgentsSection.js`** - Agents showcase
- **`Sections/AnniverserySection.js`** - Anniversary celebration
- **`Sections/ContactSection.js`** - Contact information
- **`Sections/GallerySection.js`** - Image gallery
- **`Sections/HeroLogos.js`** - Partner logos
- **`Sections/RentalsSection.js`** - Villa rentals
- **`Sections/TeamSection.js`** - Team members

### 🏘️ About Page Components (`about/`)
- **`AboutHero.jsx`** - About page hero
- **`CondosInfoGrid.jsx`** - Condo information grid
- **`LandSubdivisions.jsx`** - Land subdivision details
- **`OwnershipSection.jsx`** - Property ownership info
- **`StJohnMap.jsx`** - Interactive St. John map

### 🏢 About Us Components (`aboutus/`)
- **`AboutUsHero.jsx`** - About us hero section

### 👥 Team Components (`aboutstjohnteam.jsx/`)
- **`AboutStJohnTeam.jsx`** - Team information

### 🔐 Authentication Components (`auth/`)
- **`ProtectedRoute.jsx`** - Route protection for authenticated users

### 📝 Blog Components (`blog/`)
- **`BlogList.jsx`** - Blog listing page

### 📞 Contact Components (`contact/`)
- **`ContactDetail.jsx`** - Contact details
- **`ContactHero.jsx`** - Contact page hero

### 🎯 Incentive Components (`incentive/`)
- **`ConnectWithUs.jsx`** - Connect with us section
- **`EDCIncentives.jsx`** - EDC incentives information
- **`InsentiveHero.jsx`** - Incentives page hero

### 🏞️ Land Components (`land/`)
- **`LandHero.jsx`** - Land properties hero
- **`LandProperty.jsx`** - Land property listing
- **`LandPropertyDetail.jsx`** - Individual land property details

### 🏞️ Land Sold Components (`landsold/`)
- **`LandSold.jsx`** - Sold land properties listing
- **`LandSoldDetail.jsx`** - Individual sold land property details

### 🔐 Login Components (`login/`)
- **`Login.jsx`** - User login form
- **`Register.jsx`** - User registration form

### 🏠 Property Components (`properties/`)
- **`PropertiesForSale.jsx`** - Properties for sale listing
- **`PropertiesHero.jsx`** - Properties page hero
- **`PropertyDetail.jsx`** - Individual property details

### 📊 Sales History Components (`saleshistory/`)
- **`SalesHistioryHero.jsx`** - Sales history hero
- **`TabHistory.jsx`** - Tabbed interface for sales history
- **`tab/AboutStJohnTab.jsx`** - About St. John tab
- **`tab/HomeTab.jsx`** - Home tab
- **`tab/SalesHistoryTab.jsx`** - Sales history tab
- **`tab/SearchMLS.jsx`** - MLS search tab
- **`tab/TestimonialsTab.jsx`** - Testimonials tab
- **`tab/VillaRentalsTab.jsx`** - Villa rentals tab

### 🏠 Sold Property Components (`soldproperty/`)
- **`SoldProperty.jsx`** - Sold properties listing
- **`SoldPropertyDetail.jsx`** - Individual sold property details

### 💬 Testimonial Components (`testimonials/`)
- **`ElfsightReviews.jsx`** - External reviews integration
- **`ReviewsSection.jsx`** - Reviews section
- **`TestimonialHero.jsx`** - Testimonials page hero
- **`index.js`** - Testimonials module exports

### 🏢 Admin Components (`admin/`)
- **`AgentApproval.jsx`** - Agent approval management
- **`RentalApproval.jsx`** - Rental approval management
- **`SaleApproval.jsx`** - Sale approval management
- **`SoldApproval.jsx`** - Sold property approval management

### 📊 Dashboard Components (`dashboard/`)
- **`AdminDashboard.jsx`** - Admin dashboard
- **`AgentDashboard.jsx`** - Agent dashboard

### 📝 Form Components (`forms/`)
- **`LandSale.jsx`** - Land sale form
- **`LandSold.jsx`** - Land sold form
- **`PropertySale.jsx`** - Property sale form
- **`PropertySold.jsx`** - Property sold form
- **`RentalForm.jsx`** - Rental property form

### 🔍 MLS Components (`mls/`)
- **`SearchMlsMain.jsx`** - Main MLS search interface

### 🏦 Mortgage Components (`mortage/`)
- **`MortgageCalculator.jsx`** - Mortgage calculator

### 🎬 Attraction Components (`attraction/`)
- **`DualVideoPlayer.jsx`** - Dual video player for attractions

### 🐛 Debug Components (`debug/`)
- **`RegistrationTest.jsx`** - Registration testing component

### 🤖 Utility Components
- **`AnalyticsTracker.jsx`** - Google Analytics tracking
- **`Chatbot.js`** - Chatbot integration

---

## 📄 Pages Directory (`src/pages/`)

### 🏠 Main Pages
- **`Home.jsx`** - Homepage
- **`About.jsx`** - About page
- **`AboutUs.jsx`** - About us page
- **`AboutRealEstate.jsx`** - About 340 Real Estate team
- **`Contactus.jsx`** - Contact page
- **`Testimonial.jsx`** - Testimonials page

### 🏡 Property Pages
- **`Properties.jsx`** - Properties listing
- **`PropertyDetail.jsx`** - Individual property details
- **`VillaDetail.jsx`** - Villa rental details
- **`RentalDetail.jsx`** - Rental property details
- **`LandProperties.jsx`** - Land properties listing

### 📊 Data Pages
- **`SalesHistory.jsx`** - Sales history and analytics
- **`Mls.jsx`** - MLS search page

### 👥 Agent Pages
- **`AgentDetail.jsx`** - Individual agent details

### 📝 Content Pages
- **`BlogDetails.jsx`** - Individual blog post
- **`Attraction.jsx`** - Local attractions
- **`Insentive.jsx`** - Incentives and programs

### 📋 Legal Pages
- **`TermsOfUse.jsx`** - Terms of use
- **`PrivacyPolicy.jsx`** - Privacy policy

---

## 🔥 Firebase Integration (`src/firebase/`)

### 🔧 Configuration
- **`config.js`** - Firebase configuration with environment variables
- **`index.js`** - Firebase module exports
- **`README.md`** - Firebase setup documentation

### 🔐 Authentication
- **`auth.js`** - Authentication utilities and functions

### 🗄️ Database
- **`firestore.js`** - Firestore database operations

### 📁 Storage
- **`storage.js`** - Firebase Storage operations

---

## 🗃️ Data Directory (`src/data/`)

### 📊 Static Data Files
- **`Blogs.js`** - Blog posts data
- **`LandSaleData.js`** - Land sale properties data
- **`landSoldData.js`** - Sold land properties data
- **`SalesData.js`** - Sales history data
- **`SoldPropertydata.js`** - Sold properties data
- **`Villas.js`** - Villa rental data

---

## 🔧 Redux State Management (`src/redux/`)

### 🏪 Store Configuration
- **`store.js`** - Redux store configuration with villa and blog reducers

### 📦 Slices (`slices/`)
- **`villaSlice.js`** - Villa state management
- **`blogslice.js`** - Blog state management

---

## 🛠️ Utilities (`src/utils/`)

### 🔐 Authentication Utilities
- **`auth.js`** - Authentication helper functions

### 🐛 Debug Utilities
- **`debugAuth.js`** - Authentication debugging
- **`debugFirebase.js`** - Firebase debugging

---

## 📁 Public Assets (`public/`)

### 🖼️ Images
- **`images/`** - Static images (hero images, logos)
- **`icon/`** - Icons and favicons
- **`avatar.jpeg`** - Default avatar image

### 📄 Static Files
- **`index.html`** - Main HTML template
- **`manifest.json`** - PWA manifest
- **`robots.txt`** - SEO robots file
- **`favicon.ico`** - Site favicon

---

## 🎨 Assets Directory (`src/assets/`)

### 🖼️ Image Assets
- **`abouthero.jpg`** - About page hero image
- **`contacthero.jpg`** - Contact page hero image
- **`galleryhero.jpg`** - Gallery hero image
- **`logo.png`** - Main logo
- **`avatar.jpeg`** - Default avatar

### 👥 Agent Photos (`agent/`)
- **`adronis/`** - Adronis agent photos (5 images)
- **`Jenn/`** - Jenn agent photos (5 images)
- **`tammy/`** - Tammy agent photos (6 images)
- **`tina/`** - Tina agent photos (10 images)

### 📰 Article Images (`articles/`)
- 30+ article and blog post images covering:
  - Home buying tips
  - Property management
  - Local events
  - Mortgage information
  - Real estate guides

### 🖼️ Gallery Images (`gallery/`)
- **`about1-4.JPG`** - About section images
- **`attraction1-4.jpg`** - Local attraction images
- **`mls1-5.jpg`** - MLS interface images
- **`saleshistory1-4.jpg`** - Sales history images

### 🏠 Hero Images
- **`herosale/`** - Sale property hero images (12 webp files)
- **`homehero/`** - Homepage hero images (4 jpeg/jpg files)

### 🏢 Villa Images (`villa/`)
- 329+ villa rental images (205 jpg, 60 webp, 46 jpeg files)

### 🎬 Video Assets (`video/`)
- **`Untitled-design-4.mp4`** - Design video
- **`videos.mp4`** - General videos

### 🏷️ Tab Icons (`tab/`)
- Various tab icons for navigation (PNG files)

### 💬 Testimonial Images (`testimonials/`)
- **`testi1-3.jpg`** - Customer testimonial photos

---

## 🚀 Key Features

### 🏠 Real Estate Features
- Property listings (sale, rental, land)
- MLS integration
- Sales history tracking
- Agent profiles
- Villa rental management

### 🔐 User Management
- User authentication (Firebase Auth)
- Role-based access (Admin, Agent, User)
- Protected routes
- User registration/login

### 📊 Analytics & Tracking
- Google Analytics 4 integration
- Page view tracking
- User behavior analytics

### 🎨 UI/UX Features
- Responsive design (Tailwind CSS)
- Lazy loading for performance
- Smooth scrolling
- Interactive maps
- Image galleries
- Video players

### 🤖 Interactive Features
- Chatbot integration
- Contact forms
- Property search
- Mortgage calculator
- Date pickers

---

## 📦 Dependencies

### 🎯 Core Dependencies
- **React 19.1.1** - UI framework
- **React Router DOM 7.8.1** - Client-side routing
- **Redux Toolkit 2.8.2** - State management
- **Firebase 12.1.0** - Backend services

### 🎨 UI & Styling
- **Tailwind CSS 4.1.12** - Utility-first CSS
- **Framer Motion 12.23.12** - Animation library
- **Lucide React 0.540.0** - Icon library
- **React Icons 5.5.0** - Icon components

### 📊 Data Visualization
- **Chart.js 4.5.0** - Charting library
- **React Chart.js 2 5.3.0** - React Chart.js wrapper
- **Recharts 3.1.2** - Composable charting library

### 🛠️ Development Tools
- **React Scripts 5.0.1** - Build tools
- **PostCSS 8.5.6** - CSS processing
- **Autoprefixer 10.4.21** - CSS vendor prefixes

### 📧 Communication
- **EmailJS 4.4.1** - Email service integration

### 🔒 Security
- **Crypto-JS 4.2.0** - Cryptographic functions

### 📅 Date Handling
- **React Date Range 2.0.1** - Date range picker
- **React Datepicker 8.7.0** - Date picker component

### 🎮 3D Graphics
- **Three.js 0.179.1** - 3D graphics library
- **React Three Fiber 9.3.0** - React Three.js renderer
- **React Three Drei 10.7.3** - Useful helpers for R3F

---

## 🌐 Environment Configuration

### 🔧 Required Environment Variables
- `REACT_APP_FIREBASE_API_KEY`
- `REACT_APP_FIREBASE_AUTH_DOMAIN`
- `REACT_APP_FIREBASE_PROJECT_ID`
- `REACT_APP_FIREBASE_STORAGE_BUCKET`
- `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
- `REACT_APP_FIREBASE_APP_ID`
- `REACT_APP_FIREBASE_MEASUREMENT_ID`

### 📊 Analytics
- Google Analytics 4 tracking ID: `G-XRKGZZK5YK`

---

## 🚀 Deployment

### ☁️ Vercel Configuration
- **`vercel.json`** - Vercel deployment settings
- Production build with `CI=false` flag

### 📦 Build Process
- **Development:** `npm start`
- **Production:** `npm run build`
- **Testing:** `npm test`

---

## 📝 Notes

### 🎯 Project Focus
This is a comprehensive real estate website for St. John, USVI, featuring:
- Property listings and management
- Agent profiles and dashboards
- Sales history and analytics
- Villa rental management
- User authentication and role-based access
- MLS integration
- Interactive maps and galleries

### 🔧 Technical Highlights
- Modern React 19 with hooks and functional components
- Firebase backend integration
- Redux Toolkit for state management
- Tailwind CSS for styling
- Lazy loading for performance optimization
- Comprehensive image and video asset management
- Mobile-responsive design

### 📊 Data Management
- Static data files for initial content
- Firebase Firestore for dynamic content
- Redux for client-side state management
- Local storage for user preferences

---

*Last Updated: $(date)*
*Total Files Indexed: 200+*
*Lines of Code: 10,000+*


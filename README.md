# 🏠 340 Real Estate - St. John, USVI

A comprehensives real estate website for 340 Real Estate Company, specializing in properties on St. John, US Virgin Islands. Built with React, Firebase, and modern web technologies.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation & Setup](#-installation--setup)
- [Firebase Configuration](#-firebase-configuration)
- [Components Overview](#-components-overview)
- [Pages Overview](#-pages-overview)
- [Data Management](#-data-management)
- [Authentication & Authorization](#-authentication--authorization)
- [Real-time Features](#-real-time-features)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

## ✨ Features

### 🏘️ Property Management
- **Property Listings**: Display properties for sale, rent, and sold properties
- **Property Details**: Comprehensive property pages with images, descriptions, and contact forms
- **Property Search**: Advanced MLS search functionality
- **Property Types**: Villas, condos, land, and residential properties
- **Image Galleries**: High-quality property image galleries with navigation

### 👥 User Management
- **User Registration/Login**: Secure authentication with Firebase Auth
- **Role-based Access**: Admin, Agent, and User roles
- **User Profiles**: Detailed user profiles and preferences
- **Protected Routes**: Secure access to dashboard and admin features

### 📊 Admin Dashboard
- **Property Approval System**: Review and approve/reject property submissions
- **User Management**: Manage users and their roles
- **Analytics**: Sales history and property statistics
- **Content Management**: Manage blogs, testimonials, and site content

### 🏢 Agent Dashboard
- **Property Submission**: Submit new properties for approval
- **Property Management**: Edit and manage submitted properties
- **Sales Tracking**: Track property sales and performance
- **Client Management**: Manage client relationships

### 💬 Interactive Features
- **Live Chatbot**: AI-powered customer support
- **Review System**: User testimonials with real-time updates
- **Contact Forms**: Multiple contact forms for different purposes
- **Newsletter**: Email subscription functionality

### 📱 Modern UI/UX
- **Responsive Design**: Mobile-first responsive design
- **Animations**: Smooth animations with Framer Motion
- **Modern Styling**: Tailwind CSS for consistent design
- **Accessibility**: WCAG compliant design

## 🛠️ Tech Stack

### Frontend
- **React 19.1.0**: Modern React with hooks and functional components
- **React Router DOM 7.6.3**: Client-side routing
- **Redux Toolkit 2.8.2**: State management
- **Framer Motion 12.23.5**: Animation library
- **Tailwind CSS 3.4.1**: Utility-first CSS framework
- **React Icons 5.5.0**: Icon library

### Backend & Database
- **Firebase 12.1.0**: Backend-as-a-Service
  - **Firestore**: NoSQL database
  - **Authentication**: User management
  - **Storage**: File and image storage
  - **Hosting**: Web hosting

### Additional Libraries
- **Chart.js 4.5.0**: Data visualization
- **React Chart.js 2 5.3.0**: React wrapper for Chart.js
- **React Date Picker 8.4.0**: Date selection components
- **EmailJS 4.4.1**: Email functionality
- **Three.js 0.178.0**: 3D graphics (for future features)

## 📁 Project Structure

```
340realestatestjohn/
├── public/                          # Static assets
│   ├── images/                      # Property and site images
│   ├── avatar.jpeg                  # Default user avatar
│   └── index.html                   # Main HTML file
├── src/
│   ├── components/                  # Reusable components
│   │   ├── Layout/                  # Header, Footer, Navigation
│   │   ├── home/                    # Homepage components
│   │   ├── properties/              # Property-related components
│   │   ├── forms/                   # Form components
│   │   ├── dashboard/               # Admin/Agent dashboards
│   │   ├── auth/                    # Authentication components
│   │   ├── testimonials/            # Review system
│   │   ├── blog/                    # Blog components
│   │   └── Chatbot.js               # AI chatbot
│   ├── pages/                       # Page components
│   │   ├── Home.jsx                 # Homepage
│   │   ├── About.jsx                # About pages
│   │   ├── Properties.jsx           # Property listings
│   │   ├── VillaDetail.jsx          # Villa detail pages
│   │   ├── AgentDetail.jsx          # Agent profiles
│   │   └── ...                      # Other pages
│   ├── data/                        # Static data files
│   │   ├── Villas.js                # Villa data
│   │   ├── SalesData.js             # Sales history data
│   │   ├── Blogs.js                 # Blog content
│   │   └── ...                      # Other data files
│   ├── firebase/                    # Firebase configuration
│   │   ├── config.js                # Firebase setup
│   │   ├── firestore.js             # Database operations
│   │   ├── auth.js                  # Authentication
│   │   └── storage.js               # File storage
│   ├── redux/                       # State management
│   │   ├── store.js                 # Redux store
│   │   └── slices/                  # Redux slices
│   ├── utils/                       # Utility functions
│   ├── App.js                       # Main app component
│   └── index.js                     # App entry point
├── package.json                     # Dependencies and scripts
├── tailwind.config.js              # Tailwind configuration
└── README.md                       # This file
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase account

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd 340realestatestjohn
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a Firebase project
   - Enable Authentication, Firestore, and Storage
   - Copy `env.example` to `.env` and add your Firebase credentials
   - See `src/firebase/README.md` for detailed setup instructions

4. **Start development server**
   ```bash
   npm start
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🔥 Firebase Configuration

### Environment Variables Setup

1. **Create Environment File**
   ```bash
   cp env.example .env
   ```

2. **Add Firebase Credentials**
   - Get your Firebase config from Firebase Console
   - Update the `.env` file with your credentials
   - See `src/firebase/README.md` for detailed instructions

### Required Firebase Services

1. **Authentication**
   - Email/Password authentication
   - Google authentication (optional)
   - User role management

2. **Firestore Database**
   - Collections: `users`, `properties`, `reviews`, `blogs`, `contacts`
   - Security rules for data protection

3. **Storage**
   - Property images
   - User avatars
   - Document storage

### Firebase Collections Structure

```javascript
// Users Collection
users: {
  uid: {
    email: string,
    name: string,
    role: 'admin' | 'agent' | 'user',
    createdAt: timestamp,
    updatedAt: timestamp
  }
}

// Properties Collection
properties: {
  propertyId: {
    title: string,
    description: string,
    price: number,
    type: 'sale' | 'rent' | 'sold',
    status: 'pending' | 'approved' | 'rejected',
    images: string[],
    location: string,
    agentInfo: {
      email: string,
      name: string,
      role: string
    },
    createdAt: timestamp,
    updatedAt: timestamp
  }
}

// Reviews Collection
reviews: {
  reviewId: {
    title: string,
    body: string,
    name: string,
    rating: number,
    status: 'approved' | 'pending',
    createdAt: timestamp
  }
}
```

## 🧩 Components Overview

### Layout Components
- **Header.js**: Main navigation with responsive menu
- **Footer.js**: Site footer with links and contact info
- **ScrollToTop.jsx**: Auto-scroll to top on route change

### Property Components
- **PropertiesForSale.jsx**: Property listing grid
- **PropertyDetail.jsx**: Detailed property view
- **VillaDetail.jsx**: Villa-specific detail page
- **LandProperty.jsx**: Land property components

### Form Components
- **PropertySale.jsx**: Property sale submission form
- **RentalForm.jsx**: Rental property form
- **LandSale.jsx**: Land sale form

### Dashboard Components
- **AdminDashboard.jsx**: Admin management interface
- **AgentDashboard.jsx**: Agent property management
- **AgentApproval.jsx**: Property approval system

### Interactive Components
- **ReviewsSection.jsx**: Testimonial system with real-time updates
- **Chatbot.js**: AI-powered customer support
- **MortgageCalculator.jsx**: Mortgage calculation tool

## 📄 Pages Overview

### Public Pages
- **Home.jsx**: Landing page with hero section and featured properties
- **About.jsx**: Company information and team details
- **Properties.jsx**: Property listings with filters
- **Testimonial.jsx**: Customer reviews and testimonials
- **Contactus.jsx**: Contact information and forms

### Property Pages
- **VillaDetail.jsx**: Detailed villa rental pages
- **PropertyDetail.jsx**: Individual property details
- **LandProperties.jsx**: Land property listings

### Admin/Agent Pages
- **AdminDashboard.jsx**: Admin control panel
- **AgentDashboard.jsx**: Agent management interface
- **Login.jsx**: User authentication
- **Register.jsx**: User registration

## 📊 Data Management

### Static Data Files
- **Villas.js**: Villa rental data (1,379 entries)
- **SalesData.js**: Sales history data (898 entries)
- **Blogs.js**: Blog content (2,499 entries)
- **LandSaleData.js**: Land sale data (858 entries)

### Dynamic Data
- **Firebase Firestore**: Real-time property and user data
- **Firebase Storage**: Image and file storage
- **Redux Store**: Application state management

## 🔐 Authentication & Authorization

### User Roles
1. **Admin**: Full access to all features
   - Property approval/rejection
   - User management
   - Site content management

2. **Agent**: Property management access
   - Submit properties for approval
   - Manage client relationships
   - View sales analytics

3. **User**: Public access
   - View properties
   - Submit reviews
   - Contact forms

### Protected Routes
```javascript
<ProtectedRoute allowedRoles={['admin']}>
  <AdminDashboard />
</ProtectedRoute>
```

## ⚡ Real-time Features

### Live Updates
- **Property Listings**: Real-time property updates
- **Reviews**: Live testimonial submissions
- **Chatbot**: Real-time customer support
- **Notifications**: Instant feedback for form submissions

### Firebase Listeners
```javascript
// Real-time property updates
export const subscribeToProperties = (callback, filters = {}) => {
  return onSnapshot(query, (querySnapshot) => {
    const properties = [];
    querySnapshot.forEach((doc) => {
      properties.push({ id: doc.id, ...doc.data() });
    });
    callback(properties);
  });
};
```

## 🚀 Deployment

### Firebase Hosting
1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize Firebase**
   ```bash
   firebase init hosting
   ```

4. **Build and Deploy**
   ```bash
   npm run build
   firebase deploy
   ```

### Environment Variables
Create `.env` file for production:
```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Application Configuration
REACT_APP_APP_NAME=340 Real Estate
REACT_APP_APP_VERSION=1.0.0
REACT_APP_ENVIRONMENT=production
```

### Production Deployment Checklist
- ✅ **Environment variables** configured in `.env`
- ✅ **Firebase Security Rules** set up for Firestore and Storage
- ✅ **Authentication methods** enabled in Firebase Console
- ✅ **Domain restrictions** configured for production domain
- ✅ **SSL certificate** enabled for HTTPS
- ✅ **Error monitoring** set up (optional)

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Standards
- Use functional components with hooks
- Follow React best practices
- Maintain consistent code formatting
- Add comments for complex logic
- Write meaningful commit messages

### Testing
```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## 📞 Support

For support and questions:
- **Email**: [Contact through website]
- **Phone**: [Business phone]
- **Website**: [Website URL]

## 📄 License

This project is proprietary software for 340 Real Estate Company.

---

**Built with ❤️ for 340 Real Estate Company**

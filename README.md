# 340 Real Estate Sale - St. John, USVI.

A modern, responsive real estate website for 340 Real Estate Company, specializing in luxury properties in St. John, U.S. Virgin Islands.

## 🌴 Overview

340 Real Estate is a premier real estate company serving St. John, USVI with over 40 years of experience. This website showcases luxury properties, provides comprehensive market information, and connects clients with experienced real estate professionals.

## ✨ Features

### 🏠 Property Management
- **Property Listings**: Browse residential, commercial, and land properties
- **Advanced Search**: Filter by price, location, property type, and amenities
- **Property Details**: Comprehensive property information with high-quality images
- **MLS Integration**: Real-time property data from St. John Board of Realtors MLS

### 👥 Team & Agents
- **Agent Profiles**: Detailed profiles for all team members
- **Professional Gallery**: Showcase of agent photos and achievements
- **Contact Integration**: Direct email and phone contact for each agent
- **Experience Showcase**: Years of experience and specialties

### 📊 Market Information
- **Sales History**: 5000+ property sales records since 2009
- **Market Analysis**: Current market trends and property values
- **Area Expertise**: Detailed information about St. John neighborhoods
- **Investment Insights**: Property investment opportunities and analysis

### 🏝️ St. John Information
- **Island Guide**: Comprehensive guide to St. John, USVI
- **Local Attractions**: Beaches, hiking trails, and points of interest
- **Community Information**: Local events, organizations, and lifestyle
- **Relocation Services**: Support for mainland to island transitions

### 📝 Content Management
- **Blog System**: Real estate insights and market updates
- **Testimonials**: Client reviews and success stories
- **News & Updates**: Latest company and market news
- **SEO Optimization**: Search engine optimized content

## 🛠️ Technology Stack

### Frontend
- **React 18**: Modern React with hooks and functional components
- **React Router**: Client-side routing and navigation
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Framer Motion**: Smooth animations and transitions
- **Lucide React**: Beautiful, customizable icons

### Backend & Database
- **Firebase**: Backend-as-a-Service platform
- **Firestore**: NoSQL database for real-time data
- **Firebase Storage**: Image and file storage
- **Firebase Auth**: User authentication and authorization

### Development Tools
- **Vite**: Fast build tool and development server
- **ESLint**: Code linting and quality assurance
- **Prettier**: Code formatting
- **Git**: Version control

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- Firebase project setup

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/340realestate-sale-new.git
   cd 340realestate-sale-new
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Layout/          # Header, Footer, Navigation
│   ├── home/            # Homepage sections
│   ├── forms/           # Form components
│   ├── admin/           # Admin dashboard components
│   └── common/          # Shared components
├── pages/               # Page components
│   ├── Home.jsx         # Homepage
│   ├── Properties.jsx   # Property listings
│   ├── AgentDetail.jsx  # Individual agent pages
│   └── About.jsx        # About page
├── firebase/            # Firebase configuration
│   ├── config.js        # Firebase setup
│   ├── firestore.js     # Database operations
│   └── auth.js          # Authentication
├── assets/              # Static assets
│   ├── images/          # Property and team images
│   ├── agent/           # Agent photos
│   └── articles/        # Blog images
├── data/                # Static data files
├── utils/               # Utility functions
└── services/            # External service integrations
```

## 🎨 Design System

### Typography
- **Primary Font**: Serif fonts for headings and elegant text
- **Secondary Font**: Sans-serif for body text and UI elements
- **Font Weights**: Light (300), Medium (500), Bold (700)

### Color Palette
- **Primary**: Teal (#3c6a72) - Professional and trustworthy
- **Secondary**: Coral (#ff6b6b) - Warm and inviting
- **Accent**: Gold (#f4d03f) - Luxury and premium
- **Neutral**: Gray scale for text and backgrounds

### Components
- **Cards**: Rounded corners with subtle shadows
- **Buttons**: Clean, minimal design with hover effects
- **Forms**: Consistent styling with validation states
- **Navigation**: Responsive with mobile-first approach

## 📱 Responsive Design

The website is fully responsive and optimized for:
- **Desktop**: 1200px and above
- **Tablet**: 768px - 1199px
- **Mobile**: 320px - 767px

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
```

## 🌐 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Configure redirects for SPA routing

### Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Deploy: `firebase deploy`

## 📊 Performance

- **Lighthouse Score**: 95+ across all metrics
- **Core Web Vitals**: Optimized for Google's ranking factors
- **Image Optimization**: WebP format with lazy loading
- **Code Splitting**: Automatic route-based code splitting
- **Caching**: Optimized caching strategies

## 🔒 Security

- **Firebase Security Rules**: Properly configured Firestore rules
- **Input Validation**: Client and server-side validation
- **HTTPS**: SSL/TLS encryption for all communications
- **Environment Variables**: Sensitive data stored securely

## 📈 SEO Features

- **Meta Tags**: Dynamic meta tags for each page
- **Structured Data**: Schema.org markup for real estate
- **Sitemap**: Auto-generated XML sitemap
- **Open Graph**: Social media sharing optimization
- **Local SEO**: St. John, USVI location optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📞 Support

For technical support or questions:
- **Email**: 340realestateco@gmail.com
- **Phone**: +1 340-643-6068
- **Website**: [340realestate.com](https://340realestate.com)

## 📄 License

This project is proprietary software owned by 340 Real Estate Company. All rights reserved.

## 🙏 Acknowledgments

- **Team**: 340 Real Estate Company agents and staff
- **Community**: St. John, USVI community support
- **Technology**: Open source libraries and frameworks
- **Design**: Modern web design principles and best practices

---

**Built with ❤️ for St. John, USVI**

*Experience the beauty of St. John through our comprehensive real estate platform.*

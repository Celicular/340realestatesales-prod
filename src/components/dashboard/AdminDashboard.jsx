import React, { useState, useEffect } from 'react';
import { 
  Home, 
  ShoppingCart, 
  CheckCircle, 
  Clock, 
  LogOut, 
  Shield,
  FileText,
  Calendar,
  Activity,
  TrendingUp
} from 'lucide-react';
// import RentalPropertyApproval from '../admin/RentalPropertyApproval';
import SaleApproval from '../admin/SaleApproval';
import SoldApproval from '../admin/SoldApproval';
import PortfolioManagement from '../admin/PortfolioManagement';
// import SystemStatus from '../admin/SystemStatus';
import BlogManagement from '../blog/BlogManagement';
import BookingManagement from '../admin/BookingManagement';
// import RentalPropertyForm from '../forms/RentalPropertyForm';
import AgentMigrationTool from '../admin/AgentMigrationTool';
import EmailConfiguration from '../admin/EmailConfiguration';
import { logout, getCurrentUser } from '../../utils/auth';
import { getRentalProperties, getSaleProperties, getSoldProperties } from '../../firebase/firestore';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('portfolio-management');
  const [stats, setStats] = useState({
    pendingRentals: 0,
    pendingSales: 0,
    pendingSold: 0,
    totalApproved: 0
  });
  const [loading, setLoading] = useState(true);
  const currentUser = getCurrentUser();

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Fetch statistics for all property types
      const [rentalResult, saleResult, soldResult] = await Promise.all([
        getRentalProperties({ status: 'pending' }),
        getSaleProperties({ status: 'pending' }),
        getSoldProperties({ status: 'pending' })
      ]);

      const pendingRentals = rentalResult.success ? rentalResult.data.length : 0;
      const pendingSales = saleResult.success ? saleResult.data.length : 0;
      const pendingSold = soldResult.success ? soldResult.data.length : 0;

      setStats({
        pendingRentals,
        pendingSales,
        pendingSold,
        totalApproved: pendingRentals + pendingSales + pendingSold
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const tabs = [
    { 
      id: 'portfolio-management', 
      name: 'Portfolio Management', 
      component: PortfolioManagement,
      icon: Home,
      color: 'indigo'
    },
    { 
      id: 'agent-migration', 
      name: 'Agent Management', 
      component: AgentMigrationTool,
      icon: Shield,
      color: 'blue'
    },
    { 
      id: 'email-configuration', 
      name: 'Email Settings', 
      component: EmailConfiguration,
      icon: FileText,
      color: 'purple'
    },
    // { 
    //   id: 'add-rental-property', 
    //   name: 'Add Rental Property', 
    //   component: RentalPropertyForm,
    //   icon: Home,
    //   color: 'green'
    // },
    { 
      id: 'booking-requests', 
      name: 'Booking Requests', 
      component: BookingManagement,
      icon: Calendar,
      color: 'blue'
    },
    { 
      id: 'blog-management', 
      name: 'Blog Management', 
      component: BlogManagement,
      icon: FileText,
      color: 'indigo'
    },
    // { 
    //   id: 'rental-approval', 
    //   name: 'Rental Approval', 
    //   component: RentalPropertyApproval,
    //   icon: Home,
    //   color: 'green',
    //   badge: stats.pendingRentals
    // },
    { 
      id: 'sale-approval', 
      name: 'Sale Approval', 
      component: SaleApproval,
      icon: ShoppingCart,
      color: 'purple',
      badge: stats.pendingSales
    },
    { 
      id: 'sold-approval', 
      name: 'Sold Approval', 
      component: SoldApproval,
      icon: CheckCircle,
      color: 'orange',
      badge: stats.pendingSold
    },

  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  const getActiveColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-600 text-white border-blue-600',
      green: 'bg-green-600 text-white border-green-600',
      purple: 'bg-purple-600 text-white border-purple-600',
      orange: 'bg-orange-600 text-white border-orange-600',
      indigo: 'bg-indigo-600 text-white border-indigo-600'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen pt-24 bg-gradient-to-br from-gray-500 to-gray-100">
      {/* Header */}
      <div className=" shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                  <p className="text-sm text-gray-50">Property Management System</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {currentUser && (
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                    <p className="text-xs text-gray-500">Administrator</p>
                  </div>
                  <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {currentUser.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Rentals</p>
                <p className="text-2xl font-bold text-gray-900">{loading ? '...' : stats.pendingRentals}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Home className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              <span>Awaiting approval</span>
            </div>
          </div> */}

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Sales</p>
                <p className="text-2xl font-bold text-gray-900">{loading ? '...' : stats.pendingSales}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              <span>Awaiting approval</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Sold</p>
                <p className="text-2xl font-bold text-gray-900">{loading ? '...' : stats.pendingSold}</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <CheckCircle className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              <span>Awaiting approval</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Pending</p>
                <p className="text-2xl font-bold text-gray-900">{loading ? '...' : stats.totalApproved}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>All categories</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Enhanced Tabs */}
          <div className="border-b border-gray-200 bg-gray-50">
            <nav className="flex space-x-1 p-4">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                      isActive 
                        ? getActiveColorClasses(tab.color)
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span>{tab.name}</span>
                    {tab.badge && tab.badge > 0 && (
                      <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full ${
                        isActive 
                          ? 'bg-white/20 text-white' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {ActiveComponent && <ActiveComponent />}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            © 2024 340 Real Estate. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Building2, 
  Home, 
  MapPin, 
  Plus, 
  Edit, 
  Trash2, 
  Filter, 
  Search,
  DollarSign,
  Calendar,
  Tag,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import {
  getAllPortfolioItems,
  addPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem
} from '../../firebase/firestore';
import PortfolioItemForm from './PortfolioItemForm';
import DataSeeder from './DataSeeder';

const PortfolioManagement = () => {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    forSale: 0,
    recentSales: 0,
    residential: 0,
    commercial: 0,
    land: 0
  });

  useEffect(() => {
    loadPortfolioItems();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filterItems = useCallback(() => {
    let filtered = [...portfolioItems];

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(item => item.status === selectedStatus);
    }

    // Subcategory filter
    if (selectedSubcategory !== 'all') {
      filtered = filtered.filter(item => item.subcategory === selectedSubcategory);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location?.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  }, [portfolioItems, selectedCategory, selectedStatus, selectedSubcategory, searchTerm]);

  useEffect(() => {
    filterItems();
  }, [filterItems]);

  const loadPortfolioItems = async () => {
    setLoading(true);
    try {
      console.log('🔄 Loading portfolio items from Firestore...');
      const result = await getAllPortfolioItems();
      if (result.success) {
        console.log('✅ Loaded portfolio items:', result.data.length);
        setPortfolioItems(result.data);
        calculateStats(result.data);
      } else {
        console.error('❌ Failed to load portfolio items:', result.error);
        setPortfolioItems([]);
        calculateStats([]);
      }
    } catch (error) {
      console.error('💥 Error loading portfolio items:', error);
      setPortfolioItems([]);
      calculateStats([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (items) => {
    const stats = {
      total: items.length,
      forSale: items.filter(item => item.status === 'for-sale').length,
      recentSales: items.filter(item => item.status === 'recent-sale').length,
      residential: items.filter(item => item.category === 'residential').length,
      commercial: items.filter(item => item.category === 'commercial').length,
      land: items.filter(item => item.category === 'land').length
    };
    setStats(stats);
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDeleteItem = async (item) => {
    if (!window.confirm(`Are you sure you want to delete "${item.title}"?`)) {
      return;
    }

    try {
      const result = await deletePortfolioItem(item.category, item.id);
      if (result.success) {
        await loadPortfolioItems();
      } else {
        alert('Error deleting item: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Error deleting item');
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      let result;
      if (editingItem) {
        result = await updatePortfolioItem(editingItem.category, editingItem.id, formData);
      } else {
        result = await addPortfolioItem(formData, formData.category);
      }

      if (result.success) {
        setShowForm(false);
        setEditingItem(null);
        await loadPortfolioItems();
      } else {
        alert('Error saving item: ' + result.error);
      }
    } catch (error) {
      console.error('Error saving item:', error);
      alert('Error saving item');
    }
  };

  const getSubcategoryOptions = () => {
    const options = new Set();
    portfolioItems.forEach(item => {
      if (item.subcategory && (selectedCategory === 'all' || item.category === selectedCategory)) {
        options.add(item.subcategory);
      }
    });
    return Array.from(options);
  };

  const formatPrice = (price) => {
    if (typeof price === 'string') return price;
    if (typeof price === 'number') return `$${price.toLocaleString()}`;
    return 'Price on request';
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'residential': return <Home className="h-4 w-4" />;
      case 'commercial': return <Building2 className="h-4 w-4" />;
      case 'land': return <MapPin className="h-4 w-4" />;
      default: return <Building2 className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'residential': return 'bg-blue-100 text-blue-800';
      case 'commercial': return 'bg-purple-100 text-purple-800';
      case 'land': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    return status === 'for-sale' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;
  };

  const getStatusColor = (status) => {
    return status === 'for-sale' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800';
  };

  if (showForm) {
    return (
      <PortfolioItemForm
        item={editingItem}
        onSubmit={handleFormSubmit}
        onCancel={() => {
          setShowForm(false);
          setEditingItem(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Portfolio Management</h2>
          <p className="text-gray-600">Manage residential, commercial, and land portfolios</p>
        </div>
        <button
          onClick={handleAddItem}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Portfolio Item</span>
        </button>
      </div>

      {/* Data Seeder */}
      <DataSeeder />

      {/* Data Seeder */}
      <DataSeeder />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Building2 className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">For Sale</p>
              <p className="text-2xl font-bold text-green-600">{stats.forSale}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Recent Sales</p>
              <p className="text-2xl font-bold text-orange-600">{stats.recentSales}</p>
            </div>
            <TrendingDown className="h-8 w-8 text-orange-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Residential</p>
              <p className="text-2xl font-bold text-blue-600">{stats.residential}</p>
            </div>
            <Home className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Commercial</p>
              <p className="text-2xl font-bold text-purple-600">{stats.commercial}</p>
            </div>
            <Building2 className="h-8 w-8 text-purple-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Land</p>
              <p className="text-2xl font-bold text-green-600">{stats.land}</p>
            </div>
            <MapPin className="h-8 w-8 text-green-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-4 mb-4">
          <Filter className="h-5 w-5 text-gray-400" />
          <span className="font-medium text-gray-900">Filters</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="land">Land</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="for-sale">For Sale</option>
            <option value="recent-sale">Recent Sale</option>
          </select>

          {/* Subcategory Filter */}
          <select
            value={selectedSubcategory}
            onChange={(e) => setSelectedSubcategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            {getSubcategoryOptions().map(subcategory => (
              <option key={subcategory} value={subcategory}>
                {subcategory.charAt(0).toUpperCase() + subcategory.slice(1)}
              </option>
            ))}
          </select>

          {/* Clear Filters */}
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedStatus('all');
              setSelectedSubcategory('all');
              setSearchTerm('');
            }}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Portfolio Items */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Portfolio Items ({filteredItems.length})
          </h3>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading portfolio items...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No portfolio items found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {portfolioItems.length === 0 ? 'Get started by adding your first portfolio item.' : 'Try adjusting your filters.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  {/* Image */}
                  <div className="h-48 bg-gray-200 relative overflow-hidden">
                    {item.images && item.images.length > 0 ? (
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Building2 className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    
                    {/* Category Badge */}
                    <div className="absolute top-2 left-2">
                      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                        {getCategoryIcon(item.category)}
                        <span>{item.category}</span>
                      </span>
                    </div>
                    
                    {/* Status Badge */}
                    <div className="absolute top-2 right-2">
                      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {getStatusIcon(item.status)}
                        <span>{item.status === 'for-sale' ? 'For Sale' : 'Recent Sale'}</span>
                      </span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-900 truncate">{item.title}</h4>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-600">{formatPrice(item.price)}</span>
                      </div>
                    </div>
                    
                    {item.location?.address && (
                      <p className="text-sm text-gray-600 mb-2 truncate">{item.location.address}</p>
                    )}
                    
                    <div className="flex items-center space-x-3 text-xs text-gray-500 mb-3">
                      <span className="flex items-center space-x-1">
                        <Tag className="h-3 w-3" />
                        <span>{item.subcategory}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(item.createdAt?.toDate?.() || item.createdAt).toLocaleDateString()}</span>
                      </span>
                    </div>
                    
                    {item.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {item.description.substring(0, 100)}...
                      </p>
                    )}
                    
                    {/* Actions */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditItem(item)}
                        className="flex items-center space-x-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-sm transition-colors"
                      >
                        <Edit className="h-3 w-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item)}
                        className="flex items-center space-x-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded text-sm transition-colors"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioManagement;
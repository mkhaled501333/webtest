import { useState } from 'react';
import { 
  PlusIcon,
  ChartBarIcon,
  CogIcon,
  ShoppingBagIcon,
  StarIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import { Button, Badge, Card, Input } from '../ui';
import type { Product, Brand } from '../../types';

interface VendorDashboardProps {
  brand: Brand;
  products: Product[];
  onAddProduct: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onEditBrand: () => void;
}

const VendorDashboard = ({ 
  brand, 
  products, 
  onAddProduct, 
  onEditProduct, 
  onDeleteProduct,
  onEditBrand 
}: VendorDashboardProps) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'analytics' | 'settings'>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate metrics
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.inStock).length;
  const avgRating = products.length > 0 
    ? products.reduce((sum, p) => sum + p.rating, 0) / products.length 
    : 0;
  const totalReviews = products.reduce((sum, p) => sum + p.reviewCount, 0);
  const totalRevenue = products.reduce((sum, p) => sum + (p.price * Math.floor(Math.random() * 50)), 0);

  // Filter products
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabs = [
    { id: 'overview', name: 'Overview', icon: ChartBarIcon },
    { id: 'products', name: 'Products', icon: ShoppingBagIcon },
    { id: 'analytics', name: 'Analytics', icon: ChartBarIcon },
    { id: 'settings', name: 'Settings', icon: CogIcon }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center gap-4">
              <img
                src={brand.logo}
                alt={`${brand.name} logo`}
                className="w-16 h-16 object-contain bg-gray-50 rounded-lg border border-gray-200 p-2"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{brand.name}</h1>
                <p className="text-gray-600">Vendor Dashboard</p>
              </div>
            </div>
            <Button onClick={onAddProduct} className="flex items-center gap-2">
              <PlusIcon className="w-4 h-4" />
              Add Product
            </Button>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Products</p>
                    <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
                    <p className="text-sm text-green-600">+{activeProducts} active</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <ShoppingBagIcon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Average Rating</p>
                    <div className="flex items-center gap-1">
                      <p className="text-2xl font-bold text-gray-900">{avgRating.toFixed(1)}</p>
                      <StarIcon className="w-5 h-5 text-yellow-400" />
                    </div>
                    <p className="text-sm text-gray-600">{totalReviews} reviews</p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <StarIcon className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
                    <p className="text-sm text-green-600">+12% vs last month</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <ChartBarIcon className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Store Views</p>
                    <p className="text-2xl font-bold text-gray-900">{(Math.random() * 10000 + 1000).toFixed(0)}</p>
                    <p className="text-sm text-green-600">+8% vs last month</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <EyeIcon className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button onClick={onAddProduct} variant="outline" className="h-20 flex-col">
                  <PlusIcon className="w-6 h-6 mb-2" />
                  Add New Product
                </Button>
                <Button onClick={onEditBrand} variant="outline" className="h-20 flex-col">
                  <PencilIcon className="w-6 h-6 mb-2" />
                  Edit Brand Profile
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <ChartBarIcon className="w-6 h-6 mb-2" />
                  View Analytics
                </Button>
              </div>
            </Card>

            {/* Recent Products */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Products</h2>
                <Button onClick={() => setActiveTab('products')} variant="outline" size="sm">
                  View All
                </Button>
              </div>
              <div className="space-y-4">
                {products.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-600">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${product.price}</p>
                      <Badge variant={product.inStock ? "success" : "danger"} size="sm">
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Products Header */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Products</h2>
                <p className="text-gray-600">Manage your product catalog</p>
              </div>
              <Button onClick={onAddProduct} className="flex items-center gap-2">
                <PlusIcon className="w-4 h-4" />
                Add Product
              </Button>
            </div>

            {/* Search & Filters */}
            <Card className="p-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                  <option>All Categories</option>
                  <option>T-Shirts</option>
                  <option>Pants</option>
                  <option>Dresses</option>
                </select>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                  <option>All Status</option>
                  <option>In Stock</option>
                  <option>Out of Stock</option>
                </select>
              </div>
            </Card>

            {/* Products List */}
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rating
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-10 h-10 object-cover rounded-lg"
                            />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                              <div className="text-sm text-gray-500">{product.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{product.category}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">${product.price}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={product.inStock ? "success" : "danger"} size="sm">
                            {product.inStock ? `${product.stockQuantity} in stock` : 'Out of stock'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <StarIcon className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm text-gray-900">{product.rating}</span>
                            <span className="text-sm text-gray-500">({product.reviewCount})</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() => onEditProduct(product)}
                              variant="ghost"
                              size="sm"
                            >
                              <PencilIcon className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => onDeleteProduct(product.id)}
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
            <div className="text-center py-12">
              <ChartBarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Coming Soon</h3>
              <p className="text-gray-600">Detailed analytics and reporting features will be available soon.</p>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Brand Settings</h2>
            
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Brand Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name</label>
                  <Input defaultValue={brand.name} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    rows={3}
                    defaultValue={brand.description}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <Input defaultValue={brand.website} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <Input defaultValue={brand.location} />
                </div>
                <div className="flex gap-4">
                  <Button>Save Changes</Button>
                  <Button variant="outline">Cancel</Button>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Brand Images</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
                  <div className="flex items-center gap-4">
                    <img
                      src={brand.logo}
                      alt="Brand logo"
                      className="w-16 h-16 object-contain bg-gray-50 rounded-lg border border-gray-200 p-2"
                    />
                    <Button variant="outline" className="flex items-center gap-2">
                      <PhotoIcon className="w-4 h-4" />
                      Upload New Logo
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
                  <div className="flex items-center gap-4">
                    {brand.coverImage ? (
                      <img
                        src={brand.coverImage}
                        alt="Brand cover"
                        className="w-24 h-16 object-cover rounded-lg border border-gray-200"
                      />
                    ) : (
                      <div className="w-24 h-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                        <PhotoIcon className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    <Button variant="outline" className="flex items-center gap-2">
                      <PhotoIcon className="w-4 h-4" />
                      Upload Cover Image
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard; 
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  CheckBadgeIcon,
  MapPinIcon,
  GlobeAltIcon,
  UserGroupIcon,
  ShoppingBagIcon,
  HeartIcon,
  ShareIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';

import { Button, Badge, Card } from '../components/ui';
import ProductGrid from '../components/catalog/ProductGrid';
import BrandStory from '../components/brand/BrandStory';
import { useAppStore } from '../store';
import type { Brand, Product } from '../types';

const BrandDetail = () => {
  const { brandId } = useParams<{ brandId: string }>();
  const { products, brands } = useAppStore();
  
  const [brand, setBrand] = useState<Brand | null>(null);
  const [brandProducts, setBrandProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'products' | 'about' | 'reviews'>('products');
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Find brand by ID
    const foundBrand = brands.find(b => b.id === brandId);
    if (foundBrand) {
      setBrand(foundBrand);
      
      // Filter products by brand
      const filteredProducts = products.filter(p => p.brand.id === brandId);
      setBrandProducts(filteredProducts);
    }
  }, [brandId, brands, products]);

  if (!brand) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Brand Not Found</h2>
          <p className="text-gray-600 mb-6">The brand you're looking for doesn't exist.</p>
          <Link to="/brands">
            <Button>Browse All Brands</Button>
          </Link>
        </div>
      </div>
    );
  }

  const averageRating = brandProducts.length > 0 
    ? brandProducts.reduce((sum, p) => sum + p.rating, 0) / brandProducts.length 
    : 0;

  const totalReviews = brandProducts.reduce((sum, p) => sum + p.reviewCount, 0);

  const sortedProducts = [...brandProducts].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        // Since we don't have createdAt, we'll sort by featured status instead
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'popular':
        return b.reviewCount - a.reviewCount;
      default:
        return b.featured ? 1 : -1;
    }
  });

  const tabs = [
    { id: 'products', name: 'Products', count: brandProducts.length },
    { id: 'about', name: 'About', count: null },
    { id: 'reviews', name: 'Reviews', count: totalReviews }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Brand Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm py-4 border-b border-gray-100">
            <Link to="/" className="text-gray-500 hover:text-gray-900">Home</Link>
            <span className="text-gray-400">/</span>
            <Link to="/brands" className="text-gray-500 hover:text-gray-900">Brands</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{brand.name}</span>
          </nav>

          {/* Brand Info */}
          <div className="py-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Brand Image & Logo */}
              <div className="lg:w-1/3">
                {brand.coverImage ? (
                  <div className="relative rounded-xl overflow-hidden mb-6">
                    <img
                      src={brand.coverImage}
                      alt={`${brand.name} cover`}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>
                ) : (
                  <div className="w-full h-64 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl flex items-center justify-center mb-6">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-primary-600">
                          {brand.name.charAt(0)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-center">
                  <img
                    src={brand.logo}
                    alt={`${brand.name} logo`}
                    className="w-24 h-24 object-contain bg-white rounded-2xl shadow-lg border border-gray-200 p-4"
                  />
                </div>
              </div>

              {/* Brand Details */}
              <div className="lg:w-2/3 space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-4xl font-bold text-gray-900">{brand.name}</h1>
                    {brand.verified && (
                      <CheckBadgeIcon className="w-8 h-8 text-blue-500" />
                    )}
                  </div>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {brand.description}
                  </p>
                </div>

                {/* Brand Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{brandProducts.length}</div>
                    <div className="text-sm text-gray-600">Products</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-2xl font-bold text-gray-900">
                        {averageRating.toFixed(1)}
                      </span>
                      <StarIcon className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div className="text-sm text-gray-600">Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{totalReviews}</div>
                    <div className="text-sm text-gray-600">Reviews</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {brand.established || 'Est. 2020'}
                    </div>
                    <div className="text-sm text-gray-600">Established</div>
                  </div>
                </div>

                {/* Brand Meta */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  {brand.location && (
                    <div className="flex items-center gap-1">
                      <MapPinIcon className="w-4 h-4" />
                      <span>{brand.location}</span>
                    </div>
                  )}
                  {brand.website && (
                    <a 
                      href={brand.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-primary-600"
                    >
                      <GlobeAltIcon className="w-4 h-4" />
                      <span>Website</span>
                    </a>
                  )}
                  <div className="flex items-center gap-1">
                    <UserGroupIcon className="w-4 h-4" />
                    <span>{(Math.random() * 10000 + 1000).toFixed(0)} followers</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button variant="primary" className="flex-1 lg:flex-none">
                    <HeartIcon className="w-4 h-4 mr-2" />
                    Follow Brand
                  </Button>
                  <Button variant="outline">
                    <ShareIcon className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  {brand.website && (
                    <a href={brand.website} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline">
                        <GlobeAltIcon className="w-4 h-4 mr-2" />
                        Visit Store
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
                {tab.count !== null && (
                  <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-gray-100 text-gray-900">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Products Header */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Products ({brandProducts.length})
                </h2>
                <p className="text-gray-600 mt-1">
                  Discover {brand.name}'s latest collection
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <FunnelIcon className="w-4 h-4" />
                  Filters
                </button>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>

            {/* Quick Category Filters */}
            {showFilters && (
              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Quick Filters</h3>
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Set(brandProducts.map(p => p.category))).map((category) => (
                    <Badge 
                      key={category}
                      variant="outline" 
                      className="cursor-pointer hover:bg-primary-50 hover:border-primary-300"
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}

            {/* Products Grid */}
            {sortedProducts.length > 0 ? (
              <ProductGrid products={sortedProducts} />
            ) : (
              <div className="text-center py-12">
                <ShoppingBagIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600">This brand hasn't added any products yet.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'about' && (
          <BrandStory brand={brand} />
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Customer Reviews ({totalReviews})
            </h2>
            {/* Brand-specific reviews would go here */}
            <div className="text-center py-12">
              <p className="text-gray-600">Brand reviews coming soon...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandDetail; 
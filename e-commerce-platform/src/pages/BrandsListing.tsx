import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  MagnifyingGlassIcon,
  CheckBadgeIcon,
  MapPinIcon,
  StarIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';
import { Button, Badge, Card, Input } from '../components/ui';
import { useAppStore } from '../store';
import type { Brand } from '../types';

const BrandsListing = () => {
  const { brands, products } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');

  // Get brand statistics
  const getBrandStats = (brand: Brand) => {
    const brandProducts = products.filter(p => p.brand.id === brand.id);
    const avgRating = brandProducts.length > 0 
      ? brandProducts.reduce((sum, p) => sum + p.rating, 0) / brandProducts.length 
      : 0;
    const totalReviews = brandProducts.reduce((sum, p) => sum + p.reviewCount, 0);
    
    return {
      productCount: brandProducts.length,
      averageRating: avgRating,
      totalReviews
    };
  };

  // Filter and sort brands
  const filteredBrands = useMemo(() => {
    let filtered = brands.filter(brand => {
      const matchesSearch = brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           brand.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesVerified = !showVerifiedOnly || brand.verified;
      const matchesLocation = !selectedLocation || brand.location === selectedLocation;
      
      return matchesSearch && matchesVerified && matchesLocation;
    });

    // Sort brands
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'products':
          const aStats = getBrandStats(a);
          const bStats = getBrandStats(b);
          return bStats.productCount - aStats.productCount;
        case 'rating':
          const aRating = getBrandStats(a).averageRating;
          const bRating = getBrandStats(b).averageRating;
          return bRating - aRating;
        case 'verified':
          return (b.verified ? 1 : 0) - (a.verified ? 1 : 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [brands, searchQuery, sortBy, showVerifiedOnly, selectedLocation, products]);

  // Get unique locations
  const locations = Array.from(new Set(brands.map(b => b.location).filter(Boolean)));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Discover Local Brands
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Explore unique fashion from talented local designers and established brands. 
                Each brand brings their own style and story to our marketplace.
              </p>
            </div>
            
            {/* Brand Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">{brands.length}</div>
                <div className="text-sm text-gray-600">Total Brands</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">
                  {brands.filter(b => b.verified).length}
                </div>
                <div className="text-sm text-gray-600">Verified Brands</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">
                  {products.length}
                </div>
                <div className="text-sm text-gray-600">Total Products</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">
                  {locations.length}
                </div>
                <div className="text-sm text-gray-600">Cities</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search brands..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="name">Sort by Name</option>
                <option value="products">Most Products</option>
                <option value="rating">Highest Rated</option>
                <option value="verified">Verified First</option>
              </select>

              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Locations</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>

              <Button
                variant={showVerifiedOnly ? "primary" : "outline"}
                onClick={() => setShowVerifiedOnly(!showVerifiedOnly)}
                className="flex items-center gap-2"
              >
                <CheckBadgeIcon className="w-4 h-4" />
                Verified Only
              </Button>
            </div>
          </div>

          {/* Active Filters */}
          {(searchQuery || showVerifiedOnly || selectedLocation) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {searchQuery && (
                <Badge variant="outline" className="gap-2">
                  Search: "{searchQuery}"
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {showVerifiedOnly && (
                <Badge variant="outline" className="gap-2">
                  Verified Only
                  <button
                    onClick={() => setShowVerifiedOnly(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {selectedLocation && (
                <Badge variant="outline" className="gap-2">
                  Location: {selectedLocation}
                  <button
                    onClick={() => setSelectedLocation('')}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            {filteredBrands.length} brand{filteredBrands.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Brands Grid */}
        {filteredBrands.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBrands.map((brand) => {
              const stats = getBrandStats(brand);
              return (
                <Link key={brand.id} to={`/brand/${brand.id}`}>
                  <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                    {/* Brand Cover */}
                    <div className="relative h-32 bg-gradient-to-br from-primary-100 to-secondary-100">
                      {brand.coverImage ? (
                        <img
                          src={brand.coverImage}
                          alt={`${brand.name} cover`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-4xl font-bold text-primary-600/20">
                            {brand.name.charAt(0)}
                          </div>
                        </div>
                      )}
                      {brand.verified && (
                        <div className="absolute top-3 right-3">
                          <CheckBadgeIcon className="w-6 h-6 text-blue-500 bg-white rounded-full p-0.5" />
                        </div>
                      )}
                    </div>

                    {/* Brand Content */}
                    <div className="p-6">
                      {/* Brand Logo & Name */}
                      <div className="flex items-center gap-4 mb-4">
                        <img
                          src={brand.logo}
                          alt={`${brand.name} logo`}
                          className="w-12 h-12 object-contain bg-white rounded-lg border border-gray-200 p-2"
                        />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                            {brand.name}
                          </h3>
                          {brand.location && (
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <MapPinIcon className="w-3 h-3" />
                              {brand.location}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {brand.description}
                      </p>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 text-center text-sm">
                        <div>
                          <div className="font-semibold text-gray-900">{stats.productCount}</div>
                          <div className="text-gray-600">Products</div>
                        </div>
                        <div>
                          <div className="flex items-center justify-center gap-1">
                            <span className="font-semibold text-gray-900">
                              {stats.averageRating.toFixed(1)}
                            </span>
                            <StarIcon className="w-3 h-3 text-yellow-400" />
                          </div>
                          <div className="text-gray-600">Rating</div>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{stats.totalReviews}</div>
                          <div className="text-gray-600">Reviews</div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <ShoppingBagIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No brands found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filters.</p>
            <Button
              onClick={() => {
                setSearchQuery('');
                setShowVerifiedOnly(false);
                setSelectedLocation('');
              }}
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandsListing; 
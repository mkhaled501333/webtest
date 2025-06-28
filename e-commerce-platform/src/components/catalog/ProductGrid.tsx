import { Link } from 'react-router-dom';
import { HeartIcon, ShoppingCartIcon, EyeIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/20/solid';
import type { Product } from '../../types';
import { useAppStore } from '../../store';
import { Badge, Button } from '../ui';

interface ProductGridProps {
  products: Product[];
}

const ProductGrid = ({ products }: ProductGridProps) => {
  const { addToCart, addToWishlist, isInWishlist } = useAppStore();

  const handleAddToCart = (product: Product) => {
    // Add with first available size and color
    const size = product.sizes.find(s => s.available)?.id;
    const color = product.colors.find(c => c.available)?.id;
    
    if (size && color) {
      addToCart(product, size, color, 1);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden bg-gray-100">
            <Link to={`/product/${product.id}`}>
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </Link>
            
            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1 sm:gap-2">
              {product.originalPrice && (
                 <Badge variant="danger" size="sm" className="text-xs">
                   Sale
                 </Badge>
              )}
              {product.featured && (
                <Badge variant="secondary" size="sm" className="text-xs">
                  Featured
                </Badge>
              )}
              {!product.inStock && (
                <Badge variant="outline" size="sm" className="bg-white text-xs">
                  Out of Stock
                </Badge>
              )}
            </div>

            {/* Action Buttons - Only show on larger screens */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-y-1 sm:space-y-2 hidden sm:flex flex-col">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToWishlist(product);
                }}
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-colors ${
                  isInWishlist(product.id)
                    ? 'bg-red-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100 shadow'
                }`}
                title="Add to wishlist"
              >
                <HeartIcon className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
              
              <Link
                to={`/product/${product.id}`}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white text-gray-600 hover:bg-gray-100 shadow flex items-center justify-center transition-colors"
                title="Quick view"
              >
                <EyeIcon className="w-3 h-3 sm:w-4 sm:h-4" />
              </Link>
            </div>

            {/* Quick Add to Cart - Hidden on mobile, shown on hover for desktop */}
            <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block">
              <Button
                size="sm"
                variant="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(product);
                }}
                disabled={!product.inStock}
                className="w-full text-xs"
              >
                <ShoppingCartIcon className="w-3 h-3 mr-1" />
                Add to Cart
              </Button>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-2 sm:p-3 lg:p-4">
            {/* Brand */}
            <p className="text-xs text-gray-600 mb-1 truncate">{product.brand.name}</p>
            
            {/* Name */}
            <Link to={`/product/${product.id}`}>
              <h3 className="font-medium text-gray-900 mb-1 sm:mb-2 hover:text-primary-600 transition-colors line-clamp-2 text-sm sm:text-base">
                {product.name}
              </h3>
            </Link>

            {/* Rating - Hidden on mobile */}
            <div className="hidden sm:flex items-center gap-1 mb-2">
              <div className="flex">
                {Array.from({ length: 5 }, (_, i) => (
                  <StarIcon
                    key={i}
                    className={`w-3 h-3 sm:w-4 sm:h-4 ${
                      i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-600">
                ({product.reviewCount})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-1 sm:gap-2 mb-2">
              <span className="font-semibold text-gray-900 text-sm sm:text-base">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Colors - Simplified on mobile */}
            <div className="flex items-center gap-1 mb-1 sm:mb-2">
              <span className="text-xs text-gray-600 hidden sm:inline">Colors:</span>
              <div className="flex gap-1">
                {product.colors.slice(0, 3).map((color) => (
                  <div
                    key={color.id}
                    className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
                {product.colors.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{product.colors.length - 3}
                  </span>
                )}
              </div>
            </div>

            {/* Sizes - Simplified on mobile */}
            <div className="flex items-center gap-1 mb-2 sm:mb-0">
              <span className="text-xs text-gray-600 hidden sm:inline">Sizes:</span>
              <div className="flex gap-1 flex-wrap">
                {product.sizes.slice(0, 2).map((size) => (
                  <span key={size.id} className="text-xs text-gray-600">
                    {size.name}
                  </span>
                ))}
                {product.sizes.length > 2 && (
                  <span className="text-xs text-gray-500">
                    +{product.sizes.length - 2}
                  </span>
                )}
              </div>
            </div>

            {/* Mobile Action Buttons */}
            <div className="flex gap-2 mt-2 sm:hidden">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToWishlist(product);
                }}
                className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-colors ${
                  isInWishlist(product.id)
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <HeartIcon className="w-3 h-3 mx-auto" />
              </button>
              
              <Button
                size="sm"
                variant="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(product);
                }}
                disabled={!product.inStock}
                className="flex-1 text-xs py-2"
              >
                <ShoppingCartIcon className="w-3 h-3 mr-1" />
                Add
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid; 
import { Link } from 'react-router-dom';
import { HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/20/solid';
import { Badge } from '../ui';
import { useAppStore } from '../../store';
import type { Product } from '../../types';

interface RelatedProductsProps {
  currentProduct: Product;
}

const RelatedProducts = ({ currentProduct }: RelatedProductsProps) => {
  const { products, addToCart, addToWishlist, isInWishlist } = useAppStore();

  // Filter related products by same category or brand, excluding current product
  const relatedProducts = products
    .filter(product => 
      product.id !== currentProduct.id && 
      (product.category === currentProduct.category || product.brand.id === currentProduct.brand.id)
    )
    .slice(0, 4); // Show only 4 related products

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const handleQuickAdd = (product: Product) => {
    // Add with first available size and color
    const firstSize = product.sizes.find(s => s.available);
    const firstColor = product.colors.find(c => c.available);
    
    if (firstSize && firstColor) {
      addToCart(product, firstSize.id, firstColor.id, 1);
    }
  };

  const handleWishlistToggle = (product: Product) => {
    if (isInWishlist(product.id)) {
      // Would call removeFromWishlist, but we don't have that function in store
      console.log('Remove from wishlist:', product.id);
    } else {
      addToWishlist(product);
    }
  };

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">You might also like</h2>
          <p className="text-gray-600 mt-1">Similar products from {currentProduct.brand.name} and others</p>
        </div>
        <Link
          to="/products"
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          View all products →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => {
          const discountPercentage = product.originalPrice 
            ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
            : 0;

          return (
            <div
              key={product.id}
              className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              {/* Product Image */}
              <div className="relative aspect-square bg-gray-100 overflow-hidden">
                <Link to={`/product/${product.id}`}>
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {discountPercentage > 0 && (
                    <Badge variant="danger" size="sm">
                      {discountPercentage}% OFF
                    </Badge>
                  )}
                  {!product.inStock && (
                    <Badge variant="secondary" size="sm">
                      Out of Stock
                    </Badge>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleWishlistToggle(product)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors ${
                      isInWishlist(product.id)
                        ? 'bg-red-500 text-white'
                        : 'bg-white bg-opacity-80 text-gray-700 hover:bg-opacity-100'
                    }`}
                    title={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <HeartIcon className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                  </button>

                  {product.inStock && (
                    <button
                      onClick={() => handleQuickAdd(product)}
                      className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors"
                      title="Quick add to cart"
                    >
                      <ShoppingCartIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                {/* Brand */}
                <Link
                  to={`/products?brand=${product.brand.id}`}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  {product.brand.name}
                </Link>

                {/* Product Name */}
                <Link to={`/product/${product.id}`}>
                  <h3 className="font-medium text-gray-900 mt-1 mb-2 line-clamp-2 hover:text-primary-600 transition-colors">
                    {product.name}
                  </h3>
                </Link>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }, (_, i) => (
                      <StarIcon
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">({product.reviewCount})</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>

                {/* Colors Preview */}
                <div className="flex items-center gap-1">
                  {product.colors.slice(0, 4).map((color) => (
                    <div
                      key={color.id}
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                  {product.colors.length > 4 && (
                    <span className="text-xs text-gray-500 ml-1">
                      +{product.colors.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA Section */}
      <div className="mt-12 text-center bg-gray-50 rounded-lg p-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Looking for something specific?
        </h3>
        <p className="text-gray-600 mb-4">
          Browse our full collection of {currentProduct.category.toLowerCase()} from all brands
        </p>
        <Link
          to={`/products?category=${currentProduct.category}`}
          className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
        >
          Shop All {currentProduct.category}
        </Link>
      </div>
    </div>
  );
};

export default RelatedProducts; 
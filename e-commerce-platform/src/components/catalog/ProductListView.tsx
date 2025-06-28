import { Link } from 'react-router-dom';
import { HeartIcon, ShoppingCartIcon, EyeIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/20/solid';
import type { Product } from '../../types';
import { useAppStore } from '../../store';
import { Badge, Button } from '../ui';

interface ProductListViewProps {
  products: Product[];
}

const ProductListView = ({ products }: ProductListViewProps) => {
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
    <div className="space-y-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300"
        >
          <div className="flex flex-col sm:flex-row">
            {/* Product Image */}
            <div className="relative w-full sm:w-48 h-48 sm:h-32 bg-gray-100 flex-shrink-0">
              <Link to={`/product/${product.id}`}>
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </Link>
              
              {/* Badges */}
              <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                {product.originalPrice && (
                  <Badge variant="danger" size="sm">
                    Sale
                  </Badge>
                )}
                {product.featured && (
                  <Badge variant="secondary" size="sm">
                    Featured
                  </Badge>
                )}
                {!product.inStock && (
                  <Badge variant="outline" size="sm" className="bg-white">
                    Out of Stock
                  </Badge>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="flex-1 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between h-full">
                <div className="flex-1 mb-4 sm:mb-0 sm:pr-6">
                  {/* Brand */}
                  <p className="text-sm text-gray-600 mb-1">{product.brand.name}</p>
                  
                  {/* Name */}
                  <Link to={`/product/${product.id}`}>
                    <h3 className="text-lg font-medium text-gray-900 mb-2 hover:text-primary-600 transition-colors">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex">
                      {Array.from({ length: 5 }, (_, i) => (
                        <StarIcon
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {product.rating.toFixed(1)} ({product.reviewCount} reviews)
                    </span>
                  </div>

                  {/* Attributes */}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    {/* Colors */}
                    <div className="flex items-center gap-1">
                      <span>Colors:</span>
                      <div className="flex gap-1">
                        {product.colors.slice(0, 3).map((color) => (
                          <div
                            key={color.id}
                            className="w-4 h-4 rounded-full border border-gray-300"
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

                    {/* Sizes */}
                    <div className="flex items-center gap-1">
                      <span>Sizes:</span>
                      <span>
                        {product.sizes.slice(0, 3).map(size => size.name).join(', ')}
                        {product.sizes.length > 3 && ` +${product.sizes.length - 3}`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price and Actions */}
                <div className="flex sm:flex-col sm:items-end gap-4">
                  {/* Price */}
                  <div className="text-right">
                    <div className="text-xl font-semibold text-gray-900">
                      {formatPrice(product.price)}
                    </div>
                    {product.originalPrice && (
                      <div className="text-sm text-gray-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col gap-2">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.inStock}
                      className="flex items-center gap-2"
                    >
                      <ShoppingCartIcon className="w-4 h-4" />
                      Add to Cart
                    </Button>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => addToWishlist(product)}
                        className={`p-2 rounded-md border transition-colors ${
                          isInWishlist(product.id)
                            ? 'bg-red-50 border-red-200 text-red-600'
                            : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                        }`}
                        title="Add to wishlist"
                      >
                        <HeartIcon className="w-4 h-4" />
                      </button>
                      
                      <Link
                        to={`/product/${product.id}`}
                        className="p-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
                        title="View details"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductListView; 
import { useAppStore } from '../../store';
import { Button, Card, Badge } from '../ui';
import { HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const NewArrivalsSection = () => {
  const { products, addToCart, addToWishlist, isInWishlist } = useAppStore();

  // Get featured products (first 8)
  const newArrivals = products.filter(product => product.featured).slice(0, 8);

  const handleAddToCart = (product: any) => {
    // Add with first available size and color
    const size = product.sizes.find((s: any) => s.available)?.id;
    const color = product.colors.find((c: any) => c.available)?.id;
    
    if (size && color) {
      addToCart(product, size, color, 1);
    }
  };

  // Get product-specific design for meaningful placeholders
  const getProductDesign = (product: any) => {
    const designMap: Record<string, { pattern: string; color: string; label: string }> = {
      'Tops': {
        pattern: `
          <div style="position: absolute; top: 15%; left: 25%; width: 50%; height: 70%; border: 3px solid #3b82f6; border-radius: 20px 20px 8px 8px; background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);"></div>
          <div style="position: absolute; top: 20%; left: 30%; width: 40%; height: 30%; border: 2px solid #2563eb; border-radius: 15px 15px 0 0; background: #eff6ff;"></div>
          <div style="position: absolute; top: 25%; left: 40%; width: 20%; height: 6%; background: #3b82f6; border-radius: 2px;"></div>
          <div style="position: absolute; top: 35%; left: 35%; width: 30%; height: 3%; background: #1d4ed8; border-radius: 1px;"></div>
        `,
        color: '#3b82f6',
        label: 'Fashion Top'
      },
      'Bottoms': {
        pattern: `
          <div style="position: absolute; top: 20%; left: 30%; width: 40%; height: 60%; border: 3px solid #6366f1; border-radius: 25px 25px 10px 10px; background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);"></div>
          <div style="position: absolute; top: 25%; left: 32%; width: 36%; height: 50%; border: 2px solid #4f46e5; background: #eef2ff;"></div>
          <div style="position: absolute; top: 27%; left: 48%; width: 2px; height: 45%; background: #6366f1;"></div>
          <div style="position: absolute; top: 65%; left: 38%; width: 24%; height: 4%; background: #4338ca; border-radius: 2px;"></div>
        `,
        color: '#6366f1',
        label: 'Fashion Bottom'
      },
      'Dresses': {
        pattern: `
          <div style="position: absolute; top: 15%; left: 30%; width: 40%; height: 20%; border: 3px solid #8b5cf6; border-radius: 20px 20px 0 0; background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);"></div>
          <div style="position: absolute; top: 33%; left: 25%; width: 50%; height: 50%; border: 3px solid #7c3aed; border-radius: 0 0 40px 40px; background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);"></div>
          <div style="position: absolute; top: 27%; left: 48%; width: 4%; height: 25%; background: #8b5cf6;"></div>
          <div style="position: absolute; top: 40%; left: 35%; width: 30%; height: 2%; background: #6d28d9;"></div>
        `,
        color: '#8b5cf6',
        label: 'Fashion Dress'
      },
      'Outerwear': {
        pattern: `
          <div style="position: absolute; top: 10%; left: 20%; width: 60%; height: 75%; border: 4px solid #10b981; border-radius: 25px; background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);"></div>
          <div style="position: absolute; top: 15%; left: 25%; width: 50%; height: 30%; border: 3px solid #059669; border-radius: 20px 20px 0 0; background: #ecfdf5;"></div>
          <div style="position: absolute; top: 20%; left: 72%; width: 6%; height: 6%; border: 2px solid #047857; border-radius: 50%; background: #10b981;"></div>
          <div style="position: absolute; top: 50%; left: 30%; width: 40%; height: 3%; background: #059669; border-radius: 2px;"></div>
        `,
        color: '#10b981',
        label: 'Fashion Jacket'
      },
      'Activewear': {
        pattern: `
          <div style="position: absolute; top: 15%; left: 25%; width: 50%; height: 70%; border: 3px solid #06b6d4; border-radius: 18px; background: linear-gradient(135deg, #cffafe 0%, #a5f3fc 100%);"></div>
          <div style="position: absolute; top: 20%; left: 30%; width: 40%; height: 35%; border: 2px solid #0891b2; border-radius: 15px 15px 0 0; background: #f0fdff;"></div>
          <div style="position: absolute; top: 35%; left: 35%; width: 30%; height: 2%; background: #0e7490;"></div>
          <div style="position: absolute; top: 60%; left: 35%; width: 30%; height: 15%; border: 2px solid #0891b2; border-radius: 8px; background: #e6fffa;"></div>
        `,
        color: '#06b6d4',
        label: 'Activewear'
      }
    };
    
    return designMap[product.category] || {
      pattern: `
        <div style="position: absolute; top: 20%; left: 25%; width: 50%; height: 60%; border: 3px solid #6b7280; border-radius: 15px; background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);"></div>
        <div style="position: absolute; top: 25%; left: 30%; width: 40%; height: 35%; border: 2px solid #4b5563; background: #f9fafb;"></div>
      `,
      color: '#6b7280',
      label: 'Fashion Item'
    };
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, product: any) => {
    const target = e.target as HTMLImageElement;
    const productDesign = getProductDesign(product);
    
    // Try multiple fallback options
    if (target.src.includes('placeholder') || target.src.includes('picsum')) {
      // If placeholder already failed, use meaningful product visualization
      target.style.display = 'none';
      const parent = target.parentElement;
      if (parent) {
        parent.style.background = `linear-gradient(135deg, ${productDesign.color}08 0%, ${productDesign.color}15 100%)`;
        parent.style.display = 'flex';
        parent.style.alignItems = 'center';
        parent.style.justifyContent = 'center';
        parent.style.position = 'relative';
        parent.innerHTML = `
          <div style="position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
            <!-- Fashion product illustration -->
            <div style="position: relative; width: 140px; height: 140px;">
              ${productDesign.pattern}
              
              <!-- Product info -->
              <div style="
                position: absolute;
                bottom: -40px;
                left: 50%;
                transform: translateX(-50%);
                text-align: center;
                color: ${productDesign.color};
              ">
                <div style="font-size: 1rem; font-weight: 600; margin-bottom: 0.25rem;">
                  ${productDesign.label}
                </div>
                <div style="font-size: 0.875rem; opacity: 0.8;">
                  ${product.brand?.name || 'Fashion Brand'}
                </div>
                <div style="
                  display: inline-block;
                  margin-top: 0.5rem;
                  padding: 0.25rem 0.75rem;
                  background: ${productDesign.color}20;
                  border: 1px solid ${productDesign.color}40;
                  border-radius: 12px;
                  font-size: 0.75rem;
                  font-weight: 500;
                  color: ${productDesign.color};
                ">
                  New Arrival
                </div>
              </div>
            </div>
          </div>
        `;
      }
    } else {
      // First try a high-quality fashion product image
      const productImageMap: Record<string, string> = {
        'Tops': 'https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=400&h=600&fit=crop&auto=format&q=80',
        'Bottoms': 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=600&fit=crop&auto=format&q=80',
        'Dresses': 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=600&fit=crop&auto=format&q=80',
        'Outerwear': 'https://images.unsplash.com/photo-1520975916090-3105956dac38?w=400&h=600&fit=crop&auto=format&q=80',
        'Activewear': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop&auto=format&q=80'
      };
      
      target.src = productImageMap[product.category] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=600&fit=crop&auto=format&q=80';
      
      // If that fails too, it will trigger this handler again
      target.onerror = () => {
        target.style.display = 'none';
        const parent = target.parentElement;
        if (parent) {
          parent.style.background = `linear-gradient(135deg, ${productDesign.color}08 0%, ${productDesign.color}15 100%)`;
          parent.style.display = 'flex';
          parent.style.alignItems = 'center';
          parent.style.justifyContent = 'center';
          parent.style.position = 'relative';
          parent.innerHTML = `
            <div style="position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
              <!-- Fashion product illustration -->
              <div style="position: relative; width: 140px; height: 140px;">
                ${productDesign.pattern}
                
                <!-- Product info -->
                <div style="
                  position: absolute;
                  bottom: -40px;
                  left: 50%;
                  transform: translateX(-50%);
                  text-align: center;
                  color: ${productDesign.color};
                ">
                  <div style="font-size: 1rem; font-weight: 600; margin-bottom: 0.25rem;">
                    ${productDesign.label}
                  </div>
                  <div style="font-size: 0.875rem; opacity: 0.8;">
                    ${product.brand?.name || 'Fashion Brand'}
                  </div>
                  <div style="
                    display: inline-block;
                    margin-top: 0.5rem;
                    padding: 0.25rem 0.75rem;
                    background: ${productDesign.color}20;
                    border: 1px solid ${productDesign.color}40;
                    border-radius: 12px;
                    font-size: 0.75rem;
                    font-weight: 500;
                    color: ${productDesign.color};
                  ">
                    New Arrival
                  </div>
                </div>
              </div>
            </div>
          `;
        }
      };
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            New Arrivals
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Fresh styles from our partner brands, just added to our collection
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {newArrivals.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="block"
            >
              <Card
                className="group cursor-pointer transition-all duration-300 hover:shadow-xl bg-white border border-gray-100 overflow-hidden"
                hover
                padding="none"
              >
                {/* Product Image */}
                <div className="relative overflow-hidden bg-gray-50">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => handleImageError(e, product)}
                    loading="lazy"
                  />
                  
                  {/* Image Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 space-y-2">
                    <Badge variant="primary" size="sm" className="shadow-sm">New</Badge>
                    {product.originalPrice && (
                      <Badge variant="danger" size="sm" className="shadow-sm">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% Off
                      </Badge>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 space-y-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToWishlist(product);
                      }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg ${
                        isInWishlist(product.id)
                          ? 'bg-red-500 text-white scale-110'
                          : 'bg-white text-gray-600 hover:bg-gray-100 hover:scale-110'
                      }`}
                    >
                      <HeartIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700 hover:scale-110 transition-all duration-200 shadow-lg"
                    >
                      <ShoppingCartIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-5">
                  <div className="mb-3">
                    <p className="text-sm text-primary-600 font-medium mb-1">{product.brand.name}</p>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 leading-snug">
                      {product.name}
                    </h3>
                  </div>

                  {/* Price and Rating */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-gray-900">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-400 text-lg">★</span>
                      <span className="text-sm font-medium text-gray-700">{product.rating}</span>
                      <span className="text-xs text-gray-500">({product.reviewCount})</span>
                    </div>
                  </div>

                  {/* Category and Stock Status */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{product.category}</span>
                    <div className={`flex items-center space-x-1 ${
                      product.inStock ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        product.inStock ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <span className="font-medium">
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link to="/products?featured=true">
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-3 text-lg font-medium border-2 hover:border-primary-600 hover:bg-primary-50 transition-all duration-300"
            >
              View All New Arrivals
              <span className="ml-2">→</span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewArrivalsSection; 
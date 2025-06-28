import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  HeartIcon,
  ShoppingCartIcon, 
  ChevronRightIcon,
  EyeIcon,
  ShareIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/20/solid';

import { Button, Badge } from '../components/ui';
import ProductImageGallery from '../components/product/ProductImageGallery';
import ARTryOnModal from '../components/product/ARTryOnModal';
import Product3DViewer from '../components/product/Product3DViewer';
import EnhancedARTryOn from '../components/product/EnhancedARTryOn';
import SizeRecommendationSystem from '../components/product/SizeRecommendationSystem';
import SizeGuide from '../components/product/SizeGuide';
import ProductReviews from '../components/product/ProductReviews';
import RelatedProducts from '../components/product/RelatedProducts';
import { useAppStore } from '../store';
import type { Product, Size, Color } from '../types';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    products, 
    addToCart, 
    addToWishlist, 
    removeFromWishlist, 
    isInWishlist 
  } = useAppStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isARModalOpen, setIsARModalOpen] = useState(false);
  const [isEnhancedAROpen, setIsEnhancedAROpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [show3DViewer, setShow3DViewer] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'shipping'>('description');

  useEffect(() => {
    const foundProduct = products.find(p => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
      // Auto-select first available size and color
      setSelectedSize(foundProduct.sizes.find(s => s.available) || null);
      setSelectedColor(foundProduct.colors.find(c => c.available) || null);
    } else {
      // In a real app, we'd fetch from API here
      console.log('Product not found');
    }
  }, [id, products]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/products')}>
            Browse All Products
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert('Please select size and color');
      return;
    }
    addToCart(product, selectedSize.id, selectedColor.id, quantity);
    // Show success message or update UI
  };

  const handleWishlistToggle = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-gray-900">Home</Link>
            <ChevronRightIcon className="w-4 h-4 text-gray-400" />
            <Link to="/products" className="text-gray-500 hover:text-gray-900">Products</Link>
            <ChevronRightIcon className="w-4 h-4 text-gray-400" />
            <Link to={`/products?category=${product.category}`} className="text-gray-500 hover:text-gray-900">
              {product.category}
            </Link>
            <ChevronRightIcon className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-6">
            <ProductImageGallery images={product.images} productName={product.name} />
            
            {/* 3D Viewer Toggle */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 flex items-center justify-center gap-2"
                onClick={() => setShow3DViewer(!show3DViewer)}
              >
                <EyeIcon className="w-5 h-5" />
                {show3DViewer ? 'Hide' : 'Show'} 3D View
              </Button>
              <Button
                variant="primary"
                className="flex-1 flex items-center justify-center gap-2"
                onClick={() => setIsEnhancedAROpen(true)}
              >
                <EyeIcon className="w-5 h-5" />
                Enhanced AR
                <Badge variant="secondary" size="sm">AI</Badge>
              </Button>
            </div>

            {/* 3D Viewer */}
            {show3DViewer && (
              <Product3DViewer 
                product={product} 
                onARModeToggle={() => setIsEnhancedAROpen(true)}
              />
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Brand and Name */}
            <div>
              <Link 
                to={`/products?brand=${product.brand.id}`}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                {product.brand.name}
                {product.brand.verified && (
                  <ShieldCheckIcon className="w-4 h-4 inline ml-1" />
                )}
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 mt-2">{product.name}</h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                {Array.from({ length: 5 }, (_, i) => (
                  <StarIconSolid
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600">
                {product.rating.toFixed(1)} ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <Badge variant="danger" size="lg">
                    {discountPercentage}% OFF
                  </Badge>
                </>
              )}
            </div>

            {/* Stock Status */}
            <div>
              {product.inStock ? (
                <div className="flex items-center gap-2 text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-medium">In Stock ({product.stockQuantity} available)</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="font-medium">Out of Stock</span>
                </div>
              )}
            </div>

            {/* Color Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="font-medium text-gray-900">
                  Color: {selectedColor?.name}
                </label>
              </div>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(color)}
                    disabled={!color.available}
                    className={`w-12 h-12 rounded-full border-4 relative transition-all ${
                      selectedColor?.id === color.id
                        ? 'border-primary-600 scale-110'
                        : 'border-gray-300 hover:border-gray-400'
                    } ${!color.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                    style={{ backgroundColor: color.hex }}
                    title={`${color.name} ${!color.available ? '(Out of stock)' : ''}`}
                  >
                    {selectedColor?.id === color.id && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full border border-gray-400" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Size Recommendation System */}
            <SizeRecommendationSystem 
              product={product}
              selectedSizeId={selectedSize?.id}
              onSizeSelect={(sizeId) => {
                const size = product.sizes.find(s => s.id === sizeId);
                if (size) setSelectedSize(size);
              }}
            />

            {/* Quantity */}
            <div>
              <label className="font-medium text-gray-900 block mb-3">Quantity</label>
              <div className="flex items-center gap-3">
                <div className="flex border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:text-gray-900"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300 min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                    className="px-3 py-2 text-gray-600 hover:text-gray-900"
                    disabled={quantity >= product.stockQuantity}
                  >
                    +
                  </button>
                </div>
                <span className="text-gray-600 text-sm">
                  {product.stockQuantity} available
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button
                size="lg"
                variant="primary"
                className="w-full"
                onClick={handleAddToCart}
                disabled={!product.inStock || !selectedSize || !selectedColor}
              >
                <ShoppingCartIcon className="w-5 h-5 mr-2" />
                Add to Cart - {formatPrice(product.price * quantity)}
              </Button>

              <div className="flex gap-3">
                <Button
                  size="lg"
                  variant="outline"
                  className="flex-1"
                  onClick={handleWishlistToggle}
                >
                  <HeartIcon className={`w-5 h-5 mr-2 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
                  {isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </Button>
                
                <Button
                  size="lg"
                  variant="outline"
                  className="px-4"
                >
                  <ShareIcon className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <TruckIcon className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">Free Shipping</p>
                    <p className="text-sm text-gray-600">On orders over $75</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ArrowPathIcon className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">Free Returns</p>
                    <p className="text-sm text-gray-600">30-day policy</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheckIcon className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">Secure</p>
                    <p className="text-sm text-gray-600">Encrypted checkout</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {[
                { id: 'description', label: 'Description' },
                { id: 'reviews', label: `Reviews (${product.reviewCount})` },
                { id: 'shipping', label: 'Shipping & Returns' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  {product.description}
                </p>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>Premium quality materials</li>
                  <li>Sustainable manufacturing process</li>
                  <li>Perfect fit guaranteed</li>
                  <li>Care instructions included</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-8">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <Link
                      key={tag}
                      to={`/products?search=${tag}`}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <ProductReviews product={product} />
            )}

            {activeTab === 'shipping' && (
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600 mb-8">
                  <li>Free standard shipping on orders over $75</li>
                  <li>Express shipping available for $9.99</li>
                  <li>International shipping to select countries</li>
                  <li>Orders processed within 1-2 business days</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-4">Returns & Exchanges</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>30-day return policy</li>
                  <li>Items must be unworn and in original condition</li>
                  <li>Free return shipping</li>
                  <li>Exchanges available for size and color</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <RelatedProducts currentProduct={product} />
      </div>

      {/* Modals */}
      {isARModalOpen && (
        <ARTryOnModal
          product={product}
          onClose={() => setIsARModalOpen(false)}
        />
      )}

      {isEnhancedAROpen && (
        <EnhancedARTryOn
          product={product}
          onClose={() => setIsEnhancedAROpen(false)}
        />
      )}

      {isSizeGuideOpen && (
        <SizeGuide
          category={product.category}
          onClose={() => setIsSizeGuideOpen(false)}
        />
      )}
    </div>
  );
};

export default ProductDetail; 
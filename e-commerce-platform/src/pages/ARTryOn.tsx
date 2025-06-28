import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  SparklesIcon,
  CameraIcon,
  DevicePhoneMobileIcon,
  StarIcon,
  PlayIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';
import { Button, Card, Badge } from '../components/ui';
import { useAppStore } from '../store';
import EnhancedARTryOn from '../components/product/EnhancedARTryOn';

const ARTryOn = () => {
  const { products } = useAppStore();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showARModal, setShowARModal] = useState(false);

  // Get featured products for AR demo
  const featuredProducts = products.filter(p => p.featured).slice(0, 6);

  const features = [
    {
      icon: <SparklesIcon className="w-8 h-8" />,
      title: "Advanced AI Fitting",
      description: "Our AI technology analyzes your body measurements and provides perfect fit recommendations."
    },
    {
      icon: <CameraIcon className="w-8 h-8" />,
      title: "Real-Time Try-On",
      description: "See how clothes look on you instantly with our advanced augmented reality technology."
    },
    {
      icon: <DevicePhoneMobileIcon className="w-8 h-8" />,
      title: "Mobile Optimized",
      description: "Works seamlessly on your smartphone or tablet for try-on sessions anywhere."
    }
  ];

  const handleTryProduct = (product: any) => {
    setSelectedProduct(product);
    setShowARModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 to-secondary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <SparklesIcon className="w-10 h-10" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              AR Try-On Experience
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Experience the future of fashion shopping with our advanced augmented reality technology. 
              Try on clothes virtually and see the perfect fit before you buy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-primary-600 hover:bg-gray-100"
                onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <PlayIcon className="w-5 h-5 mr-2" />
                Try AR Now
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white hover:text-primary-600"
              >
                <CameraIcon className="w-5 h-5 mr-2" />
                How It Works
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Revolutionary AR Technology
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our cutting-edge augmented reality platform provides the most accurate and realistic try-on experience available.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-8 text-center hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4 text-primary-600">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-primary-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">99.2%</div>
              <div className="text-gray-600">Fit Accuracy</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">50K+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">85%</div>
              <div className="text-gray-600">Return Reduction</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">4.9★</div>
              <div className="text-gray-600">User Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div id="products" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Try These Popular Items
            </h2>
            <p className="text-lg text-gray-600">
              Experience our AR technology with these featured products
            </p>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge variant="primary" className="flex items-center gap-1">
                        <SparklesIcon className="w-3 h-3" />
                        AR Ready
                      </Badge>
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all flex items-center justify-center">
                      <Button
                        onClick={() => handleTryProduct(product)}
                        className="opacity-0 hover:opacity-100 transition-opacity transform scale-95 hover:scale-100"
                      >
                        <CameraIcon className="w-4 h-4 mr-2" />
                        Try AR
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-gray-600">{product.brand.name}</span>
                      {product.brand.verified && (
                        <CheckBadgeIcon className="w-4 h-4 text-blue-500" />
                      )}
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center gap-1 mb-3">
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
                        ({product.reviewCount})
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">
                          ${product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>
                      
                      <Button
                        size="sm"
                        onClick={() => handleTryProduct(product)}
                        className="flex items-center gap-1"
                      >
                        <SparklesIcon className="w-4 h-4" />
                        Try AR
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <SparklesIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No AR Products Available</h3>
              <p className="text-gray-600 mb-6">
                Products are being loaded. Please check back in a moment.
              </p>
              <Link to="/products">
                <Button>Browse All Products</Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How AR Try-On Works
            </h2>
            <p className="text-lg text-gray-600">
              Get started with AR try-on in just three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Select a Product
              </h3>
              <p className="text-gray-600">
                Choose any AR-enabled product from our collection and click "Try AR"
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Allow Camera Access
              </h3>
              <p className="text-gray-600">
                Grant camera permission to enable our advanced AR technology
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Try It On
              </h3>
              <p className="text-gray-600">
                See how the product looks on you in real-time and make your decision
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Experience the Future of Shopping?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of satisfied customers who have revolutionized their shopping experience with AR try-on.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products">
              <Button 
                size="lg" 
                className="bg-white text-primary-600 hover:bg-gray-100"
              >
                Browse AR Products
              </Button>
            </Link>
            <Link to="/">
              <Button 
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white hover:text-primary-600"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* AR Modal */}
      {showARModal && selectedProduct && (
        <EnhancedARTryOn
          product={selectedProduct}
          onClose={() => {
            setShowARModal(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default ARTryOn; 
import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Button, Input } from '../ui';

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  return (
    <section className="relative bg-gradient-to-br from-primary-50 to-secondary-50 min-h-[600px] flex items-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="w-full h-full bg-primary-50 bg-opacity-20 bg-[radial-gradient(circle_at_1px_1px,_rgba(255,255,255,0.8)_1px,_transparent_0)] bg-[length:20px_20px]" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Discover Local Fashion
            <span className="block text-primary-600">Try With AR</span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Shop unique styles from local brands and see how they look on you with our 
            revolutionary AR try-on technology
          </p>

          {/* Value Propositions */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary-500 rounded-full" />
              <span className="text-gray-700 font-medium">Local Brands</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary-500 rounded-full" />
              <span className="text-gray-700 font-medium">AR Try-On</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary-500 rounded-full" />
              <span className="text-gray-700 font-medium">Unique Styles</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary-500 rounded-full" />
              <span className="text-gray-700 font-medium">Fast Delivery</span>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-10">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search for brands, products, or styles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-lg py-4 pr-16 shadow-lg border-2 border-white bg-white"
                leftIcon={<MagnifyingGlassIcon className="h-5 w-5" />}
              />
              <Button
                type="submit"
                className="absolute right-2 top-2 bottom-2"
                variant="primary"
              >
                Search
              </Button>
            </div>
          </form>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="primary"
              className="text-lg px-8 py-4"
            >
              Try AR Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-4"
            >
              Browse Brands
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-500 text-sm mb-4">Trusted by thousands of fashion lovers</p>
            <div className="flex justify-center items-center space-x-8 opacity-60">
              <div className="text-2xl font-bold text-gray-400">20+</div>
              <div className="text-sm text-gray-500">Local<br/>Brands</div>
              <div className="h-8 w-px bg-gray-300" />
              <div className="text-2xl font-bold text-gray-400">5K+</div>
              <div className="text-sm text-gray-500">Happy<br/>Customers</div>
              <div className="h-8 w-px bg-gray-300" />
              <div className="text-2xl font-bold text-gray-400">10K+</div>
              <div className="text-sm text-gray-500">Products<br/>Available</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 
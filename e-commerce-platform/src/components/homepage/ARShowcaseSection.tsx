import { Button, Card } from '../ui';

const ARShowcaseSection = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-primary-500 to-primary-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Try Before You Buy with AR
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Experience the future of online shopping with our cutting-edge AR technology. 
              See how clothes fit and look on you before making a purchase.
            </p>

            {/* Features */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <span className="text-sm">✓</span>
                </div>
                <span>Virtual fitting room experience</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <span className="text-sm">✓</span>
                </div>
                <span>Real-time size and fit recommendations</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <span className="text-sm">✓</span>
                </div>
                <span>Works on your phone or computer</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-primary-600 hover:bg-gray-100"
              >
                Try AR Demo
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-primary-600"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* AR Demo Preview */}
          <div className="relative">
            <Card
              className="bg-white bg-opacity-10 backdrop-blur-sm border-white border-opacity-20"
              padding="lg"
            >
              <div className="aspect-video bg-black bg-opacity-20 rounded-lg mb-4 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                  <p className="text-white text-opacity-80">AR Demo Video</p>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">See the Magic in Action</h3>
              <p className="text-primary-100 text-sm">
                Watch how our AR technology transforms your shopping experience
              </p>
            </Card>

            {/* Floating Stats */}
            <div className="absolute -top-4 -right-4 bg-white text-primary-600 rounded-lg p-4 shadow-lg">
              <div className="text-2xl font-bold">95%</div>
              <div className="text-xs">Customer Satisfaction</div>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white text-primary-600 rounded-lg p-4 shadow-lg">
              <div className="text-2xl font-bold">60%</div>
              <div className="text-xs">Fewer Returns</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ARShowcaseSection; 
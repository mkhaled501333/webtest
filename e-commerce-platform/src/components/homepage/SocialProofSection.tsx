import { Card } from '../ui';

const SocialProofSection = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b02e?w=100&h=100&fit=crop&crop=face',
      rating: 5,
      text: 'The AR try-on feature is amazing! I can finally see how clothes look on me before buying. No more returns!',
      verified: true
    },
    {
      id: 2,
      name: 'Maria Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      rating: 5,
      text: 'Love supporting local brands through this platform. The quality is outstanding and shipping is super fast.',
      verified: true
    },
    {
      id: 3,
      name: 'Emily Chen',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
      rating: 5,
      text: 'Found so many unique pieces here that I can\'t get anywhere else. The local brand selection is incredible!',
      verified: true
    }
  ];

  const brandPartners = [
    { name: 'Urban Threads', logo: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=120&h=60&fit=crop&auto=format&q=80' },
    { name: 'Eco Fashion Co.', logo: 'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=120&h=60&fit=crop&auto=format&q=80' },
    { name: 'Vintage Vibes', logo: 'https://images.unsplash.com/photo-1613545325278-f24b0cae1211?w=120&h=60&fit=crop&auto=format&q=80' },
    { name: 'Street Style', logo: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=120&h=60&fit=crop&auto=format&q=80' },
    { name: 'Minimal Mode', logo: 'https://images.unsplash.com/photo-1634712282287-14ed57b9cc89?w=120&h=60&fit=crop&auto=format&q=80' },
    { name: 'Boho Boutique', logo: 'https://images.unsplash.com/photo-1618044733300-9472054094ee?w=120&h=60&fit=crop&auto=format&q=80' }
  ];

  const handleLogoError = (e: React.SyntheticEvent<HTMLImageElement, Event>, brandName: string) => {
    const target = e.target as HTMLImageElement;
    
    // Create a meaningful brand logo fallback
    const canvas = document.createElement('canvas');
    canvas.width = 120;
    canvas.height = 60;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Create brand-specific color schemes
      const brandColors: Record<string, {bg: string, text: string}> = {
        'Urban Threads': { bg: '#3B82F6', text: '#FFFFFF' },
        'Eco Fashion Co.': { bg: '#10B981', text: '#FFFFFF' },
        'Vintage Vibes': { bg: '#8B5CF6', text: '#FFFFFF' },
        'Street Style': { bg: '#F59E0B', text: '#FFFFFF' },
        'Minimal Mode': { bg: '#EF4444', text: '#FFFFFF' },
        'Boho Boutique': { bg: '#06B6D4', text: '#FFFFFF' }
      };
      
      const colors = brandColors[brandName] || { bg: '#6B7280', text: '#FFFFFF' };
      
      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, 120, 60);
      gradient.addColorStop(0, colors.bg);
      gradient.addColorStop(1, colors.bg + '99');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 120, 60);
      
      // Add subtle pattern
      ctx.fillStyle = colors.text + '10';
      for (let i = 0; i < 120; i += 20) {
        for (let j = 0; j < 60; j += 20) {
          ctx.fillRect(i, j, 2, 2);
        }
      }
      
      // Add brand name
      ctx.fillStyle = colors.text;
      ctx.font = 'bold 10px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Split long brand names
      const words = brandName.split(' ');
      if (words.length > 2) {
        ctx.fillText(words.slice(0, 2).join(' '), 60, 25);
        ctx.fillText(words.slice(2).join(' '), 60, 40);
      } else if (words.length === 2) {
        ctx.fillText(words[0], 60, 25);
        ctx.fillText(words[1], 60, 40);
      } else {
        ctx.fillText(brandName, 60, 30);
      }
      
      target.src = canvas.toDataURL();
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Testimonials */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
            Real reviews from fashion lovers who've discovered their new favorite brands with us
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="text-left">
                {/* Rating */}
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-lg ${
                        i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-gray-600 mb-6 italic">"{testimonial.text}"</p>

                {/* Author */}
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <div className="font-semibold text-gray-900 flex items-center">
                      {testimonial.name}
                      {testimonial.verified && (
                        <span className="ml-2 text-primary-500">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">Verified Customer</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">20K+</div>
            <p className="text-gray-600">Happy Customers</p>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">50+</div>
            <p className="text-gray-600">Local Brands</p>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">95%</div>
            <p className="text-gray-600">AR Satisfaction</p>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">4.8★</div>
            <p className="text-gray-600">Average Rating</p>
          </div>
        </div>

        {/* Brand Partners */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Trusted Brand Partners</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {brandPartners.map((brand, index) => (
              <div
                key={index}
                className="flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-300"
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="h-12 object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                  onError={(e) => handleLogoError(e, brand.name)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection; 
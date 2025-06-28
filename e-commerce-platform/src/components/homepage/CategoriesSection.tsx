import { Link } from 'react-router-dom';
import { Card } from '../ui';

const CategoriesSection = () => {
  const categories = [
    {
      id: 'tops',
      name: 'Tops',
      image: 'https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=400&h=300&fit=crop',
      itemCount: '150+',
      description: 'Shirts, blouses, and more',
      fallbackDesign: {
        pattern: `
          <div style="position: absolute; top: 20%; left: 20%; width: 60%; height: 60%; border: 3px solid #3b82f6; border-radius: 15px 15px 5px 5px; background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);"></div>
          <div style="position: absolute; top: 25%; left: 25%; width: 50%; height: 35%; border: 2px solid #2563eb; border-radius: 10px 10px 0 0; background: #eff6ff;"></div>
          <div style="position: absolute; top: 30%; left: 35%; width: 30%; height: 8%; background: #3b82f6; border-radius: 2px;"></div>
        `,
        color: '#3b82f6',
        icon: '👕'
      }
    },
    {
      id: 'bottoms',
      name: 'Bottoms',
      image: 'https://images.unsplash.com/photo-1623399481094-bd31bbfe0cb4?w=400&h=300&fit=crop',
      itemCount: '120+',
      description: 'Jeans, pants, and skirts',
      fallbackDesign: {
        pattern: `
          <div style="position: absolute; top: 25%; left: 30%; width: 40%; height: 50%; border: 3px solid #6366f1; border-radius: 20px 20px 8px 8px; background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);"></div>
          <div style="position: absolute; top: 30%; left: 32%; width: 36%; height: 40%; border: 2px solid #4f46e5; background: #eef2ff;"></div>
          <div style="position: absolute; top: 32%; left: 48%; width: 2px; height: 35%; background: #6366f1;"></div>
        `,
        color: '#6366f1',
        icon: '👖'
      }
    },
    {
      id: 'dresses',
      name: 'Dresses',
      image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=300&fit=crop',
      itemCount: '85+',
      description: 'Casual and formal dresses',
      fallbackDesign: {
        pattern: `
          <div style="position: absolute; top: 20%; left: 25%; width: 50%; height: 15%; border: 3px solid #8b5cf6; border-radius: 25px 25px 0 0; background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);"></div>
          <div style="position: absolute; top: 33%; left: 20%; width: 60%; height: 45%; border: 3px solid #7c3aed; border-radius: 0 0 50px 50px; background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);"></div>
          <div style="position: absolute; top: 27%; left: 47%; width: 6%; height: 20%; background: #8b5cf6;"></div>
        `,
        color: '#8b5cf6',
        icon: '👗'
      }
    },
    {
      id: 'outerwear',
      name: 'Outerwear',
      image: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?w=400&h=300&fit=crop',
      itemCount: '60+',
      description: 'Jackets, coats, and hoodies',
      fallbackDesign: {
        pattern: `
          <div style="position: absolute; top: 15%; left: 15%; width: 70%; height: 70%; border: 4px solid #10b981; border-radius: 20px; background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);"></div>
          <div style="position: absolute; top: 20%; left: 20%; width: 60%; height: 25%; border: 3px solid #059669; border-radius: 15px 15px 0 0; background: #ecfdf5;"></div>
          <div style="position: absolute; top: 25%; left: 78%; width: 8%; height: 8%; border: 2px solid #047857; border-radius: 50%; background: #10b981;"></div>
        `,
        color: '#10b981',
        icon: '🧥'
      }
    },
    {
      id: 'activewear',
      name: 'Activewear',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      itemCount: '75+',
      description: 'Workout gear and athletic wear',
      fallbackDesign: {
        pattern: `
          <div style="position: absolute; top: 20%; left: 20%; width: 60%; height: 60%; border: 3px solid #06b6d4; border-radius: 15px; background: linear-gradient(135deg, #cffafe 0%, #a5f3fc 100%);"></div>
          <div style="position: absolute; top: 25%; left: 25%; width: 50%; height: 25%; border: 2px solid #0891b2; border-radius: 10px; background: #f0fdff;"></div>
          <div style="position: absolute; top: 55%; left: 25%; width: 50%; height: 20%; border: 2px solid #0891b2; border-radius: 0 0 10px 10px; background: #e6fffa;"></div>
        `,
        color: '#06b6d4',
        icon: '🏃‍♀️'
      }
    },
    {
      id: 'accessories',
      name: 'Accessories',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop',
      itemCount: '200+',
      description: 'Bags, jewelry, and more',
      fallbackDesign: {
        pattern: `
          <div style="position: absolute; top: 25%; left: 25%; width: 50%; height: 35%; border: 3px solid #f59e0b; border-radius: 15px 15px 8px 8px; background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);"></div>
          <div style="position: absolute; top: 20%; left: 45%; width: 10%; height: 10%; border: 2px solid #d97706; border-radius: 50% 50% 0 0; background: #f59e0b;"></div>
          <div style="position: absolute; top: 65%; left: 35%; width: 30%; height: 8%; border: 2px solid #d97706; border-radius: 15px; background: #fbbf24;"></div>
        `,
        color: '#f59e0b',
        icon: '👜'
      }
    },
    {
      id: 'shoes',
      name: 'Shoes',
      image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=300&fit=crop',
      itemCount: '90+',
      description: 'Sneakers, boots, and flats',
      fallbackDesign: {
        pattern: `
          <div style="position: absolute; top: 40%; left: 20%; width: 60%; height: 35%; border: 3px solid #ef4444; border-radius: 25px 8px 15px 8px; background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);"></div>
          <div style="position: absolute; top: 45%; left: 25%; width: 50%; height: 20%; border: 2px solid #dc2626; border-radius: 20px 5px 10px 5px; background: #fef2f2;"></div>
          <div style="position: absolute; top: 35%; left: 70%; width: 8%; height: 15%; border: 2px solid #b91c1c; border-radius: 0 0 5px 5px; background: #ef4444;"></div>
        `,
        color: '#ef4444',
        icon: '👠'
      }
    },
    {
      id: 'ar-collection',
      name: 'AR Try-On',
      image: 'https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=400&h=300&fit=crop',
      itemCount: 'Featured',
      description: 'Experience virtual fitting',
      isSpecial: true,
      specialType: 'ar',
      link: '/ar-try-on',
      fallbackDesign: {
        pattern: `
          <div style="position: absolute; top: 25%; left: 25%; width: 50%; height: 50%; border: 3px solid #3b82f6; border-radius: 50%; background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);"></div>
          <div style="position: absolute; top: 35%; left: 35%; width: 30%; height: 30%; border: 2px solid #2563eb; border-radius: 50%; background: #eff6ff;"></div>
          <div style="position: absolute; top: 42%; left: 42%; width: 16%; height: 16%; background: #3b82f6; border-radius: 50%;"></div>
        `,
        color: '#3b82f6',
        icon: '📱'
      }
    }
  ];

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, category: typeof categories[0]) => {
    const target = e.target as HTMLImageElement;
    
    // Try multiple fallback options
    if (target.src.includes('placeholder') || target.src.includes('picsum')) {
      // If placeholder already failed, use meaningful fashion category visualization
      target.style.display = 'none';
      const parent = target.parentElement;
      if (parent) {
        parent.style.background = `linear-gradient(135deg, ${category.fallbackDesign.color}10 0%, ${category.fallbackDesign.color}20 100%)`;
        parent.style.display = 'flex';
        parent.style.alignItems = 'center';
        parent.style.justifyContent = 'center';
        parent.style.position = 'relative';
        parent.innerHTML = `
          <div style="position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
            <!-- Fashion category illustration -->
            <div style="position: relative; width: 120px; height: 120px;">
              ${category.fallbackDesign.pattern}
              
              <!-- Category label -->
              <div style="
                position: absolute;
                bottom: -30px;
                left: 50%;
                transform: translateX(-50%);
                text-align: center;
                color: ${category.fallbackDesign.color};
              ">
                <div style="font-size: 1.5rem; margin-bottom: 0.25rem;">
                  ${category.fallbackDesign.icon}
                </div>
                <div style="font-size: 1rem; font-weight: 600;">
                  ${category.name}
                </div>
              </div>
            </div>
          </div>
        `;
      }
    } else {
      // First try a fashion-related image for this category
      const categoryImageMap: Record<string, string> = {
        'tops': 'https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=400&h=300&fit=crop&auto=format&q=60',
        'bottoms': 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=300&fit=crop&auto=format&q=60',
        'dresses': 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=300&fit=crop&auto=format&q=60',
        'outerwear': 'https://images.unsplash.com/photo-1520975916090-3105956dac38?w=400&h=300&fit=crop&auto=format&q=60',
        'activewear': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&auto=format&q=60',
        'accessories': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop&auto=format&q=60',
        'shoes': 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=300&fit=crop&auto=format&q=60',
        'ar-collection': 'https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=400&h=300&fit=crop&auto=format&q=60'
      };
      
      target.src = categoryImageMap[category.id] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop&auto=format&q=60';
      
      // If that fails too, it will trigger this handler again
      target.onerror = () => {
        target.style.display = 'none';
        const parent = target.parentElement;
        if (parent) {
          parent.style.background = `linear-gradient(135deg, ${category.fallbackDesign.color}10 0%, ${category.fallbackDesign.color}20 100%)`;
          parent.style.display = 'flex';
          parent.style.alignItems = 'center';
          parent.style.justifyContent = 'center';
          parent.style.position = 'relative';
          parent.innerHTML = `
            <div style="position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
              <!-- Fashion category illustration -->
              <div style="position: relative; width: 120px; height: 120px;">
                ${category.fallbackDesign.pattern}
                
                <!-- Category label -->
                <div style="
                  position: absolute;
                  bottom: -30px;
                  left: 50%;
                  transform: translateX(-50%);
                  text-align: center;
                  color: ${category.fallbackDesign.color};
                ">
                  <div style="font-size: 1.5rem; margin-bottom: 0.25rem;">
                    ${category.fallbackDesign.icon}
                  </div>
                  <div style="font-size: 1rem; font-weight: 600;">
                    ${category.name}
                  </div>
                </div>
              </div>
            </div>
          `;
        }
      };
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find exactly what you're looking for across our diverse range of fashion categories
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              to={category.isSpecial ? category.link! : `/products?category=${category.name}`}
            >
              <Card
                className={`group cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  category.isSpecial 
                    ? category.specialType === 'ar' 
                      ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white' 
                      : 'bg-gradient-to-br from-secondary-500 to-secondary-600 text-white'
                    : 'bg-white'
                }`}
                hover
                padding="none"
              >
              <div className={`relative overflow-hidden rounded-t-lg ${category.isSpecial ? 'bg-black/10' : 'bg-gray-100'}`}>
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => handleImageError(e, category)}
                  loading="lazy"
                />
                <div className={`absolute inset-0 ${
                  category.isSpecial 
                    ? 'bg-black bg-opacity-10 group-hover:bg-opacity-20' 
                    : 'bg-black bg-opacity-20 group-hover:bg-opacity-30'
                } transition-all duration-300`} />
                
                {/* Category Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                  <p className="text-sm opacity-90 mb-2">{category.description}</p>
                  <span className={`text-sm font-medium px-2 py-1 rounded ${
                    category.isSpecial 
                      ? 'bg-white bg-opacity-30' 
                      : 'bg-white bg-opacity-20'
                  }`}>
                    {category.itemCount} {category.itemCount === 'Featured' ? '' : 'items'}
                  </span>
                </div>
              </div>
              
              {/* Hover Effect */}
              <div className={`p-4 transition-colors duration-300 ${
                category.isSpecial 
                  ? 'bg-white/10 group-hover:bg-white/20' 
                  : 'bg-white group-hover:bg-primary-50'
              }`}>
                <div className="text-center">
                  <span className={`font-medium group-hover:text-primary-700 ${
                    category.isSpecial ? 'text-white' : 'text-primary-600'
                  }`}>
                    {category.isSpecial ? 'Try Now →' : 'Explore Collection →'}
                  </span>
                </div>
              </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* New Arrivals CTA */}
        <div className="mt-12 text-center">
          <Link to="/products?featured=true">
            <Card
              className="group cursor-pointer transition-all duration-300 hover:shadow-lg bg-gradient-to-r from-secondary-500 to-secondary-600 text-white mx-auto max-w-2xl"
              hover
              padding="lg"
            >
              <div className="flex items-center justify-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">New Arrivals</h3>
                  <p className="text-secondary-100 mb-3">Latest fashion from our partner brands</p>
                  <span className="text-sm font-medium">View All →</span>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection; 
import { useAppStore } from '../../store';
import { Button, Card, Badge } from '../ui';
import { Link, useNavigate } from 'react-router-dom';

const FeaturedBrandsSection = () => {
  const { brands } = useAppStore();
  const navigate = useNavigate();

  // Show only verified brands for featured section
  const featuredBrands = brands.filter(brand => brand.verified).slice(0, 6);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    
    // Try multiple fallback options
    if (target.src.includes('placeholder') || target.src.includes('picsum')) {
      // If placeholder already failed, use meaningful brand showcase fallback
      target.style.display = 'none';
      const parent = target.parentElement;
      if (parent) {
        parent.style.background = 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)';
        parent.style.display = 'flex';
        parent.style.alignItems = 'center';
        parent.style.justifyContent = 'center';
        parent.style.position = 'relative';
        parent.innerHTML = `
          <div style="text-align: center; color: #475569;">
            <!-- Fashion showcase background pattern -->
            <div style="
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background-image: 
                radial-gradient(circle at 25% 25%, #e2e8f0 2px, transparent 2px),
                radial-gradient(circle at 75% 75%, #cbd5e1 1px, transparent 1px);
              background-size: 30px 30px;
              opacity: 0.5;
            "></div>
            
            <!-- Brand showcase content -->
            <div style="position: relative; z-index: 1;">
              <div style="font-size: 2.5rem; margin-bottom: 1rem; color: #3b82f6;">🏪</div>
              <div style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.5rem; color: #1e293b;">
                Brand Showcase
              </div>
              <div style="font-size: 0.85rem; color: #64748b; font-weight: 500;">
                Local Fashion Store
              </div>
            </div>
          </div>
        `;
      }
    } else {
      // First try a fashion-related placeholder
      target.src = `https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop&auto=format&q=60`;
      
      // If that fails too, it will trigger this handler again
      target.onerror = () => {
        target.style.display = 'none';
        const parent = target.parentElement;
        if (parent) {
          parent.style.background = 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)';
          parent.style.display = 'flex';
          parent.style.alignItems = 'center';
          parent.style.justifyContent = 'center';
          parent.style.position = 'relative';
          parent.innerHTML = `
            <div style="text-align: center; color: #475569;">
              <!-- Fashion showcase background pattern -->
              <div style="
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-image: 
                  radial-gradient(circle at 25% 25%, #e2e8f0 2px, transparent 2px),
                  radial-gradient(circle at 75% 75%, #cbd5e1 1px, transparent 1px);
                background-size: 30px 30px;
                opacity: 0.5;
              "></div>
              
              <!-- Brand showcase content -->
              <div style="position: relative; z-index: 1;">
                <div style="font-size: 2.5rem; margin-bottom: 1rem; color: #3b82f6;">🏪</div>
                <div style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.5rem; color: #1e293b;">
                  Brand Showcase
                </div>
                <div style="font-size: 0.85rem; color: #64748b; font-weight: 500;">
                  Local Fashion Store
                </div>
              </div>
            </div>
          `;
        }
      };
    }
  };

  const handleLogoError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    
    if (target.src.includes('placeholder') || target.src.includes('picsum')) {
      // Create meaningful brand logo fallback
      target.style.display = 'none';
      const parent = target.parentElement;
      if (parent) {
        const brandName = target.alt.split(' ')[0] || 'Brand';
        parent.innerHTML = `
          <div style="
            width: 48px; 
            height: 48px; 
            border-radius: 50%; 
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 1.25rem;
            margin-right: 0.75rem;
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
            position: relative;
          ">
            <div style="
              position: absolute;
              inset: 2px;
              border-radius: 50%;
              background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 100%);
            "></div>
            ${brandName.charAt(0).toUpperCase()}
          </div>
        `;
      }
    } else {
      // Try a brand logo placeholder
      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(target.alt.split(' ')[0] || 'Brand')}&background=3b82f6&color=fff&size=48&rounded=true&font-size=0.6`;
      
      target.onerror = () => {
        target.style.display = 'none';
        const parent = target.parentElement;
        if (parent) {
          const brandName = target.alt.split(' ')[0] || 'Brand';
          parent.innerHTML = `
            <div style="
              width: 48px; 
              height: 48px; 
              border-radius: 50%; 
              background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: 1.25rem;
              margin-right: 0.75rem;
              box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
              position: relative;
            ">
              <div style="
                position: absolute;
                inset: 2px;
                border-radius: 50%;
                background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 100%);
              "></div>
              ${brandName.charAt(0).toUpperCase()}
            </div>
          `;
        }
      };
    }
  };

  const handleCardClick = (brandId: string) => {
    navigate(`/brand/${brandId}`);
  };

  const handleShopNowClick = (e: React.MouseEvent, brandId: string) => {
    e.stopPropagation(); // Prevent card click
    navigate(`/brand/${brandId}`);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Local Brands
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover unique fashion from carefully curated local designers and emerging brands
          </p>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredBrands.map((brand) => (
            <Card 
              key={brand.id}
              className="group cursor-pointer transition-all duration-300 hover:shadow-lg"
              hover
              onClick={() => handleCardClick(brand.id)}
            >
              {/* Brand Cover Image */}
              <div className="relative h-48 overflow-hidden rounded-t-lg bg-gray-100">
                <img
                  src={brand.coverImage}
                  alt={`${brand.name} cover`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={handleImageError}
                  loading="lazy"
                />
                {brand.verified && (
                  <Badge 
                    variant="success" 
                    className="absolute top-3 right-3"
                  >
                    Verified
                  </Badge>
                )}
              </div>

              {/* Brand Info */}
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <div className="relative">
                    <img
                      src={brand.logo}
                      alt={`${brand.name} logo`}
                      className="w-12 h-12 rounded-full object-cover mr-3"
                      onError={handleLogoError}
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {brand.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Local Brand
                    </p>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {brand.description}
                </p>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {brand.productCount} products
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    className="group-hover:bg-primary-700"
                    onClick={(e) => handleShopNowClick(e, brand.id)}
                  >
                    Shop Now
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link to="/brands">
            <Button
              variant="outline"
              size="lg"
              className="px-8"
            >
              View All Brands
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedBrandsSection; 
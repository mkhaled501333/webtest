import HeroSection from '../components/homepage/HeroSection';
import FeaturedBrandsSection from '../components/homepage/FeaturedBrandsSection';
import CategoriesSection from '../components/homepage/CategoriesSection';
import NewArrivalsSection from '../components/homepage/NewArrivalsSection';
import ARShowcaseSection from '../components/homepage/ARShowcaseSection';
import NewsletterSection from '../components/homepage/NewsletterSection';
import SocialProofSection from '../components/homepage/SocialProofSection';

const Homepage = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturedBrandsSection />
      <CategoriesSection />
      <NewArrivalsSection />
      <ARShowcaseSection />
      <SocialProofSection />
      <NewsletterSection />
    </div>
  );
};

export default Homepage; 
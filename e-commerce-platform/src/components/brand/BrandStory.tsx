import { 
  CalendarIcon, 
  MapPinIcon, 
  GlobeAltIcon,
  HeartIcon,
  SparklesIcon 
} from '@heroicons/react/24/outline';
import { Card } from '../ui';
import type { Brand } from '../../types';

interface BrandStoryProps {
  brand: Brand;
}

const BrandStory = ({ brand }: BrandStoryProps) => {
  // Mock additional brand story data
  const brandStory = {
    mission: "To create sustainable, high-quality fashion that empowers individuals to express their unique style while caring for our planet.",
    values: [
      { title: "Sustainability", description: "We're committed to eco-friendly practices and materials" },
      { title: "Quality", description: "Every piece is crafted with attention to detail and durability" },
      { title: "Innovation", description: "We embrace new technologies and design approaches" },
      { title: "Community", description: "We believe in supporting local artisans and communities" }
    ],
    milestones: [
      { year: "2020", event: "Brand founded with a vision for sustainable fashion" },
      { year: "2021", event: "Launched first eco-friendly collection" },
      { year: "2022", event: "Reached 10,000 satisfied customers" },
      { year: "2023", event: "Opened flagship store and expanded globally" },
      { year: "2024", event: "Introduced AR try-on technology" }
    ],
    certifications: [
      "GOTS Certified",
      "Fair Trade Approved",
      "Carbon Neutral",
      "B-Corp Certified"
    ]
  };

  return (
    <div className="space-y-8">
      {/* Brand Mission */}
      <Card className="p-8">
        <div className="text-center">
          <SparklesIcon className="w-12 h-12 text-primary-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
            {brandStory.mission}
          </p>
        </div>
      </Card>

      {/* Brand Values */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {brandStory.values.map((value, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <HeartIcon className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Brand Timeline */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Journey</h2>
        <Card className="p-6">
          <div className="space-y-6">
            {brandStory.milestones.map((milestone, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                    <CalendarIcon className="w-5 h-5 text-white" />
                  </div>
                  {index < brandStory.milestones.length - 1 && (
                    <div className="w-px h-8 bg-gray-300 ml-5 mt-2" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold text-primary-600">{milestone.year}</span>
                  </div>
                  <p className="text-gray-700">{milestone.event}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Brand Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Company Info */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <CalendarIcon className="w-5 h-5 text-gray-400" />
              <div>
                <span className="text-gray-600">Founded:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {brand.established || '2020'}
                </span>
              </div>
            </div>
            
            {brand.location && (
              <div className="flex items-center gap-3">
                <MapPinIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <span className="text-gray-600">Location:</span>
                  <span className="ml-2 font-medium text-gray-900">{brand.location}</span>
                </div>
              </div>
            )}

            {brand.website && (
              <div className="flex items-center gap-3">
                <GlobeAltIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <span className="text-gray-600">Website:</span>
                  <a 
                    href={brand.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 font-medium text-primary-600 hover:text-primary-700"
                  >
                    Visit Website
                  </a>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <SparklesIcon className="w-5 h-5 text-gray-400" />
              <div>
                <span className="text-gray-600">Products:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {brand.productCount} items
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Certifications */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Certifications & Awards</h3>
          <div className="space-y-3">
            {brandStory.certifications.map((cert, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                </div>
                <span className="text-gray-700">{cert}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-2">Recent Recognition</h4>
            <p className="text-sm text-gray-600">
              Winner of "Best Sustainable Fashion Brand 2024" by EcoFashion Awards
            </p>
          </div>
        </Card>
      </div>

      {/* Contact & Support */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Get in Touch</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Customer Service</h4>
            <p className="text-sm text-gray-600 mb-2">
              Need help with your order or have questions about our products?
            </p>
            <a href="mailto:support@brand.com" className="text-primary-600 hover:text-primary-700 text-sm">
              support@{brand.name.toLowerCase()}.com
            </a>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Business Inquiries</h4>
            <p className="text-sm text-gray-600 mb-2">
              Interested in partnerships or wholesale opportunities?
            </p>
            <a href="mailto:business@brand.com" className="text-primary-600 hover:text-primary-700 text-sm">
              business@{brand.name.toLowerCase()}.com
            </a>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Press & Media</h4>
            <p className="text-sm text-gray-600 mb-2">
              Media kit and press resources available for journalists.
            </p>
            <a href="mailto:press@brand.com" className="text-primary-600 hover:text-primary-700 text-sm">
              press@{brand.name.toLowerCase()}.com
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BrandStory; 
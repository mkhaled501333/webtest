import { useState, useEffect } from 'react';
import { 
  UserIcon, 
  ScaleIcon, 
  ChartBarIcon, 
  StarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';
import { Button, Badge, Card } from '../ui';
import type { Product } from '../../types';

interface UserMeasurements {
  height: number; // cm
  weight: number; // kg
  chest: number;  // cm
  waist: number;  // cm
  hips: number;   // cm
  shoulders: number; // cm
  inseam: number; // cm
  neck: number;   // cm
  fitPreference: 'tight' | 'fitted' | 'regular' | 'loose' | 'oversized';
  bodyType: 'athletic' | 'slim' | 'regular' | 'full' | 'plus';
}

interface SizeRecommendation {
  sizeId: string;
  sizeName: string;
  confidence: number;
  fitType: 'perfect' | 'good' | 'acceptable' | 'tight' | 'loose';
  reasons: string[];
  measurements: {
    chest?: { recommended: number; actual: number; difference: number };
    waist?: { recommended: number; actual: number; difference: number };
    length?: { recommended: number; actual: number; difference: number };
  };
}

interface SizeRecommendationSystemProps {
  product: Product;
  onSizeSelect: (sizeId: string) => void;
  selectedSizeId?: string;
}

const SizeRecommendationSystem = ({ 
  product, 
  onSizeSelect, 
  selectedSizeId 
}: SizeRecommendationSystemProps) => {
  const [userMeasurements, setUserMeasurements] = useState<UserMeasurements | null>(null);
  const [showMeasurementForm, setShowMeasurementForm] = useState(false);
  const [recommendations, setRecommendations] = useState<SizeRecommendation[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(null);

  // Load user measurements from localStorage or user profile
  useEffect(() => {
    const savedMeasurements = localStorage.getItem('userMeasurements');
    if (savedMeasurements) {
      setUserMeasurements(JSON.parse(savedMeasurements));
    }
  }, []);

  // Generate size recommendations when measurements are available
  useEffect(() => {
    if (userMeasurements) {
      generateRecommendations();
    }
  }, [userMeasurements, product]);

  const generateRecommendations = async () => {
    if (!userMeasurements) return;

    setIsAnalyzing(true);
    
    // Simulate AI analysis delay
    setTimeout(() => {
      const recs = product.sizes.map(size => {
        return analyzeSize(size, userMeasurements);
      }).sort((a, b) => b.confidence - a.confidence);
      
      setRecommendations(recs);
      setIsAnalyzing(false);
    }, 1500);
  };

  const analyzeSize = (size: any, measurements: UserMeasurements): SizeRecommendation => {
    // Simulate size analysis algorithm
    const sizeMap: Record<string, { chest: number; waist: number; length: number }> = {
      'XS': { chest: 84, waist: 68, length: 66 },
      'S': { chest: 88, waist: 72, length: 68 },
      'M': { chest: 92, waist: 76, length: 70 },
      'L': { chest: 96, waist: 80, length: 72 },
      'XL': { chest: 100, waist: 84, length: 74 },
      'XXL': { chest: 104, waist: 88, length: 76 },
    };

    const sizeSpecs = sizeMap[size.name] || sizeMap['M'];
    const category = product.category.toLowerCase();
    
    let confidence = 85;
    const reasons: string[] = [];
    const fitType: SizeRecommendation['fitType'] = 'good';
    
    // Chest analysis
    const chestDiff = Math.abs(measurements.chest - sizeSpecs.chest);
    const waistDiff = Math.abs(measurements.waist - sizeSpecs.waist);
    
    // Adjust confidence based on measurements
    if (chestDiff <= 2) {
      confidence += 10;
      reasons.push('Perfect chest fit');
    } else if (chestDiff <= 4) {
      confidence += 5;
      reasons.push('Good chest fit');
    } else {
      confidence -= chestDiff * 2;
      reasons.push(chestDiff > 0 ? 'Slightly loose in chest' : 'Slightly tight in chest');
    }

    if (waistDiff <= 2) {
      confidence += 8;
      reasons.push('Perfect waist fit');
    } else if (waistDiff <= 4) {
      confidence += 3;
      reasons.push('Good waist fit');
    }

    // Fit preference adjustment
    switch (measurements.fitPreference) {
      case 'tight':
        if (size.name === 'XS' || size.name === 'S') confidence += 5;
        break;
      case 'fitted':
        if (size.name === 'S' || size.name === 'M') confidence += 5;
        break;
      case 'regular':
        if (size.name === 'M' || size.name === 'L') confidence += 5;
        break;
      case 'loose':
        if (size.name === 'L' || size.name === 'XL') confidence += 5;
        break;
      case 'oversized':
        if (size.name === 'XL' || size.name === 'XXL') confidence += 5;
        break;
    }

    // Category-specific adjustments
    if (category.includes('dress') || category.includes('top')) {
      reasons.push('Optimized for upper body fit');
    } else if (category.includes('bottom') || category.includes('jeans')) {
      reasons.push('Waist and hip measurements considered');
    }

    // Brand-specific fit notes
    if (product.brand.name === 'EcoChic') {
      reasons.push('Eco-friendly materials may have different stretch');
    } else if (product.brand.name === 'UrbanEdge') {
      reasons.push('Known for modern, fitted cuts');
    }

    return {
      sizeId: size.id,
      sizeName: size.name,
      confidence: Math.min(Math.max(confidence, 20), 98),
      fitType: confidence > 90 ? 'perfect' : confidence > 80 ? 'good' : confidence > 65 ? 'acceptable' : confidence > 50 ? 'tight' : 'loose',
      reasons: reasons.slice(0, 3),
      measurements: {
        chest: {
          recommended: sizeSpecs.chest,
          actual: measurements.chest,
          difference: measurements.chest - sizeSpecs.chest
        },
        waist: {
          recommended: sizeSpecs.waist,
          actual: measurements.waist,
          difference: measurements.waist - sizeSpecs.waist
        }
      }
    };
  };

  const getFitBadgeColor = (fitType: SizeRecommendation['fitType']) => {
    switch (fitType) {
      case 'perfect': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'acceptable': return 'bg-yellow-100 text-yellow-800';
      case 'tight': return 'bg-orange-100 text-orange-800';
      case 'loose': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFitIcon = (fitType: SizeRecommendation['fitType']) => {
    switch (fitType) {
      case 'perfect': return <CheckCircleIcon className="w-4 h-4" />;
      case 'good': return <StarIcon className="w-4 h-4" />;
      case 'acceptable': return <InformationCircleIcon className="w-4 h-4" />;
      case 'tight': return <ArrowDownIcon className="w-4 h-4" />;
      case 'loose': return <ArrowUpIcon className="w-4 h-4" />;
      default: return <InformationCircleIcon className="w-4 h-4" />;
    }
  };

  const handleMeasurementSubmit = (measurements: UserMeasurements) => {
    setUserMeasurements(measurements);
    localStorage.setItem('userMeasurements', JSON.stringify(measurements));
    setShowMeasurementForm(false);
  };

  if (!userMeasurements) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserIcon className="w-8 h-8 text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Get Your Perfect Size
          </h3>
          <p className="text-gray-600 mb-6">
            Add your measurements to get AI-powered size recommendations with 95% accuracy
          </p>
          <Button onClick={() => setShowMeasurementForm(true)} className="mb-4">
            Add My Measurements
          </Button>
          <p className="text-xs text-gray-500">
            Your measurements are stored locally and never shared
          </p>
        </div>

        {showMeasurementForm && (
          <MeasurementForm
            onSubmit={handleMeasurementSubmit}
            onCancel={() => setShowMeasurementForm(false)}
          />
        )}
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Size Recommendations</h3>
          <p className="text-sm text-gray-600">
            Powered by AI • Based on your measurements
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowMeasurementForm(true)}
        >
          Update Profile
        </Button>
      </div>

      {/* Analysis Status */}
      {isAnalyzing && (
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary-200 border-t-primary-600"></div>
            <div>
              <p className="font-medium text-gray-900">Analyzing Your Fit</p>
              <p className="text-sm text-gray-600">
                Processing measurements and fabric properties...
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="space-y-3">
          {recommendations.map((rec, index) => (
            <Card 
              key={rec.sizeId}
              className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                selectedSizeId === rec.sizeId 
                  ? 'ring-2 ring-primary-500 bg-primary-50' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => onSizeSelect(rec.sizeId)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-gray-900">
                      {rec.sizeName}
                    </span>
                    {index === 0 && (
                      <Badge variant="primary" className="text-xs">
                        RECOMMENDED
                      </Badge>
                    )}
                  </div>
                  
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getFitBadgeColor(rec.fitType)}`}>
                    {getFitIcon(rec.fitType)}
                    {rec.fitType.charAt(0).toUpperCase() + rec.fitType.slice(1)} Fit
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <ChartBarIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">
                      {rec.confidence}% match
                    </span>
                  </div>
                  <div className="w-16 bg-gray-200 rounded-full h-1.5 mt-1">
                    <div 
                      className={`h-1.5 rounded-full ${
                        rec.confidence > 90 ? 'bg-green-500' :
                        rec.confidence > 80 ? 'bg-blue-500' :
                        rec.confidence > 65 ? 'bg-yellow-500' :
                        'bg-orange-500'
                      }`}
                      style={{ width: `${rec.confidence}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  {rec.reasons.map((reason, reasonIndex) => (
                    <span 
                      key={reasonIndex}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                    >
                      <CheckCircleIcon className="w-3 h-3" />
                      {reason}
                    </span>
                  ))}
                </div>

                {/* Measurement Details */}
                <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-gray-100">
                  {rec.measurements.chest && (
                    <div className="text-xs">
                      <span className="text-gray-500">Chest: </span>
                      <span className="font-medium">
                        {rec.measurements.chest.recommended}cm 
                        <span className={`ml-1 ${
                          Math.abs(rec.measurements.chest.difference) <= 2 
                            ? 'text-green-600' 
                            : 'text-orange-600'
                        }`}>
                          ({rec.measurements.chest.difference > 0 ? '+' : ''}{rec.measurements.chest.difference}cm)
                        </span>
                      </span>
                    </div>
                  )}
                  
                  {rec.measurements.waist && (
                    <div className="text-xs">
                      <span className="text-gray-500">Waist: </span>
                      <span className="font-medium">
                        {rec.measurements.waist.recommended}cm
                        <span className={`ml-1 ${
                          Math.abs(rec.measurements.waist.difference) <= 2 
                            ? 'text-green-600' 
                            : 'text-orange-600'
                        }`}>
                          ({rec.measurements.waist.difference > 0 ? '+' : ''}{rec.measurements.waist.difference}cm)
                        </span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Size Guide Link */}
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-center gap-3">
          <ScaleIcon className="w-6 h-6 text-blue-600" />
          <div className="flex-1">
            <h4 className="font-medium text-blue-900">Not sure about your measurements?</h4>
            <p className="text-sm text-blue-700">
              View our detailed size guide and measuring instructions
            </p>
          </div>
          <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-100">
            Size Guide
          </Button>
        </div>
      </Card>

      {showMeasurementForm && (
        <MeasurementForm
          initialData={userMeasurements}
          onSubmit={handleMeasurementSubmit}
          onCancel={() => setShowMeasurementForm(false)}
        />
      )}
    </div>
  );
};

// Measurement Form Component
interface MeasurementFormProps {
  initialData?: UserMeasurements;
  onSubmit: (measurements: UserMeasurements) => void;
  onCancel: () => void;
}

const MeasurementForm = ({ initialData, onSubmit, onCancel }: MeasurementFormProps) => {
  const [measurements, setMeasurements] = useState<UserMeasurements>(
    initialData || {
      height: 170,
      weight: 65,
      chest: 88,
      waist: 74,
      hips: 94,
      shoulders: 40,
      inseam: 76,
      neck: 36,
      fitPreference: 'regular',
      bodyType: 'regular'
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(measurements);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Your Measurements
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Measurements */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={measurements.height}
                  onChange={(e) => setMeasurements(prev => ({ ...prev, height: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  min="140"
                  max="220"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  value={measurements.weight}
                  onChange={(e) => setMeasurements(prev => ({ ...prev, weight: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  min="40"
                  max="150"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chest (cm)
                </label>
                <input
                  type="number"
                  value={measurements.chest}
                  onChange={(e) => setMeasurements(prev => ({ ...prev, chest: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  min="70"
                  max="130"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Waist (cm)
                </label>
                <input
                  type="number"
                  value={measurements.waist}
                  onChange={(e) => setMeasurements(prev => ({ ...prev, waist: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  min="60"
                  max="120"
                />
              </div>
            </div>

            {/* Fit Preferences */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Fit
                </label>
                <select
                  value={measurements.fitPreference}
                  onChange={(e) => setMeasurements(prev => ({ 
                    ...prev, 
                    fitPreference: e.target.value as UserMeasurements['fitPreference']
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="tight">Tight - Form-fitting</option>
                  <option value="fitted">Fitted - Close to body</option>
                  <option value="regular">Regular - Comfortable fit</option>
                  <option value="loose">Loose - Relaxed fit</option>
                  <option value="oversized">Oversized - Very loose</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Body Type
                </label>
                <select
                  value={measurements.bodyType}
                  onChange={(e) => setMeasurements(prev => ({ 
                    ...prev, 
                    bodyType: e.target.value as UserMeasurements['bodyType']
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="athletic">Athletic</option>
                  <option value="slim">Slim</option>
                  <option value="regular">Regular</option>
                  <option value="full">Full</option>
                  <option value="plus">Plus</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                Save Measurements
              </Button>
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default SizeRecommendationSystem; 
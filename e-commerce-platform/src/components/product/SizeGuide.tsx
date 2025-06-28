import { XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '../ui';

interface SizeGuideProps {
  category: string;
  onClose: () => void;
}

const SizeGuide = ({ category, onClose }: SizeGuideProps) => {
  const getSizeData = (category: string) => {
    const sizeData: Record<string, any> = {
      'T-Shirts': {
        measurements: ['Chest', 'Length', 'Shoulder'],
        sizes: [
          { size: 'XS', chest: '32-34"', length: '26"', shoulder: '15"' },
          { size: 'S', chest: '34-36"', length: '27"', shoulder: '16"' },
          { size: 'M', chest: '36-38"', length: '28"', shoulder: '17"' },
          { size: 'L', chest: '38-40"', length: '29"', shoulder: '18"' },
          { size: 'XL', chest: '40-42"', length: '30"', shoulder: '19"' },
          { size: 'XXL', chest: '42-44"', length: '31"', shoulder: '20"' }
        ]
      },
      'Pants': {
        measurements: ['Waist', 'Inseam', 'Hip'],
        sizes: [
          { size: '28', waist: '28"', inseam: '30"', hip: '36"' },
          { size: '30', waist: '30"', inseam: '30"', hip: '38"' },
          { size: '32', waist: '32"', inseam: '32"', hip: '40"' },
          { size: '34', waist: '34"', inseam: '32"', hip: '42"' },
          { size: '36', waist: '36"', inseam: '34"', hip: '44"' },
          { size: '38', waist: '38"', inseam: '34"', hip: '46"' }
        ]
      },
      'Dresses': {
        measurements: ['Bust', 'Waist', 'Hip', 'Length'],
        sizes: [
          { size: 'XS', bust: '32"', waist: '24"', hip: '34"', length: '35"' },
          { size: 'S', bust: '34"', waist: '26"', hip: '36"', length: '36"' },
          { size: 'M', bust: '36"', waist: '28"', hip: '38"', length: '37"' },
          { size: 'L', bust: '38"', waist: '30"', hip: '40"', length: '38"' },
          { size: 'XL', bust: '40"', waist: '32"', hip: '42"', length: '39"' },
          { size: 'XXL', bust: '42"', waist: '34"', hip: '44"', length: '40"' }
        ]
      }
    };

    return sizeData[category] || sizeData['T-Shirts']; // Default to T-Shirts if category not found
  };

  const data = getSizeData(category);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Size Guide - {category}</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* How to Measure Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">How to Measure</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {data.measurements.map((measurement: string, index: number) => (
                  <div key={measurement} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{measurement}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {getMeasurementInstructions(measurement)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Measurement Illustration */}
              <div className="bg-gray-50 rounded-lg p-6 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-40 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">Measurement<br/>Illustration</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Use a soft measuring tape and measure over light clothing
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Size Chart */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Size Chart</h3>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left font-medium text-gray-900 border-b border-gray-200">
                      Size
                    </th>
                    {data.measurements.map((measurement: string) => (
                      <th key={measurement} className="px-4 py-3 text-left font-medium text-gray-900 border-b border-gray-200">
                        {measurement}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.sizes.map((sizeData: any, index: number) => (
                    <tr key={sizeData.size} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-3 font-medium text-gray-900 border-b border-gray-200">
                        {sizeData.size}
                      </td>
                      {data.measurements.map((measurement: string) => (
                        <td key={measurement} className="px-4 py-3 text-gray-600 border-b border-gray-200">
                          {sizeData[measurement.toLowerCase()]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Fit Guide */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Fit Guide</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Relaxed Fit</h4>
                <p className="text-sm text-blue-800">
                  Loose and comfortable with extra room for movement
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-2">Regular Fit</h4>
                <p className="text-sm text-green-800">
                  Classic fit that's not too tight or too loose
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-medium text-purple-900 mb-2">Slim Fit</h4>
                <p className="text-sm text-purple-800">
                  Tailored fit that follows your body shape closely
                </p>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-yellow-50 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-yellow-900 mb-2">💡 Pro Tips</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Measure yourself without clothes for accuracy</li>
              <li>• If between sizes, consider the fit style you prefer</li>
              <li>• Check the product description for specific fit notes</li>
              <li>• Contact our support team if you need help choosing</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="primary" className="flex-1" onClick={onClose}>
              Got it, thanks!
            </Button>
            <Button variant="outline" className="flex-1">
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get measurement instructions
const getMeasurementInstructions = (measurement: string): string => {
  const instructions: Record<string, string> = {
    'Chest': 'Measure around the fullest part of your chest, keeping the tape level',
    'Bust': 'Measure around the fullest part of your bust, keeping the tape level',
    'Waist': 'Measure around your natural waistline, typically the narrowest part',
    'Hip': 'Measure around the fullest part of your hips',
    'Length': 'Measure from the highest point of the shoulder to the desired length',
    'Shoulder': 'Measure from shoulder point to shoulder point across the back',
    'Inseam': 'Measure from the crotch to the bottom of the leg'
  };

  return instructions[measurement] || 'Follow standard measuring guidelines';
};

export default SizeGuide; 
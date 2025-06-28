import { useState } from 'react';
import { 
  CreditCardIcon, 
  DevicePhoneMobileIcon,
  ComputerDesktopIcon 
} from '@heroicons/react/24/outline';
import { Input } from '../ui';

interface PaymentInfo {
  method: 'card' | 'paypal' | 'apple_pay' | 'google_pay';
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  nameOnCard: string;
}

interface PaymentMethodsProps {
  paymentInfo: PaymentInfo;
  setPaymentInfo: (info: PaymentInfo) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const PaymentMethods = ({ paymentInfo, setPaymentInfo, onSubmit }: PaymentMethodsProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + (v.length > 2 ? '/' + v.substring(2, 4) : '');
    }
    return v;
  };

  const validateCard = () => {
    const newErrors: Record<string, string> = {};

    if (!paymentInfo.nameOnCard.trim()) {
      newErrors.nameOnCard = 'Name on card is required';
    }

    if (!paymentInfo.cardNumber.replace(/\s/g, '')) {
      newErrors.cardNumber = 'Card number is required';
    } else if (paymentInfo.cardNumber.replace(/\s/g, '').length < 16) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }

    if (!paymentInfo.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(paymentInfo.expiryDate)) {
      newErrors.expiryDate = 'Invalid expiry date format';
    }

    if (!paymentInfo.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (paymentInfo.cvv.length < 3) {
      newErrors.cvv = 'CVV must be 3-4 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentInfo.method === 'card' && !validateCard()) {
      return;
    }
    onSubmit(e);
  };

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit Card',
      icon: CreditCardIcon,
      description: 'Visa, Mastercard, American Express'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: ComputerDesktopIcon,
      description: 'Pay with your PayPal account'
    },
    {
      id: 'apple_pay',
      name: 'Apple Pay',
      icon: DevicePhoneMobileIcon,
      description: 'Touch ID or Face ID required'
    },
    {
      id: 'google_pay',
      name: 'Google Pay',
      icon: DevicePhoneMobileIcon,
      description: 'Pay with Google'
    }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Method Selection */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-4">Select Payment Method</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {paymentMethods.map((method) => {
            const IconComponent = method.icon;
            return (
              <label
                key={method.id}
                className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                  paymentInfo.method === method.id
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={paymentInfo.method === method.id}
                  onChange={(e) => setPaymentInfo({...paymentInfo, method: e.target.value as any})}
                  className="sr-only"
                />
                <IconComponent className="w-6 h-6 text-gray-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">{method.name}</p>
                  <p className="text-sm text-gray-600">{method.description}</p>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Credit Card Form */}
      {paymentInfo.method === 'card' && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-900">Credit Card Information</h3>
          
          <Input
            label="Name on Card"
            required
            value={paymentInfo.nameOnCard}
            onChange={(e) => setPaymentInfo({...paymentInfo, nameOnCard: e.target.value})}
            error={errors.nameOnCard}
            placeholder="John Doe"
          />

          <Input
            label="Card Number"
            required
            value={paymentInfo.cardNumber}
            onChange={(e) => setPaymentInfo({
              ...paymentInfo, 
              cardNumber: formatCardNumber(e.target.value)
            })}
            error={errors.cardNumber}
            placeholder="1234 5678 9012 3456"
            maxLength={19}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Expiry Date"
              required
              value={paymentInfo.expiryDate}
              onChange={(e) => setPaymentInfo({
                ...paymentInfo, 
                expiryDate: formatExpiryDate(e.target.value)
              })}
              error={errors.expiryDate}
              placeholder="MM/YY"
              maxLength={5}
            />

            <Input
              label="CVV"
              required
              value={paymentInfo.cvv}
              onChange={(e) => setPaymentInfo({
                ...paymentInfo, 
                cvv: e.target.value.replace(/\D/g, '').substring(0, 4)
              })}
              error={errors.cvv}
              placeholder="123"
              maxLength={4}
            />
          </div>

          {/* Card Security Features */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>Your payment information is encrypted and secure</span>
            </div>
            <div className="flex items-center gap-4 mt-2">
              {/* Visa Logo SVG */}
              <div className="h-6 w-10 flex items-center">
                <svg viewBox="0 0 40 25" className="h-full w-full">
                  <rect width="40" height="25" rx="4" fill="#1434CB"/>
                  <text x="20" y="17" textAnchor="middle" fill="white" fontSize="8" fontFamily="Arial, sans-serif" fontWeight="bold">VISA</text>
                </svg>
              </div>
              
              {/* Mastercard Logo SVG */}
              <div className="h-6 w-10 flex items-center">
                <svg viewBox="0 0 40 25" className="h-full w-full">
                  <rect width="40" height="25" rx="4" fill="#EB001B"/>
                  <circle cx="15" cy="12.5" r="6" fill="#FF5F00"/>
                  <circle cx="25" cy="12.5" r="6" fill="#F79E1B"/>
                </svg>
              </div>
              
              {/* American Express Logo SVG */}
              <div className="h-6 w-10 flex items-center">
                <svg viewBox="0 0 40 25" className="h-full w-full">
                  <rect width="40" height="25" rx="4" fill="#006FCF"/>
                  <text x="20" y="17" textAnchor="middle" fill="white" fontSize="5" fontFamily="Arial, sans-serif" fontWeight="bold">AMEX</text>
                </svg>
              </div>
              
              {/* Discover Logo SVG */}
              <div className="h-6 w-10 flex items-center">
                <svg viewBox="0 0 40 25" className="h-full w-full">
                  <rect width="40" height="25" rx="4" fill="#FF6000"/>
                  <text x="20" y="17" textAnchor="middle" fill="white" fontSize="5" fontFamily="Arial, sans-serif" fontWeight="bold">DISCOVER</text>
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alternative Payment Methods */}
      {paymentInfo.method === 'paypal' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            {/* PayPal Logo SVG */}
            <div className="h-8 w-24 flex items-center">
              <svg viewBox="0 0 100 40" className="h-full w-full">
                <rect width="100" height="40" rx="6" fill="#0070BA"/>
                <text x="15" y="16" fill="white" fontSize="8" fontFamily="Arial, sans-serif" fontWeight="bold">Pay</text>
                <text x="15" y="28" fill="white" fontSize="8" fontFamily="Arial, sans-serif" fontWeight="bold">Pal</text>
                <path d="M40 10 L50 10 Q55 10 55 15 Q55 20 50 20 L45 20 L47 30 L42 30 L40 10" fill="#009CDE"/>
                <path d="M50 10 L60 10 Q65 10 65 15 Q65 20 60 20 L55 20 L57 30 L52 30 L50 10" fill="#012169"/>
              </svg>
            </div>
            <div>
              <p className="font-medium text-blue-900">Pay with PayPal</p>
              <p className="text-sm text-blue-700">You'll be redirected to PayPal to complete your payment</p>
            </div>
          </div>
        </div>
      )}

      {paymentInfo.method === 'apple_pay' && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-8 bg-black rounded flex items-center justify-center">
              <span className="text-white text-xs font-medium">Pay</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">Apple Pay</p>
              <p className="text-sm text-gray-600">Use Touch ID or Face ID to pay with Apple Pay</p>
            </div>
          </div>
        </div>
      )}

      {paymentInfo.method === 'google_pay' && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            {/* Google Pay Logo SVG */}
            <div className="h-8 w-20 flex items-center">
              <svg viewBox="0 0 80 32" className="h-full w-full">
                <rect width="80" height="32" rx="4" fill="white" stroke="#dadce0"/>
                <circle cx="12" cy="16" r="4" fill="#4285F4"/>
                <circle cx="20" cy="16" r="4" fill="#EA4335"/>
                <circle cx="28" cy="16" r="4" fill="#FBBC04"/>
                <circle cx="36" cy="16" r="4" fill="#34A853"/>
                <text x="45" y="20" fill="#5f6368" fontSize="8" fontFamily="Arial, sans-serif">Pay</text>
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900">Google Pay</p>
              <p className="text-sm text-gray-600">Pay quickly and securely with Google Pay</p>
            </div>
          </div>
        </div>
      )}

      {/* Billing Address Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> Your billing address will be the same as your shipping address. 
          If you need a different billing address, please contact customer support.
        </p>
      </div>
    </form>
  );
};

export default PaymentMethods; 
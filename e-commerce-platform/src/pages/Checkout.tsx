import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCardIcon, 
  TruckIcon, 
  ShieldCheckIcon,
  ChevronLeftIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { Button, Input, Card } from '../components/ui';
import OrderSummary from '../components/checkout/OrderSummary';
import PaymentMethods from '../components/checkout/PaymentMethods';
import { useAppStore } from '../store';

interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentInfo {
  method: 'card' | 'paypal' | 'apple_pay' | 'google_pay';
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  nameOnCard: string;
}

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useAppStore();

  const [currentStep, setCurrentStep] = useState<'shipping' | 'payment' | 'review'>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  });

  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    method: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  });

  const [selectedShipping, setSelectedShipping] = useState<'standard' | 'express' | 'overnight'>('standard');

  // Redirect if cart is empty
  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some items to proceed with checkout.</p>
          <Button onClick={() => navigate('/products')}>
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  const shippingOptions = {
    standard: { name: 'Standard Shipping', price: 0, time: '5-7 business days' },
    express: { name: 'Express Shipping', price: 9.99, time: '2-3 business days' },
    overnight: { name: 'Overnight Shipping', price: 24.99, time: '1 business day' }
  };

  const subtotal = cart.totalPrice;
  const shippingCost = subtotal >= 75 && selectedShipping === 'standard' ? 0 : shippingOptions[selectedShipping].price;
  const tax = subtotal * 0.08; // 8% tax rate
  const total = subtotal + shippingCost + tax;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep('payment');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep('review');
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    // Simulate order processing
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // In a real app, this would call your payment API
      console.log('Order placed:', { shippingAddress, paymentInfo, cart, total });
      
      clearCart();
      navigate('/order-confirmation', { 
        state: { orderNumber: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase() }
      });
    } catch (error) {
      console.error('Order failed:', error);
      alert('Order failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const steps = [
    { id: 'shipping', name: 'Shipping', completed: currentStep !== 'shipping' },
    { id: 'payment', name: 'Payment', completed: currentStep === 'review' },
    { id: 'review', name: 'Review', completed: false }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/products')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <ChevronLeftIcon className="w-5 h-5" />
              Continue Shopping
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <nav className="flex items-center justify-center">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    step.completed 
                      ? 'bg-primary-600 border-primary-600 text-white' 
                      : currentStep === step.id
                      ? 'border-primary-600 text-primary-600'
                      : 'border-gray-300 text-gray-400'
                  }`}>
                    {step.completed ? (
                      <CheckIcon className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    currentStep === step.id ? 'text-primary-600' : 'text-gray-500'
                  }`}>
                    {step.name}
                  </span>
                  {index < steps.length - 1 && (
                    <div className="w-12 h-px bg-gray-300 mx-4" />
                  )}
                </div>
              ))}
            </nav>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {currentStep === 'shipping' && (
                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <TruckIcon className="w-6 h-6" />
                    Shipping Information
                  </h2>
                  
                  <form onSubmit={handleShippingSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="First Name"
                        required
                        value={shippingAddress.firstName}
                        onChange={(e) => setShippingAddress({...shippingAddress, firstName: e.target.value})}
                      />
                      <Input
                        label="Last Name"
                        required
                        value={shippingAddress.lastName}
                        onChange={(e) => setShippingAddress({...shippingAddress, lastName: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Email"
                        type="email"
                        required
                        value={shippingAddress.email}
                        onChange={(e) => setShippingAddress({...shippingAddress, email: e.target.value})}
                      />
                      <Input
                        label="Phone"
                        type="tel"
                        required
                        value={shippingAddress.phone}
                        onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
                      />
                    </div>

                    <Input
                      label="Address"
                      required
                      value={shippingAddress.address}
                      onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        label="Apartment/Suite (optional)"
                        value={shippingAddress.apartment}
                        onChange={(e) => setShippingAddress({...shippingAddress, apartment: e.target.value})}
                      />
                      <Input
                        label="City"
                        required
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                      />
                      <Input
                        label="ZIP Code"
                        required
                        value={shippingAddress.zipCode}
                        onChange={(e) => setShippingAddress({...shippingAddress, zipCode: e.target.value})}
                      />
                    </div>

                    {/* Shipping Options */}
                    <div className="mt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Options</h3>
                      <div className="space-y-3">
                        {Object.entries(shippingOptions).map(([key, option]) => (
                          <label
                            key={key}
                            className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                              selectedShipping === key 
                                ? 'border-primary-600 bg-primary-50' 
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <div className="flex items-center">
                              <input
                                type="radio"
                                name="shipping"
                                value={key}
                                checked={selectedShipping === key}
                                onChange={(e) => setSelectedShipping(e.target.value as any)}
                                className="mr-3"
                              />
                              <div>
                                <p className="font-medium text-gray-900">{option.name}</p>
                                <p className="text-sm text-gray-600">{option.time}</p>
                              </div>
                            </div>
                            <span className="font-semibold text-gray-900">
                              {option.price === 0 ? 'Free' : `$${option.price.toFixed(2)}`}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <Button type="submit" variant="primary" size="lg" className="w-full mt-6">
                      Continue to Payment
                    </Button>
                  </form>
                </Card>
              )}

              {currentStep === 'payment' && (
                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <CreditCardIcon className="w-6 h-6" />
                    Payment Information
                  </h2>

                  <PaymentMethods 
                    paymentInfo={paymentInfo}
                    setPaymentInfo={setPaymentInfo}
                    onSubmit={handlePaymentSubmit}
                  />

                  <div className="flex gap-3 mt-6">
                    <Button 
                      variant="outline" 
                      onClick={() => setCurrentStep('shipping')}
                      className="flex-1"
                    >
                      Back to Shipping
                    </Button>
                    <Button 
                      type="submit" 
                      variant="primary" 
                      className="flex-1"
                      onClick={handlePaymentSubmit}
                    >
                      Review Order
                    </Button>
                  </div>
                </Card>
              )}

              {currentStep === 'review' && (
                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <ShieldCheckIcon className="w-6 h-6" />
                    Review Your Order
                  </h2>

                  {/* Order Summary for Review */}
                  <div className="space-y-6">
                    {/* Shipping Address */}
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Shipping Address</h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>{shippingAddress.firstName} {shippingAddress.lastName}</p>
                        <p>{shippingAddress.address}</p>
                        {shippingAddress.apartment && <p>{shippingAddress.apartment}</p>}
                        <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}</p>
                        <p>{shippingAddress.email}</p>
                        <p>{shippingAddress.phone}</p>
                      </div>
                      <button 
                        onClick={() => setCurrentStep('shipping')}
                        className="text-primary-600 hover:text-primary-700 text-sm mt-2"
                      >
                        Edit
                      </button>
                    </div>

                    {/* Payment Method */}
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Payment Method</h3>
                      <div className="text-sm text-gray-600">
                        <p>
                          {paymentInfo.method === 'card' ? 'Credit Card' : 
                           paymentInfo.method === 'paypal' ? 'PayPal' :
                           paymentInfo.method === 'apple_pay' ? 'Apple Pay' : 'Google Pay'}
                        </p>
                        {paymentInfo.method === 'card' && (
                          <p>**** **** **** {paymentInfo.cardNumber.slice(-4)}</p>
                        )}
                      </div>
                      <button 
                        onClick={() => setCurrentStep('payment')}
                        className="text-primary-600 hover:text-primary-700 text-sm mt-2"
                      >
                        Edit
                      </button>
                    </div>

                    {/* Shipping Method */}
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Shipping Method</h3>
                      <div className="text-sm text-gray-600">
                        <p>{shippingOptions[selectedShipping].name}</p>
                        <p>{shippingOptions[selectedShipping].time}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-8">
                    <Button 
                      variant="outline" 
                      onClick={() => setCurrentStep('payment')}
                      className="flex-1"
                    >
                      Back to Payment
                    </Button>
                    <Button 
                      variant="primary" 
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                      className="flex-1"
                    >
                      {isProcessing ? 'Processing...' : `Place Order - $${total.toFixed(2)}`}
                    </Button>
                  </div>
                </Card>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <OrderSummary 
                cart={cart}
                shippingCost={shippingCost}
                tax={tax}
                total={total}
                selectedShipping={selectedShipping}
              />
            </div>
          </div>
        </div>
      </div>
  );
};

export default Checkout; 
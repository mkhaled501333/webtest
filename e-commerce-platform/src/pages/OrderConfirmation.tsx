import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  CheckCircleIcon,
  TruckIcon,
  EnvelopeIcon,
  ArrowDownTrayIcon,
  ChatBubbleLeftEllipsisIcon
} from '@heroicons/react/24/solid';
import { Button, Card } from '../components/ui';
const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderNumber = location.state?.orderNumber;

  useEffect(() => {
    // Redirect if no order number (user accessed directly)
    if (!orderNumber) {
      navigate('/');
    }
  }, [orderNumber, navigate]);

  if (!orderNumber) {
    return null;
  }

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

  return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircleIcon className="w-12 h-12 text-green-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Order Confirmed!
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              Thank you for your purchase. Your order has been received and is being processed.
            </p>
            <p className="text-sm text-gray-500">
              Order confirmation sent to your email address
            </p>
          </div>

          {/* Order Summary Card */}
          <Card className="p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Order Details</h2>
                <p className="text-gray-600">Order #{orderNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Order Date</p>
                <p className="font-medium text-gray-900">
                  {new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            {/* Order Status Timeline */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <CheckCircleIcon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Order Confirmed</p>
                  <p className="text-sm text-gray-600">We've received your order and payment</p>
                </div>
                <span className="text-sm text-gray-500">Just now</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="w-3 h-3 bg-white rounded-full"></span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Processing</p>
                  <p className="text-sm text-gray-600">We're preparing your items for shipment</p>
                </div>
                <span className="text-sm text-gray-500">1-2 business days</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <TruckIcon className="w-5 h-5 text-gray-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Shipped</p>
                  <p className="text-sm text-gray-600">Your order is on its way</p>
                </div>
                <span className="text-sm text-gray-500">3-5 business days</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="w-3 h-3 bg-gray-500 rounded-full"></span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Delivered</p>
                  <p className="text-sm text-gray-600">Estimated delivery date</p>
                </div>
                <span className="text-sm text-gray-500">
                  {estimatedDelivery.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TruckIcon className="w-5 h-5 text-blue-600" />
                <h3 className="font-medium text-blue-900">Estimated Delivery</h3>
              </div>
              <p className="text-blue-800">
                {estimatedDelivery.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <p className="text-sm text-blue-600 mt-1">
                You'll receive tracking information via email once your order ships
              </p>
            </div>
          </Card>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Track Order */}
            <Card className="p-6 text-center">
              <TruckIcon className="w-8 h-8 text-primary-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Track Your Order</h3>
              <p className="text-sm text-gray-600 mb-4">
                Monitor your order status and delivery progress
              </p>
              <Button variant="outline" className="w-full">
                Track Order
              </Button>
            </Card>

            {/* Download Invoice */}
            <Card className="p-6 text-center">
              <ArrowDownTrayIcon className="w-8 h-8 text-primary-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Download Invoice</h3>
              <p className="text-sm text-gray-600 mb-4">
                Get a copy of your purchase receipt
              </p>
              <Button variant="outline" className="w-full">
                Download PDF
              </Button>
            </Card>
          </div>

          {/* What's Next */}
          <Card className="p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">What happens next?</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <EnvelopeIcon className="w-5 h-5 text-green-600 mt-1" />
                <div>
                  <p className="font-medium text-gray-900">Email Confirmation</p>
                  <p className="text-sm text-gray-600">
                    You'll receive an order confirmation email with your receipt
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <TruckIcon className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <p className="font-medium text-gray-900">Processing & Shipping</p>
                  <p className="text-sm text-gray-600">
                    We'll prepare your items and send shipping notification with tracking details
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ChatBubbleLeftEllipsisIcon className="w-5 h-5 text-purple-600 mt-1" />
                <div>
                  <p className="font-medium text-gray-900">Customer Support</p>
                  <p className="text-sm text-gray-600">
                    Have questions? Our support team is here to help 24/7
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Continue Shopping */}
          <div className="text-center space-y-4">
            <div className="flex gap-4 justify-center">
              <Link to="/products">
                <Button variant="primary">Continue Shopping</Button>
              </Link>
              <Link to="/">
                <Button variant="outline">Back to Home</Button>
              </Link>
            </div>
            
            <p className="text-sm text-gray-600">
              Need help? <Link to="/contact" className="text-primary-600 hover:text-primary-700">Contact our support team</Link>
            </p>
          </div>

          {/* Thank You Message */}
          <div className="text-center mt-12 p-6 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Thank you for choosing our platform! 🎉
            </h3>
            <p className="text-gray-600">
              We're excited to be part of your fashion journey and can't wait for you to try our AR technology!
            </p>
          </div>
        </div>
      </div>
  );
};

export default OrderConfirmation; 
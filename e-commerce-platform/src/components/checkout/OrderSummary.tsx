import { Link } from 'react-router-dom';
import { Card } from '../ui';
import type { Cart } from '../../types';

interface OrderSummaryProps {
  cart: Cart;
  shippingCost: number;
  tax: number;
  total: number;
  selectedShipping: string;
}

const OrderSummary = ({ cart, shippingCost, tax, total, selectedShipping }: OrderSummaryProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <Card className="p-6 sticky top-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h3>
      
      {/* Cart Items */}
      <div className="space-y-4 mb-6">
        {cart.items.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div className="relative flex-shrink-0">
              <img
                src={item.product.images[0]}
                alt={item.product.name}
                className="w-16 h-16 object-cover rounded-lg border border-gray-200"
              />
              <div className="absolute -top-2 -right-2 w-5 h-5 bg-gray-900 text-white text-xs rounded-full flex items-center justify-center">
                {item.quantity}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <Link 
                to={`/product/${item.product.id}`}
                className="font-medium text-gray-900 hover:text-primary-600 transition-colors line-clamp-2"
              >
                {item.product.name}
              </Link>
              <p className="text-sm text-gray-600">{item.product.brand.name}</p>
              <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                <div className="flex items-center gap-1">
                  <div 
                    className="w-3 h-3 rounded-full border border-gray-300"
                    style={{ backgroundColor: item.selectedColor.hex }}
                  />
                  <span>{item.selectedColor.name}</span>
                </div>
                <span>Size {item.selectedSize.name}</span>
              </div>
              <p className="font-semibold text-gray-900 mt-1">
                {formatPrice(item.product.price * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Pricing Breakdown */}
      <div className="border-t border-gray-200 pt-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal ({cart.totalItems} items)</span>
          <span className="text-gray-900">{formatPrice(cart.totalPrice)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="text-gray-900">
            {shippingCost === 0 ? (
              <span className="text-green-600 font-medium">Free</span>
            ) : (
              formatPrice(shippingCost)
            )}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax</span>
          <span className="text-gray-900">{formatPrice(tax)}</span>
        </div>
      </div>

      {/* Total */}
      <div className="border-t border-gray-200 pt-4 mt-4">
        <div className="flex justify-between text-lg font-semibold">
          <span className="text-gray-900">Total</span>
          <span className="text-gray-900">{formatPrice(total)}</span>
        </div>
      </div>

      {/* Shipping Info */}
      {shippingCost === 0 && selectedShipping === 'standard' && (
        <div className="mt-4 p-3 bg-green-50 rounded-lg">
          <p className="text-sm text-green-800 text-center">
            🎉 You saved on shipping! Orders over $75 ship free.
          </p>
        </div>
      )}

      {/* Security Notice */}
      <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-600">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
        <span>256-bit SSL secured checkout</span>
      </div>
    </Card>
  );
};

export default OrderSummary; 
import { Link } from 'react-router-dom';
import { XMarkIcon, MinusIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { ShoppingBagIcon } from '@heroicons/react/24/solid';
import { Button } from '../ui';
import { useAppStore } from '../../store';

const CartDrawer = () => {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    updateCartItemQuantity, 
    removeFromCart 
  } = useAppStore();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      updateCartItemQuantity(itemId, newQuantity);
    }
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    // Navigate to checkout will be implemented in checkout component
    window.location.href = '/checkout';
  };

  return (
    <>
      {/* Backdrop */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      {/* Cart Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
        isCartOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <ShoppingBagIcon className="w-6 h-6 text-primary-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Shopping Cart ({cart.totalItems})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Cart Content */}
          {cart.items.length === 0 ? (
            /* Empty Cart */
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <ShoppingBagIcon className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-600 mb-6">Add some items to get started!</p>
              <Button 
                variant="primary" 
                onClick={() => setIsCartOpen(false)}
                className="w-full"
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            /* Cart Items */
            <>
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      {/* Product Image */}
                      <Link 
                        to={`/product/${item.product.id}`}
                        onClick={() => setIsCartOpen(false)}
                        className="flex-shrink-0"
                      >
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded-lg border border-gray-200 hover:opacity-80 transition-opacity"
                        />
                      </Link>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        {/* Brand & Name */}
                        <div className="mb-1">
                          <p className="text-sm text-gray-600">{item.product.brand.name}</p>
                          <Link 
                            to={`/product/${item.product.id}`}
                            onClick={() => setIsCartOpen(false)}
                            className="font-medium text-gray-900 hover:text-primary-600 transition-colors line-clamp-2"
                          >
                            {item.product.name}
                          </Link>
                        </div>

                        {/* Selected Options */}
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Color:</span>
                            <div 
                              className="w-4 h-4 rounded-full border border-gray-300"
                              style={{ backgroundColor: item.selectedColor.hex }}
                              title={item.selectedColor.name}
                            />
                            <span className="text-sm text-gray-900">{item.selectedColor.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Size:</span>
                            <span className="text-sm text-gray-900">{item.selectedSize.name}</span>
                          </div>
                        </div>

                        {/* Quantity & Price */}
                        <div className="flex items-center justify-between">
                          {/* Quantity Controls */}
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="p-1.5 text-gray-600 hover:text-gray-900 transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              <MinusIcon className="w-4 h-4" />
                            </button>
                            <span className="px-3 py-1.5 text-sm font-medium min-w-[2rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="p-1.5 text-gray-600 hover:text-gray-900 transition-colors"
                              disabled={item.quantity >= item.product.stockQuantity}
                            >
                              <PlusIcon className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Price & Remove */}
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-gray-900">
                              {formatPrice(item.product.price * item.quantity)}
                            </span>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-1 text-red-600 hover:text-red-700 transition-colors"
                              title="Remove item"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cart Footer */}
              <div className="border-t border-gray-200 p-6 space-y-4">
                {/* Subtotal */}
                <div className="flex items-center justify-between text-lg font-semibold">
                  <span className="text-gray-900">Subtotal</span>
                  <span className="text-gray-900">{formatPrice(cart.totalPrice)}</span>
                </div>

                {/* Shipping Notice */}
                <p className="text-sm text-gray-600 text-center">
                  {cart.totalPrice >= 75 ? (
                    <span className="text-green-600 font-medium">
                      🎉 You qualify for free shipping!
                    </span>
                  ) : (
                    <>
                      Add {formatPrice(75 - cart.totalPrice)} more for free shipping
                    </>
                  )}
                </p>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    className="w-full"
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="w-full"
                    onClick={() => setIsCartOpen(false)}
                  >
                    Continue Shopping
                  </Button>
                </div>

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600 pt-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span>Secure checkout</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer; 
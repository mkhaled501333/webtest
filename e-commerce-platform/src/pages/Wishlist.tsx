import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useAppStore } from '../store';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

const Wishlist: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { 
    wishlists, 
    currentWishlist, 
    isLoading, 
    error,
    loadWishlists,
    createWishlist,
    setCurrentWishlist,
    removeFromWishlist,
    clearError
  } = useWishlistStore();
  const { addToCart } = useAppStore();
  
  const [isCreatingWishlist, setIsCreatingWishlist] = useState(false);
  const [newWishlistName, setNewWishlistName] = useState('');

  useEffect(() => {
    if (user) {
      loadWishlists(user.id);
    }
  }, [user, loadWishlists]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => clearError(), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleCreateWishlist = async () => {
    if (!newWishlistName.trim()) return;
    
    try {
      await createWishlist(newWishlistName.trim());
      setNewWishlistName('');
      setIsCreatingWishlist(false);
    } catch (error) {
      console.error('Failed to create wishlist:', error);
    }
  };

  const handleAddToCart = (product: any, selectedColor?: string, selectedSize?: string) => {
    addToCart(product, selectedSize || '', selectedColor || '', 1);
  };

  const handleRemoveItem = async (itemId: string) => {
    if (!currentWishlist) return;
    
    try {
      await removeFromWishlist(itemId, currentWishlist.id);
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">💝</div>
          <h1 className="text-2xl font-bold mb-4">Sign in to view your wishlist</h1>
          <p className="text-gray-600 mb-6">
            Create wishlists to save items you love and want to buy later
          </p>
          <Button size="lg">Sign In</Button>
        </div>
      </div>
    );
  }

  if (isLoading && wishlists.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">Loading your wishlists...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-1/4">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">My Wishlists</h2>
              <Button
                size="sm"
                onClick={() => setIsCreatingWishlist(true)}
                className="text-xs"
              >
                + New
              </Button>
            </div>

            {isCreatingWishlist && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <input
                  type="text"
                  placeholder="Wishlist name"
                  value={newWishlistName}
                  onChange={(e) => setNewWishlistName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateWishlist()}
                  autoFocus
                />
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={handleCreateWishlist}
                    disabled={!newWishlistName.trim()}
                    className="text-xs"
                  >
                    Create
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setIsCreatingWishlist(false);
                      setNewWishlistName('');
                    }}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {wishlists.map((wishlist) => (
                <button
                  key={wishlist.id}
                  onClick={() => setCurrentWishlist(wishlist)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    currentWishlist?.id === wishlist.id
                      ? 'bg-primary text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="font-medium">{wishlist.name}</div>
                  <div className={`text-sm ${
                    currentWishlist?.id === wishlist.id ? 'text-primary-100' : 'text-gray-500'
                  }`}>
                    {wishlist.items.length} items
                    {wishlist.isPublic && ' • Public'}
                  </div>
                </button>
              ))}
            </div>

            {wishlists.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">💝</div>
                <p className="text-sm">No wishlists yet</p>
                <p className="text-xs">Create your first wishlist</p>
              </div>
            )}
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:w-3/4">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {currentWishlist ? (
            <Card className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-2xl font-bold">{currentWishlist.name}</h1>
                  {currentWishlist.description && (
                    <p className="text-gray-600 mt-1">{currentWishlist.description}</p>
                  )}
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <span>{currentWishlist.items.length} items</span>
                    <span>•</span>
                    <span>{currentWishlist.isPublic ? 'Public' : 'Private'}</span>
                    <span>•</span>
                    <span>Created {new Date(currentWishlist.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">Edit</Button>
                  <Button size="sm" variant="outline">Share</Button>
                </div>
              </div>

              {currentWishlist.items.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentWishlist.items.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="relative">
                        <Link to={`/product/${item.productId}`}>
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-full h-48 object-cover rounded-lg mb-3"
                          />
                        </Link>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
                          title="Remove from wishlist"
                        >
                          <span className="text-gray-600">×</span>
                        </button>
                      </div>

                      <div className="space-y-2">
                        <Link 
                          to={`/product/${item.productId}`}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {item.product.name}
                        </Link>
                        
                        <div className="text-gray-600 text-sm">{item.product.brand.name}</div>
                        
                        <div className="flex items-center space-x-2">
                          <span className="font-bold">${item.product.price}</span>
                          {item.product.originalPrice && item.product.originalPrice > item.product.price && (
                            <span className="text-sm text-gray-500 line-through">
                              ${item.product.originalPrice}
                            </span>
                          )}
                        </div>

                        {(item.selectedColor || item.selectedSize) && (
                          <div className="text-sm text-gray-600">
                            {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                            {item.selectedColor && item.selectedSize && <span> • </span>}
                            {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                          </div>
                        )}

                        {item.notes && (
                          <div className="text-sm text-gray-600 italic">
                            "{item.notes}"
                          </div>
                        )}

                        <div className="text-xs text-gray-500">
                          Added {new Date(item.addedAt).toLocaleDateString()}
                        </div>

                        <Button
                          className="w-full"
                          size="sm"
                          onClick={() => handleAddToCart(
                            item.product, 
                            item.selectedColor, 
                            item.selectedSize
                          )}
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-6xl mb-4">💝</div>
                  <h3 className="text-lg font-medium mb-2">Your wishlist is empty</h3>
                  <p className="text-sm mb-4">
                    Save items you love to this wishlist
                  </p>
                  <Link to="/catalog">
                    <Button>Start Shopping</Button>
                  </Link>
                </div>
              )}
            </Card>
          ) : (
            <Card className="p-6">
              <div className="text-center py-12 text-gray-500">
                <div className="text-6xl mb-4">💝</div>
                <h3 className="text-lg font-medium mb-2">Select a wishlist</h3>
                <p className="text-sm">
                  Choose a wishlist from the sidebar or create a new one
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wishlist; 
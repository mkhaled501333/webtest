import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingCartIcon, 
  HeartIcon, 
  UserIcon, 
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useAppStore } from '../../store';
import { Button, Badge } from '../ui';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cart, user, setIsCartOpen } = useAppStore();
  
  const cartItemsCount = cart.items.reduce((total: number, item: any) => total + item.quantity, 0);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary-600">StyleHub</span>
            </Link>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for brands, products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/products" className="text-gray-700 hover:text-primary-600 font-medium">
              All Products
            </Link>
            <Link to="/brands" className="text-gray-700 hover:text-primary-600 font-medium">
              Brands
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-primary-600 font-medium">
              Categories
            </Link>
            <Link to="/ar-try-on" className="text-gray-700 hover:text-primary-600 font-medium">
              AR Try-On
            </Link>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center space-x-4">
            {/* Wishlist */}
            <Link to="/wishlist" className="relative p-2 text-gray-700 hover:text-primary-600">
              <HeartIcon className="h-6 w-6" />
            </Link>

            {/* Cart */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-700 hover:text-primary-600"
            >
              <ShoppingCartIcon className="h-6 w-6" />
              {cartItemsCount > 0 && (
                <Badge 
                  variant="danger" 
                  size="sm" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs"
                >
                  {cartItemsCount}
                </Badge>
              )}
            </button>

            {/* User Account */}
            {user ? (
              <Link to="/account" className="p-2 text-gray-700 hover:text-primary-600">
                <UserIcon className="h-6 w-6" />
              </Link>
            ) : (
              <Button variant="primary" size="sm">
                Sign In
              </Button>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 bg-white">
            {/* Mobile Search */}
            <div className="mb-4 px-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for brands, products..."
                  className="w-full pl-10 pr-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 min-h-touch"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Mobile Navigation Links */}
            <nav className="space-y-1 px-4">
              <Link 
                to="/brands" 
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors min-h-touch"
                onClick={() => setIsMenuOpen(false)}
              >
                Brands
              </Link>
              <Link 
                to="/categories" 
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors min-h-touch"
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>
              <Link 
                to="/ar-try-on" 
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors min-h-touch"
                onClick={() => setIsMenuOpen(false)}
              >
                AR Try-On
              </Link>
              <Link 
                to="/wishlist" 
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors min-h-touch"
                onClick={() => setIsMenuOpen(false)}
              >
                Wishlist
              </Link>
              {/* Mobile Cart Link */}
              <button 
                onClick={() => {
                  setIsCartOpen(true);
                  setIsMenuOpen(false);
                }}
                className="flex items-center w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors min-h-touch"
              >
                Cart ({cartItemsCount})
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 
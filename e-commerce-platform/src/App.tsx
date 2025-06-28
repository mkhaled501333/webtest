import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { useAppStore } from './store';
import { mockBrands, mockProducts } from './data/mockData';
import Homepage from './pages/Homepage';
import ProductCatalog from './pages/ProductCatalog';
import ProductDetail from './pages/ProductDetail';
import BrandDetail from './pages/BrandDetail';
import BrandsListing from './pages/BrandsListing';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import ARTryOn from './pages/ARTryOn';
import Wishlist from './pages/Wishlist';
import UserProfile from './pages/UserProfile';
import CartDrawer from './components/cart/CartDrawer';
import Layout from './components/layout/Layout';
import './App.css';

// Wrapper component that provides the Layout with Outlet
const LayoutWrapper = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

function App() {
  const { setBrands, setProducts } = useAppStore();

  // Initialize mock data
  useEffect(() => {
    setBrands(mockBrands);
    setProducts(mockProducts);
  }, [setBrands, setProducts]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <CartDrawer />
        <Routes>
          <Route path="/" element={<LayoutWrapper />}>
            <Route index element={<Homepage />} />
            <Route path="products" element={<ProductCatalog />} />
            <Route path="product/:id" element={<ProductDetail />} />
            <Route path="brands" element={<BrandsListing />} />
            <Route path="brand/:brandId" element={<BrandDetail />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="order-confirmation" element={<OrderConfirmation />} />
            <Route path="ar-try-on" element={<ARTryOn />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="account" element={<UserProfile />} />
            <Route path="category/:category" element={<ProductCatalog />} />
            {/* Placeholder routes for other links */}
            <Route path="categories" element={<ProductCatalog />} />
            <Route path="new-arrivals" element={<ProductCatalog />} />
            <Route path="help" element={<div className="p-8 text-center"><h1 className="text-2xl">Help Center - Coming Soon</h1></div>} />
            <Route path="shipping" element={<div className="p-8 text-center"><h1 className="text-2xl">Shipping Info - Coming Soon</h1></div>} />
            <Route path="returns" element={<div className="p-8 text-center"><h1 className="text-2xl">Returns - Coming Soon</h1></div>} />
            <Route path="contact" element={<div className="p-8 text-center"><h1 className="text-2xl">Contact Us - Coming Soon</h1></div>} />
            <Route path="privacy" element={<div className="p-8 text-center"><h1 className="text-2xl">Privacy Policy - Coming Soon</h1></div>} />
            <Route path="terms" element={<div className="p-8 text-center"><h1 className="text-2xl">Terms of Service - Coming Soon</h1></div>} />
            <Route path="brand-partnership" element={<div className="p-8 text-center"><h1 className="text-2xl">Brand Partnership - Coming Soon</h1></div>} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

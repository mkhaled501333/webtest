// Product Types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  subcategory?: string;
  brand: Brand;
  sizes: Size[];
  colors: Color[];
  inStock: boolean;
  stockQuantity: number;
  featured: boolean;
  rating: number;
  reviewCount: number;
  tags: string[];
}

export interface Brand {
  id: string;
  name: string;
  description: string;
  logo: string;
  coverImage?: string;
  website?: string;
  verified: boolean;
  productCount: number;
  established?: string;
  location?: string;
}

export interface Size {
  id: string;
  name: string;
  value: string;
  available: boolean;
}

export interface Color {
  id: string;
  name: string;
  hex: string;
  available: boolean;
}

// Shopping Cart Types
export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedSize: Size;
  selectedColor: Color;
  addedAt: Date;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  createdAt: string;
  lastLoginAt: string;
  isVerified: boolean;
  preferences: UserPreferences;
  addresses: Address[];
  sizingProfile?: SizingProfile;
}

export interface UserPreferences {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    marketing: boolean;
    orderUpdates: boolean;
    newArrivals: boolean;
    salesAlerts: boolean;
  };
  privacy: {
    showProfile: boolean;
    shareReviews: boolean;
    trackingConsent: boolean;
  };
  shopping: {
    preferredCurrency: string;
    preferredLanguage: string;
    defaultShippingAddress?: string;
    defaultPaymentMethod?: string;
    autoSaveToWishlist: boolean;
  };
}

export interface SizingProfile {
  id: string;
  userId: string;
  measurements: {
    height: number; // cm
    weight: number; // kg
    chest: number; // cm
    waist: number; // cm
    hips: number; // cm
    inseam: number; // cm
    shoulders: number; // cm
    neck: number; // cm
  };
  bodyType: 'athletic' | 'slim' | 'regular' | 'full' | 'plus';
  fitPreference: 'tight' | 'fitted' | 'regular' | 'loose' | 'oversized';
  preferredSizes: {
    [category: string]: string; // e.g., { "tops": "M", "bottoms": "32", "shoes": "9" }
  };
  brandAdjustments: {
    [brandId: string]: {
      sizeAdjustment: number; // -1, 0, +1 for size down, true to size, size up
      notes?: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  isDefault: boolean;
  firstName: string;
  lastName: string;
  company?: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
  instructions?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  acceptTerms: boolean;
  subscribeNewsletter?: boolean;
}

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  product: Product;
  selectedColor?: string;
  selectedSize?: string;
  addedAt: string;
  notes?: string;
}

export interface Wishlist {
  id: string;
  userId: string;
  name: string;
  description?: string;
  isPublic: boolean;
  items: WishlistItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderHistory {
  id: string;
  userId: string;
  orderNumber: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  price: number;
  discount?: number;
}

export interface Review {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
    verified: boolean;
  };
  productId: string;
  orderId?: string;
  rating: number; // 1-5
  title: string;
  content: string;
  pros: string[];
  cons: string[];
  recommendedSize?: string;
  fitFeedback?: 'runs-small' | 'true-to-size' | 'runs-large';
  images: string[];
  helpfulVotes: number;
  verifiedPurchase: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewFilters {
  rating?: number;
  verified?: boolean;
  withPhotos?: boolean;
  fitFeedback?: 'runs-small' | 'true-to-size' | 'runs-large';
  sortBy?: 'newest' | 'oldest' | 'highest-rated' | 'lowest-rated' | 'most-helpful';
}

// Order Types
export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  createdAt: Date;
  estimatedDelivery: Date;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface PaymentMethod {
  type: 'card' | 'paypal' | 'apple_pay' | 'google_pay';
  last4?: string;
  brand?: string;
}

// Filter Types
export interface ProductFilters {
  brands: string[];
  categories: string[];
  priceRange: [number, number];
  sizes: string[];
  colors: string[];
  inStockOnly: boolean;
  rating: number;
}

export interface SortOption {
  value: string;
  label: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Component Props Types
export interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
  showQuickView?: boolean;
}

export interface FilterSidebarProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  brands: Brand[];
  categories: string[];
}

// AR Types (for future integration)
export interface ARSession {
  id: string;
  productId: string;
  userId: string;
  measurements?: SizingProfile;
  active: boolean;
}

export interface ARTryOnResult {
  sessionId: string;
  fit: 'excellent' | 'good' | 'poor';
  confidence: number;
  recommendations: string[];
} 
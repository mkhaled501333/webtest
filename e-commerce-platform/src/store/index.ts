import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, CartItem, Cart, ProductFilters, Brand, User } from '../types';

interface AppState {
  // Cart state
  cart: Cart;
  addToCart: (product: Product, size: string, color: string, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateCartItemQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Wishlist state
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // User state
  user: User | null;
  setUser: (user: User | null) => void;

  // UI state
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;

  // Search and filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: ProductFilters;
  setFilters: (filters: ProductFilters) => void;
  
  // Products and brands (would come from API in real app)
  products: Product[];
  brands: Brand[];
  setProducts: (products: Product[]) => void;
  setBrands: (brands: Brand[]) => void;

  // Product state
  featuredProducts: Product[];
  newArrivals: Product[];
  
  // Product actions
  loadProducts: () => void;
  loadFeaturedProducts: () => void;
  loadNewArrivals: () => void;
}

const initialFilters: ProductFilters = {
  brands: [],
  categories: [],
  priceRange: [0, 1000],
  sizes: [],
  colors: [],
  inStockOnly: false,
  rating: 0,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial cart state
      cart: {
        items: [],
        totalItems: 0,
        totalPrice: 0,
      },
      isCartOpen: false,

      // Cart actions
      addToCart: (product, sizeId, colorId, quantity = 1) => {
        set((state) => {
          const size = product.sizes.find(s => s.id === sizeId);
          const color = product.colors.find(c => c.id === colorId);
          
          if (!size || !color) {
            console.warn('Size or color not found for product:', product.name);
            return state;
          }

          const existingItemIndex = state.cart.items.findIndex(
            item => 
              item.product.id === product.id && 
              item.selectedSize.id === sizeId && 
              item.selectedColor.id === colorId
          );

          let newItems = [...state.cart.items];

          if (existingItemIndex > -1) {
            // Update existing item quantity
            newItems[existingItemIndex] = {
              ...newItems[existingItemIndex],
              quantity: newItems[existingItemIndex].quantity + quantity
            };
          } else {
            // Add new item
            const newItem: CartItem = {
              id: `${product.id}-${sizeId}-${colorId}`,
              product,
              quantity,
              selectedSize: size,
              selectedColor: color,
              addedAt: new Date(),
            };
            newItems.push(newItem);
          }

          const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
          const totalPrice = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

          console.log('Item added to cart:', product.name, 'Total items:', totalItems);

          return {
            ...state,
            cart: {
              items: newItems,
              totalItems,
              totalPrice,
            },
            isCartOpen: true, // Automatically open cart drawer
          };
        });
      },

      removeFromCart: (itemId) => {
        set((state) => {
          const newItems = state.cart.items.filter(item => item.id !== itemId);
          const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
          const totalPrice = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

          return {
            ...state,
            cart: {
              items: newItems,
              totalItems,
              totalPrice,
            },
          };
        });
      },

      updateCartItemQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(itemId);
          return;
        }
        set((state) => {

          const newItems = state.cart.items.map(item =>
            item.id === itemId ? { ...item, quantity } : item
          );

          const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
          const totalPrice = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

          return {
            ...state,
            cart: {
              items: newItems,
              totalItems,
              totalPrice,
            },
          };
        });
      },

      clearCart: () => {
        set((state) => ({
          ...state,
          cart: {
            items: [],
            totalItems: 0,
            totalPrice: 0,
          },
        }));
      },

      setIsCartOpen: (open) => {
        set({ isCartOpen: open });
      },

      // Wishlist state
      wishlist: [],

      addToWishlist: (product) => {
        set((state) => ({
          ...state,
          wishlist: state.wishlist.some(p => p.id === product.id) 
            ? state.wishlist 
            : [...state.wishlist, product],
        }));
      },

      removeFromWishlist: (productId) => {
        set((state) => ({
          ...state,
          wishlist: state.wishlist.filter(p => p.id !== productId),
        }));
      },

      isInWishlist: (productId) => {
        return get().wishlist.some(p => p.id === productId);
      },

      // User state
      user: null,
      setUser: (user) => set({ user }),

      // UI state
      isMobileMenuOpen: false,
      setIsMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),

      // Search and filters
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      filters: initialFilters,
      setFilters: (filters) => set({ filters }),

      // Products and brands (would come from API in real app)
      products: [],
      brands: [],
      setProducts: (products) => set({ products }),
      setBrands: (brands) => set({ brands }),

      // Product state
      featuredProducts: [],
      newArrivals: [],
      
      // Product actions
      loadProducts: () => {
        // Simulated product loading
        // In a real app, this would fetch from an API
        set({ products: [] });
      },

      loadFeaturedProducts: () => {
        // Simulated featured products loading
        set({ featuredProducts: [] });
      },

      loadNewArrivals: () => {
        // Simulated new arrivals loading
        set({ newArrivals: [] });
      },
    }),
    {
      name: 'ecommerce-storage',
      partialize: (state) => ({
        cart: state.cart,
        wishlist: state.wishlist,
        user: state.user,
      }),
    }
  )
);

// Export with alias for convenience
export const useStore = useAppStore;

// Re-export auth and wishlist stores for easy access
export { useAuthStore } from './authStore';
export { useWishlistStore } from './wishlistStore';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Wishlist, WishlistItem, Product } from '../types';

interface WishlistStore {
  wishlists: Wishlist[];
  currentWishlist: Wishlist | null;
  isLoading: boolean;
  error: string | null;

  // Wishlist management
  loadWishlists: (userId: string) => Promise<void>;
  createWishlist: (name: string, description?: string) => Promise<void>;
  updateWishlist: (id: string, updates: Partial<Wishlist>) => Promise<void>;
  deleteWishlist: (id: string) => Promise<void>;
  setCurrentWishlist: (wishlist: Wishlist | null) => void;

  // Item management
  addToWishlist: (productId: string, wishlistId?: string, options?: { color?: string; size?: string; notes?: string }) => Promise<void>;
  removeFromWishlist: (itemId: string, wishlistId: string) => Promise<void>;
  moveToWishlist: (itemId: string, fromWishlistId: string, toWishlistId: string) => Promise<void>;
  updateWishlistItem: (itemId: string, wishlistId: string, updates: Partial<WishlistItem>) => Promise<void>;

  // Utility methods
  isInWishlist: (productId: string, wishlistId?: string) => boolean;
  getWishlistItem: (productId: string, wishlistId?: string) => WishlistItem | null;
  clearError: () => void;
}

// Mock data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Sustainable Cotton T-Shirt',
    brand: {
      id: 'ecowear1',
      name: 'EcoWear',
      description: 'Sustainable fashion brand',
      logo: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=80&h=80&fit=crop',
      verified: true,
      productCount: 42
    },
    price: 29.99,
    originalPrice: 39.99,
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop'],
    colors: [
      { id: 'white1', name: 'White', hex: '#ffffff', available: true },
      { id: 'black1', name: 'Black', hex: '#000000', available: true },
      { id: 'navy1', name: 'Navy', hex: '#000080', available: true }
    ],
    sizes: [
      { id: 'xs1', name: 'XS', value: 'xs', available: true, inStock: true },
      { id: 's1', name: 'S', value: 's', available: true, inStock: true },
      { id: 'm1', name: 'M', value: 'm', available: true, inStock: true },
      { id: 'l1', name: 'L', value: 'l', available: true, inStock: true },
      { id: 'xl1', name: 'XL', value: 'xl', available: true, inStock: true }
    ],
    category: 'Clothing',
    subcategory: 'Tops',
    description: 'Made from 100% organic cotton',
    inStock: true,
    stockQuantity: 100,
    featured: true,
    rating: 4.5,
    reviewCount: 128,
    tags: ['sustainable', 'organic', 'basic'],
  }
];

// Mock wishlist service
const wishlistService = {
  async loadWishlists(userId: string): Promise<Wishlist[]> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
      {
        id: '1',
        userId,
        name: 'My Favorites',
        description: 'Items I love and want to buy',
        isPublic: false,
        items: [
          {
            id: '1',
            userId,
            productId: '1',
            product: mockProducts[0],
            selectedColor: 'White',
            selectedSize: 'M',
            addedAt: '2024-01-15T10:30:00Z',
            notes: 'Perfect for summer',
          },
        ],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
      },
      {
        id: '2',
        userId,
        name: 'Summer Collection',
        description: 'Light and breezy items for hot weather',
        isPublic: true,
        items: [],
        createdAt: '2024-03-01T00:00:00Z',
        updatedAt: '2024-03-01T00:00:00Z',
      },
    ];
  },

  async createWishlist(userId: string, name: string, description?: string): Promise<Wishlist> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      id: Date.now().toString(),
      userId,
      name,
      description,
      isPublic: false,
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  async addToWishlist(
    userId: string, 
    productId: string, 
    targetWishlistId: string,
    options?: { color?: string; size?: string; notes?: string }
  ): Promise<WishlistItem> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // In a real app, fetch the product from the API and associate with the wishlist
    const product = mockProducts.find(p => p.id === productId) || mockProducts[0];
    
    // Use the targetWishlistId to associate the item with the correct wishlist
    console.log(`Adding product ${productId} to wishlist ${targetWishlistId}`);
    
    return {
      id: Date.now().toString(),
      userId,
      productId,
      product,
      selectedColor: options?.color,
      selectedSize: options?.size,
      addedAt: new Date().toISOString(),
      notes: options?.notes,
    };
  },
};

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      wishlists: [],
      currentWishlist: null,
      isLoading: false,
      error: null,

      loadWishlists: async (userId: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const wishlists = await wishlistService.loadWishlists(userId);
          set({ 
            wishlists, 
            currentWishlist: wishlists[0] || null,
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to load wishlists',
            isLoading: false 
          });
        }
      },

      createWishlist: async (name: string, description?: string) => {
        const userId = 'current-user'; // Get from auth store in real app
        set({ isLoading: true, error: null });
        
        try {
          const newWishlist = await wishlistService.createWishlist(userId, name, description);
          const { wishlists } = get();
          
          set({ 
            wishlists: [...wishlists, newWishlist],
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to create wishlist',
            isLoading: false 
          });
        }
      },

      updateWishlist: async (id: string, updates: Partial<Wishlist>) => {
        set({ isLoading: true });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 200));
          
          const { wishlists, currentWishlist } = get();
          const updatedWishlists = wishlists.map(wishlist => 
            wishlist.id === id 
              ? { ...wishlist, ...updates, updatedAt: new Date().toISOString() }
              : wishlist
          );
          
          set({ 
            wishlists: updatedWishlists,
            currentWishlist: currentWishlist?.id === id 
              ? { ...currentWishlist, ...updates, updatedAt: new Date().toISOString() }
              : currentWishlist,
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update wishlist',
            isLoading: false 
          });
        }
      },

      deleteWishlist: async (id: string) => {
        set({ isLoading: true });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 200));
          
          const { wishlists, currentWishlist } = get();
          const updatedWishlists = wishlists.filter(wishlist => wishlist.id !== id);
          
          set({ 
            wishlists: updatedWishlists,
            currentWishlist: currentWishlist?.id === id 
              ? updatedWishlists[0] || null
              : currentWishlist,
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to delete wishlist',
            isLoading: false 
          });
        }
      },

      setCurrentWishlist: (wishlist: Wishlist | null) => {
        set({ currentWishlist: wishlist });
      },

      addToWishlist: async (
        productId: string, 
        wishlistId?: string, 
        options?: { color?: string; size?: string; notes?: string }
      ) => {
        const userId = 'current-user'; // Get from auth store in real app
        const { wishlists, currentWishlist } = get();
        
        // Use provided wishlist ID or default to current/first wishlist
        const targetWishlistId = wishlistId || currentWishlist?.id || wishlists[0]?.id;
        
        if (!targetWishlistId) {
          set({ error: 'No wishlist available. Please create a wishlist first.' });
          return;
        }

        set({ isLoading: true, error: null });
        
        try {
          const newItem = await wishlistService.addToWishlist(
            userId, 
            productId, 
            targetWishlistId,
            options
          );
          
          const updatedWishlists = wishlists.map(wishlist => 
            wishlist.id === targetWishlistId
              ? { 
                  ...wishlist, 
                  items: [...wishlist.items, newItem],
                  updatedAt: new Date().toISOString()
                }
              : wishlist
          );
          
          set({ 
            wishlists: updatedWishlists,
            currentWishlist: currentWishlist?.id === targetWishlistId
              ? { ...currentWishlist, items: [...currentWishlist.items, newItem] }
              : currentWishlist,
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to add to wishlist',
            isLoading: false 
          });
        }
      },

      removeFromWishlist: async (itemId: string, wishlistId: string) => {
        set({ isLoading: true });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 200));
          
          const { wishlists, currentWishlist } = get();
          const updatedWishlists = wishlists.map(wishlist => 
            wishlist.id === wishlistId
              ? { 
                  ...wishlist, 
                  items: wishlist.items.filter(item => item.id !== itemId),
                  updatedAt: new Date().toISOString()
                }
              : wishlist
          );
          
          set({ 
            wishlists: updatedWishlists,
            currentWishlist: currentWishlist?.id === wishlistId
              ? { 
                  ...currentWishlist, 
                  items: currentWishlist.items.filter(item => item.id !== itemId) 
                }
              : currentWishlist,
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to remove from wishlist',
            isLoading: false 
          });
        }
      },

      moveToWishlist: async (itemId: string, fromWishlistId: string, toWishlistId: string) => {
        set({ isLoading: true });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          
          const { wishlists, currentWishlist } = get();
          let itemToMove: WishlistItem | null = null;
          
          const updatedWishlists = wishlists.map(wishlist => {
            if (wishlist.id === fromWishlistId) {
              const item = wishlist.items.find(item => item.id === itemId);
              if (item) {
                itemToMove = item;
              }
              return { 
                ...wishlist, 
                items: wishlist.items.filter(item => item.id !== itemId),
                updatedAt: new Date().toISOString()
              };
            }
            
            if (wishlist.id === toWishlistId && itemToMove) {
              return { 
                ...wishlist, 
                items: [...wishlist.items, itemToMove],
                updatedAt: new Date().toISOString()
              };
            }
            
            return wishlist;
          });
          
          set({ 
            wishlists: updatedWishlists,
            currentWishlist: currentWishlist && 
              (currentWishlist.id === fromWishlistId || currentWishlist.id === toWishlistId)
              ? updatedWishlists.find(w => w.id === currentWishlist.id) || currentWishlist
              : currentWishlist,
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to move item',
            isLoading: false 
          });
        }
      },

      updateWishlistItem: async (itemId: string, wishlistId: string, updates: Partial<WishlistItem>) => {
        set({ isLoading: true });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 200));
          
          const { wishlists, currentWishlist } = get();
          const updatedWishlists = wishlists.map(wishlist => 
            wishlist.id === wishlistId
              ? { 
                  ...wishlist, 
                  items: wishlist.items.map(item => 
                    item.id === itemId ? { ...item, ...updates } : item
                  ),
                  updatedAt: new Date().toISOString()
                }
              : wishlist
          );
          
          set({ 
            wishlists: updatedWishlists,
            currentWishlist: currentWishlist?.id === wishlistId
              ? { 
                  ...currentWishlist, 
                  items: currentWishlist.items.map(item => 
                    item.id === itemId ? { ...item, ...updates } : item
                  )
                }
              : currentWishlist,
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update wishlist item',
            isLoading: false 
          });
        }
      },

      isInWishlist: (productId: string, wishlistId?: string) => {
        const { wishlists, currentWishlist } = get();
        const targetWishlist = wishlistId 
          ? wishlists.find(w => w.id === wishlistId)
          : currentWishlist || wishlists[0];
        
        return targetWishlist?.items.some(item => item.productId === productId) || false;
      },

      getWishlistItem: (productId: string, wishlistId?: string) => {
        const { wishlists, currentWishlist } = get();
        const targetWishlist = wishlistId 
          ? wishlists.find(w => w.id === wishlistId)
          : currentWishlist || wishlists[0];
        
        return targetWishlist?.items.find(item => item.productId === productId) || null;
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'wishlist-storage',
      partialize: (state) => ({
        wishlists: state.wishlists,
        currentWishlist: state.currentWishlist,
      }),
    }
  )
); 
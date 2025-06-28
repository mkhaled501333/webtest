import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  AuthState, 
  User, 
  LoginCredentials, 
  RegisterData,
  Address,
  SizingProfile 
} from '../types';

interface AuthStore extends AuthState {
  // Authentication actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  
  // Profile management
  updateProfile: (updates: Partial<User>) => Promise<void>;
  updatePreferences: (preferences: Partial<User['preferences']>) => Promise<void>;
  
  // Address management
  addAddress: (address: Omit<Address, 'id'>) => Promise<void>;
  updateAddress: (id: string, updates: Partial<Address>) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  setDefaultAddress: (id: string) => Promise<void>;
  
  // Sizing profile
  updateSizingProfile: (profile: SizingProfile) => Promise<void>;
  
  // Utility methods
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

// Mock authentication service
const authService = {
  async login(credentials: LoginCredentials): Promise<User> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user data
    const mockUser: User = {
      id: '1',
      email: credentials.email,
      name: 'John Doe',
      firstName: 'John',
      lastName: 'Doe',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      phone: '+1 (555) 123-4567',
      dateOfBirth: '1990-05-15',
      gender: 'male',
      createdAt: '2024-01-01T00:00:00Z',
      lastLoginAt: new Date().toISOString(),
      isVerified: true,
      preferences: {
        notifications: {
          email: true,
          push: true,
          sms: false,
          marketing: true,
          orderUpdates: true,
          newArrivals: true,
          salesAlerts: false,
        },
        privacy: {
          showProfile: false,
          shareReviews: true,
          trackingConsent: true,
        },
        shopping: {
          preferredCurrency: 'USD',
          preferredLanguage: 'en',
          autoSaveToWishlist: true,
        },
      },
      addresses: [
        {
          id: '1',
          type: 'home',
          isDefault: true,
          firstName: 'John',
          lastName: 'Doe',
          street1: '123 Main Street',
          street2: 'Apt 4B',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94105',
          country: 'US',
          phone: '+1 (555) 123-4567',
        },
        {
          id: '2',
          type: 'work',
          isDefault: false,
          firstName: 'John',
          lastName: 'Doe',
          company: 'Tech Corp',
          street1: '456 Business Ave',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94107',
          country: 'US',
        },
      ],
      sizingProfile: {
        id: '1',
        userId: '1',
        measurements: {
          height: 180,
          weight: 75,
          chest: 98,
          waist: 82,
          hips: 95,
          inseam: 81,
          shoulders: 45,
          neck: 38,
        },
        bodyType: 'athletic',
        fitPreference: 'fitted',
        preferredSizes: {
          tops: 'M',
          bottoms: '32',
          shoes: '9',
        },
        brandAdjustments: {
          'nike': { sizeAdjustment: 0, notes: 'True to size' },
          'adidas': { sizeAdjustment: 1, notes: 'Size up for comfort' },
        },
        createdAt: '2024-01-15T00:00:00Z',
        updatedAt: new Date().toISOString(),
      },
    };

    return mockUser;
  },

  async register(data: RegisterData): Promise<User> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const mockUser: User = {
      id: Date.now().toString(),
      email: data.email,
      name: `${data.firstName} ${data.lastName}`,
      firstName: data.firstName,
      lastName: data.lastName,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      isVerified: false,
      preferences: {
        notifications: {
          email: data.subscribeNewsletter || false,
          push: false,
          sms: false,
          marketing: data.subscribeNewsletter || false,
          orderUpdates: true,
          newArrivals: false,
          salesAlerts: false,
        },
        privacy: {
          showProfile: false,
          shareReviews: false,
          trackingConsent: true,
        },
        shopping: {
          preferredCurrency: 'USD',
          preferredLanguage: 'en',
          autoSaveToWishlist: false,
        },
      },
      addresses: [],
    };

    return mockUser;
  },

  async refreshUser(): Promise<User> {
    // Simulate fetching updated user data
    await new Promise(resolve => setTimeout(resolve, 500));
    throw new Error('User session expired');
  },
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        
        try {
          const user = await authService.login(credentials);
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false,
            error: null 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Login failed',
            isLoading: false 
          });
          throw error;
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null });
        
        try {
          const user = await authService.register(data);
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false,
            error: null 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Registration failed',
            isLoading: false 
          });
          throw error;
        }
      },

      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false, 
          error: null 
        });
      },

      refreshUser: async () => {
        const { user } = get();
        if (!user) return;

        set({ isLoading: true });
        
        try {
          const refreshedUser = await authService.refreshUser();
          set({ 
            user: refreshedUser, 
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to refresh user',
            isLoading: false,
            user: null,
            isAuthenticated: false 
          });
        }
      },

      updateProfile: async (updates: Partial<User>) => {
        const { user } = get();
        if (!user) return;

        set({ isLoading: true });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const updatedUser = { ...user, ...updates };
          set({ 
            user: updatedUser, 
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update profile',
            isLoading: false 
          });
        }
      },

      updatePreferences: async (preferences: Partial<User['preferences']>) => {
        const { user } = get();
        if (!user) return;

        set({ isLoading: true });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          
          const updatedUser = {
            ...user,
            preferences: {
              ...user.preferences,
              ...preferences,
            },
          };
          
          set({ 
            user: updatedUser, 
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update preferences',
            isLoading: false 
          });
        }
      },

      addAddress: async (address: Omit<Address, 'id'>) => {
        const { user } = get();
        if (!user) return;

        set({ isLoading: true });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const newAddress: Address = {
            ...address,
            id: Date.now().toString(),
          };

          // If this is the first address, make it default
          if (user.addresses.length === 0) {
            newAddress.isDefault = true;
          }

          // If setting as default, unset others
          if (newAddress.isDefault) {
            user.addresses.forEach(addr => addr.isDefault = false);
          }

          const updatedUser = {
            ...user,
            addresses: [...user.addresses, newAddress],
          };
          
          set({ 
            user: updatedUser, 
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to add address',
            isLoading: false 
          });
        }
      },

      updateAddress: async (id: string, updates: Partial<Address>) => {
        const { user } = get();
        if (!user) return;

        set({ isLoading: true });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const addresses = user.addresses.map(addr => {
            if (addr.id === id) {
              const updated = { ...addr, ...updates };
              
              // If setting as default, unset others
              if (updated.isDefault) {
                user.addresses.forEach(a => a.isDefault = false);
              }
              
              return updated;
            }
            return addr;
          });

          const updatedUser = {
            ...user,
            addresses,
          };
          
          set({ 
            user: updatedUser, 
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update address',
            isLoading: false 
          });
        }
      },

      deleteAddress: async (id: string) => {
        const { user } = get();
        if (!user) return;

        set({ isLoading: true });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          
          const addresses = user.addresses.filter(addr => addr.id !== id);
          
          // If we deleted the default address, make the first remaining one default
          if (addresses.length > 0 && !addresses.some(addr => addr.isDefault)) {
            addresses[0].isDefault = true;
          }

          const updatedUser = {
            ...user,
            addresses,
          };
          
          set({ 
            user: updatedUser, 
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to delete address',
            isLoading: false 
          });
        }
      },

      setDefaultAddress: async (id: string) => {
        const { user } = get();
        if (!user) return;

        set({ isLoading: true });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 200));
          
          const addresses = user.addresses.map(addr => ({
            ...addr,
            isDefault: addr.id === id,
          }));

          const updatedUser = {
            ...user,
            addresses,
          };
          
          set({ 
            user: updatedUser, 
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to set default address',
            isLoading: false 
          });
        }
      },

      updateSizingProfile: async (profile: SizingProfile) => {
        const { user } = get();
        if (!user) return;

        set({ isLoading: true });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const updatedUser = {
            ...user,
            sizingProfile: {
              ...profile,
              updatedAt: new Date().toISOString(),
            },
          };
          
          set({ 
            user: updatedUser, 
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update sizing profile',
            isLoading: false 
          });
        }
      },

      clearError: () => set({ error: null }),
      
      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
); 
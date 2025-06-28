import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useWishlistStore } from '../store/wishlistStore';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Card } from '../components/ui/Card';

const UserProfile: React.FC = () => {
  const { user, isAuthenticated, updateProfile, isLoading } = useAuthStore();
  const { wishlists, loadWishlists } = useWishlistStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'orders' | 'preferences'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'prefer-not-to-say' as 'male' | 'female' | 'other' | 'prefer-not-to-say',
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth || '',
        gender: user.gender || 'prefer-not-to-say',
      });
      loadWishlists(user.id);
    }
  }, [user, loadWishlists]);

  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Please sign in to view your profile</h1>
        <Button>Sign In</Button>
      </div>
    );
  }

  const handleProfileUpdate = async () => {
    try {
      await updateProfile(profileData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'addresses', label: 'Addresses', icon: '📍' },
    { id: 'orders', label: 'Order History', icon: '📦' },
    { id: 'preferences', label: 'Preferences', icon: '⚙️' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-1/4">
          <Card className="p-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-primary">
                    {user.firstName[0]}{user.lastName[0]}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              {user.isVerified && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                  ✓ Verified
                </span>
              )}
            </div>

            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>

            <div className="mt-6 pt-6 border-t">
              <div className="text-sm text-gray-600 space-y-2">
                <div>Member since: {new Date(user.createdAt).toLocaleDateString()}</div>
                <div>Wishlists: {wishlists.length}</div>
                <div>Last login: {new Date(user.lastLoginAt).toLocaleDateString()}</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:w-3/4">
          <Card className="p-6">
            {activeTab === 'profile' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold">Profile Information</h3>
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)}>
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="space-x-2">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setIsEditing(false);
                          setProfileData({
                            firstName: user.firstName,
                            lastName: user.lastName,
                            email: user.email,
                            phone: user.phone || '',
                            dateOfBirth: user.dateOfBirth || '',
                            gender: user.gender || 'prefer-not-to-say',
                          });
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleProfileUpdate}
                        disabled={isLoading}
                      >
                        {isLoading ? <LoadingSpinner size="sm" /> : 'Save Changes'}
                      </Button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <Input
                      value={profileData.firstName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <Input
                      value={profileData.lastName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <Input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <Input
                      type="date"
                      value={profileData.dateOfBirth}
                      onChange={(e) => setProfileData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    <select
                      value={profileData.gender}
                      onChange={(e) => setProfileData(prev => ({ ...prev, gender: e.target.value as 'male' | 'female' | 'other' | 'prefer-not-to-say' }))}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
                    >
                      <option value="">Prefer not to say</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold">Addresses</h3>
                  <Button>Add New Address</Button>
                </div>

                <div className="space-y-4">
                  {user.addresses.map((address) => (
                    <div 
                      key={address.id}
                      className="border rounded-lg p-4 flex justify-between items-start"
                    >
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium">{address.type}</span>
                          {address.isDefault && (
                            <span className="px-2 py-1 bg-primary text-white text-xs rounded">
                              Default
                            </span>
                          )}
                        </div>
                        <div className="text-gray-700">
                          <div>{address.firstName} {address.lastName}</div>
                          {address.company && <div>{address.company}</div>}
                          <div>{address.street1}</div>
                          {address.street2 && <div>{address.street2}</div>}
                          <div>{address.city}, {address.state} {address.zipCode}</div>
                          <div>{address.country}</div>
                          {address.phone && <div>{address.phone}</div>}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">Edit</Button>
                        <Button size="sm" variant="outline">Delete</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h3 className="text-2xl font-bold mb-6">Order History</h3>
                <div className="text-center py-12 text-gray-500">
                  <div className="text-6xl mb-4">📦</div>
                  <p className="text-lg">No orders yet</p>
                  <p className="text-sm">When you place your first order, it will appear here</p>
                  <Button className="mt-4">Start Shopping</Button>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div>
                <h3 className="text-2xl font-bold mb-6">Preferences</h3>
                
                <div className="space-y-8">
                  {/* Notifications */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4">Notifications</h4>
                    <div className="space-y-3">
                      {Object.entries(user.preferences.notifications).map(([key, value]) => (
                        <label key={key} className="flex items-center justify-between">
                          <span className="text-gray-700 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                          </span>
                          <input
                            type="checkbox"
                            checked={value}
                            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                            readOnly
                          />
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Privacy */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4">Privacy</h4>
                    <div className="space-y-3">
                      {Object.entries(user.preferences.privacy).map(([key, value]) => (
                        <label key={key} className="flex items-center justify-between">
                          <span className="text-gray-700 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                          </span>
                          <input
                            type="checkbox"
                            checked={value}
                            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                            readOnly
                          />
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Shopping */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4">Shopping</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Preferred Currency</span>
                        <span className="font-medium">{user.preferences.shopping.preferredCurrency}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Language</span>
                        <span className="font-medium">{user.preferences.shopping.preferredLanguage}</span>
                      </div>
                      <label className="flex items-center justify-between">
                        <span className="text-gray-700">Auto-save to wishlist</span>
                        <input
                          type="checkbox"
                          checked={user.preferences.shopping.autoSaveToWishlist}
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                          readOnly
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 
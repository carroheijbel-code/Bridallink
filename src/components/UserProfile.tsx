import React, { useState } from 'react';
import { useAuth } from './AuthContext';

interface UserProfileProps {
  onClose: () => void;
}

export function UserProfile({ onClose }: UserProfileProps) {
  const { user, signOut, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [isSaving, setIsSaving] = useState(false);

  if (!user) return null;

  const handleSave = async () => {
    if (!name.trim()) {
      alert('Please enter a name');
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile(name);
      setIsEditing(false);
      alert('✅ Profile updated successfully!');
    } catch (error: any) {
      alert(`Error updating profile: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    if (confirm('Are you sure you want to sign out?\n\nYour data will be saved and available when you sign back in.')) {
      try {
        await signOut();
        onClose();
        alert('👋 Signed out successfully!\n\nSign in anytime to access your wedding plans.');
      } catch (error: any) {
        alert(`Error signing out: ${error.message}`);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-8 max-w-md w-full">
        <div className="text-center space-y-4 mb-6">
          <div className="bg-gradient-to-r from-rose-100 to-amber-100 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
            <span className="text-4xl">👤</span>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-amber-800 mb-1">Your Profile</h3>
            <p className="text-sm text-amber-600">Account Details</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-amber-700 mb-2">Name</label>
            {isEditing ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                placeholder="Enter your name"
              />
            ) : (
              <div className="flex items-center justify-between p-3 bg-rose-50 rounded-lg">
                <span className="text-amber-800 font-medium">{user.name || 'Not set'}</span>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-xs text-rose-600 hover:text-rose-800"
                >
                  Edit
                </button>
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-amber-700 mb-2">Email</label>
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="text-amber-800">{user.email}</span>
            </div>
          </div>

          {/* Account Created */}
          <div>
            <label className="block text-sm font-medium text-amber-700 mb-2">Member Since</label>
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="text-amber-800">
                {new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-green-800 mb-2">✅ Account Active</h4>
          <div className="space-y-1 text-sm text-green-700">
            <div className="flex items-center gap-2">
              <span>💾</span>
              <span>All data is being saved automatically</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🔄</span>
              <span>Syncs across all your devices</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🔒</span>
              <span>Your data is secure and private</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 font-semibold"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setName(user.name || '');
                }}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleSignOut}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                Sign Out
              </button>
              <button
                onClick={onClose}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </>
          )}
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          Need help? Email us at carolina@bridallink.co.uk
        </p>
      </div>
    </div>
  );
}

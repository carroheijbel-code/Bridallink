import React, { useState } from 'react';
import { useAuth } from './AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'signin' | 'signup';
}

export function AuthModal({ isOpen, onClose, defaultMode = 'signup' }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { signUp, signIn } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        if (!name.trim()) {
          throw new Error('Please enter your name');
        }
        await signUp(email, password, name);
        alert('🎉 Account created successfully!\n\nYour wedding planning data is now saved to your account and will sync across all your devices.');
      } else {
        await signIn(email, password);
        alert('✅ Welcome back!\n\nYour wedding planning data has been loaded.');
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="text-center space-y-4 mb-6">
          <div className="bg-gradient-to-r from-rose-100 to-amber-100 p-3 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
            <span className="text-3xl">{mode === 'signup' ? '✨' : '👋'}</span>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-amber-800 mb-2">
              {mode === 'signup' ? 'Create Your Account' : 'Welcome Back'}
            </h3>
            <p className="text-amber-700">
              {mode === 'signup' 
                ? 'Save your wedding plans and access them anywhere' 
                : 'Sign in to access your saved wedding plans'}
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-red-800">⚠️ {error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-amber-700 mb-2">
                Your Name *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500">👤</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  placeholder="Enter your name"
                  required={mode === 'signup'}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-amber-700 mb-2">
              Email Address *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500">📧</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                placeholder="your.email@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-700 mb-2">
              Password *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500">🔒</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                placeholder={mode === 'signup' ? 'Create a password (min. 6 characters)' : 'Enter your password'}
                minLength={6}
                required
              />
            </div>
          </div>

          {mode === 'signup' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">✨ Account Benefits:</h4>
              <div className="space-y-1 text-sm text-blue-700">
                <div className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Access your plans on any device</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Automatic cloud backup</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Sync across desktop and mobile</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Never lose your wedding data</span>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⟳</span>
                {mode === 'signup' ? 'Creating Account...' : 'Signing In...'}
              </span>
            ) : (
              mode === 'signup' ? 'Create Account' : 'Sign In'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setMode(mode === 'signup' ? 'signin' : 'signup');
              setError('');
            }}
            className="text-sm text-amber-700 hover:text-amber-900 transition-colors"
          >
            {mode === 'signup' ? (
              <>Already have an account? <span className="font-semibold">Sign In</span></>
            ) : (
              <>Don't have an account? <span className="font-semibold">Sign Up</span></>
            )}
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Continue Without Account
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          {mode === 'signup' && 'By creating an account, you agree to our Terms of Service and Privacy Policy'}
        </p>
      </div>
    </div>
  );
}

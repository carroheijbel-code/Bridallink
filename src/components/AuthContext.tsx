import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = () => {
      try {
        const storedUser = localStorage.getItem('bridallink_user');
        const sessionToken = localStorage.getItem('bridallink_session');
        
        if (storedUser && sessionToken) {
          const parsedUser = JSON.parse(storedUser);
          // Verify session is still valid (created within last 30 days)
          const sessionData = JSON.parse(sessionToken);
          const sessionAge = Date.now() - new Date(sessionData.createdAt).getTime();
          const thirtyDays = 30 * 24 * 60 * 60 * 1000;
          
          if (sessionAge < thirtyDays) {
            setUser(parsedUser);
          } else {
            // Session expired
            localStorage.removeItem('bridallink_user');
            localStorage.removeItem('bridallink_session');
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    try {
      // In a real app, this would call Supabase Auth
      // For now, we'll create a simple local account system
      
      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem('bridallink_users') || '[]');
      const userExists = existingUsers.find((u: any) => u.email === email);
      
      if (userExists) {
        throw new Error('An account with this email already exists');
      }

      // Create new user
      const newUser: User = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email,
        name,
        createdAt: new Date().toISOString()
      };

      // Store password hash (in production, use proper bcrypt)
      const hashedPassword = btoa(password); // Simple encoding for demo
      
      // Save to users list
      existingUsers.push({ ...newUser, password: hashedPassword });
      localStorage.setItem('bridallink_users', JSON.stringify(existingUsers));

      // Create session
      const sessionToken = {
        userId: newUser.id,
        createdAt: new Date().toISOString()
      };

      localStorage.setItem('bridallink_user', JSON.stringify(newUser));
      localStorage.setItem('bridallink_session', JSON.stringify(sessionToken));

      setUser(newUser);

      // Migrate any existing localStorage data to user-specific storage
      await migrateLocalDataToUser(newUser.id);

    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const existingUsers = JSON.parse(localStorage.getItem('bridallink_users') || '[]');
      const userAccount = existingUsers.find((u: any) => u.email === email);
      
      if (!userAccount) {
        throw new Error('No account found with this email');
      }

      // Verify password
      const hashedPassword = btoa(password);
      if (userAccount.password !== hashedPassword) {
        throw new Error('Incorrect password');
      }

      // Create user object without password
      const { password: _, ...userWithoutPassword } = userAccount;
      const authenticatedUser: User = userWithoutPassword;

      // Create session
      const sessionToken = {
        userId: authenticatedUser.id,
        createdAt: new Date().toISOString()
      };

      localStorage.setItem('bridallink_user', JSON.stringify(authenticatedUser));
      localStorage.setItem('bridallink_session', JSON.stringify(sessionToken));

      setUser(authenticatedUser);

      // Load user's data
      await loadUserData(authenticatedUser.id);

    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // Save current data before signing out
      if (user) {
        await saveUserData(user.id);
      }

      localStorage.removeItem('bridallink_user');
      localStorage.removeItem('bridallink_session');
      setUser(null);

      // Clear current session data (but keep it saved under user ID)
      // Don't clear the user-specific data
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const updateProfile = async (name: string) => {
    try {
      if (!user) throw new Error('No user logged in');

      const updatedUser = { ...user, name };
      
      // Update in users list
      const existingUsers = JSON.parse(localStorage.getItem('bridallink_users') || '[]');
      const userIndex = existingUsers.findIndex((u: any) => u.id === user.id);
      if (userIndex !== -1) {
        existingUsers[userIndex] = { ...existingUsers[userIndex], name };
        localStorage.setItem('bridallink_users', JSON.stringify(existingUsers));
      }

      localStorage.setItem('bridallink_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  // Helper function to migrate existing data to user-specific storage
  const migrateLocalDataToUser = async (userId: string) => {
    try {
      const dataKeys = [
        'bridallink_guests',
        'bridallink_tasks',
        'bridallink_budget_categories',
        'bridallink_budget_expenses',
        'bridallink_total_budget',
        'bridallink_documents',
        'bridallink_vendors',
        'bridallink_calendar_events',
        'bridallink_gift_registries',
        'premiumSubscription'
      ];

      const userData: any = {};

      dataKeys.forEach(key => {
        const data = localStorage.getItem(key);
        if (data) {
          userData[key] = data;
        }
      });

      // Save to user-specific storage
      localStorage.setItem(`bridallink_user_data_${userId}`, JSON.stringify(userData));
      
      console.log('✅ Migrated local data to user account');
    } catch (error) {
      console.error('Error migrating data:', error);
    }
  };

  // Helper function to load user-specific data
  const loadUserData = async (userId: string) => {
    try {
      const userDataKey = `bridallink_user_data_${userId}`;
      const userData = localStorage.getItem(userDataKey);

      if (userData) {
        const parsedData = JSON.parse(userData);
        
        // Restore all user data to active localStorage
        Object.entries(parsedData).forEach(([key, value]) => {
          if (typeof value === 'string') {
            localStorage.setItem(key, value);
          }
        });

        console.log('✅ Loaded user data from account');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  // Helper function to save user-specific data
  const saveUserData = async (userId: string) => {
    try {
      const dataKeys = [
        'bridallink_guests',
        'bridallink_tasks',
        'bridallink_budget_categories',
        'bridallink_budget_expenses',
        'bridallink_total_budget',
        'bridallink_documents',
        'bridallink_vendors',
        'bridallink_calendar_events',
        'bridallink_gift_registries',
        'premiumSubscription'
      ];

      const userData: any = {};

      dataKeys.forEach(key => {
        const data = localStorage.getItem(key);
        if (data) {
          userData[key] = data;
        }
      });

      // Save to user-specific storage
      localStorage.setItem(`bridallink_user_data_${userId}`, JSON.stringify(userData));
      
      console.log('✅ Saved user data to account');
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  // Auto-save user data periodically
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      saveUserData(user.id);
    }, 60000); // Save every minute

    return () => clearInterval(interval);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, isLoading, signUp, signIn, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

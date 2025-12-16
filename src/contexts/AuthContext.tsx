import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role?: 'club' | 'scout') => Promise<boolean>;
  signup: (userData: any) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('sportsReelsUser');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('sportsReelsUser');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, role: 'club' | 'scout' = 'club'): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo credentials check
      const validCredentials = [
        { email: 'club@demo.com', password: 'password123', role: 'club' },
        { email: 'scout@demo.com', password: 'password123', role: 'scout' },
        { email: 'admin@sportsreels.com', password: 'admin123', role: 'club' }
      ];

      const credential = validCredentials.find(
        cred => cred.email === email && cred.password === password
      );

      if (credential) {
        // Create user object based on role
        const mockUser: User = {
          id: Date.now().toString(),
          role: role,
          name: role === 'club' ? 'Club Manager' : 'Scout User',
          email,
          phone: '+1234567890',
          createdAt: new Date().toISOString()
        };
        
        setUser(mockUser);
        localStorage.setItem('sportsReelsUser', JSON.stringify(mockUser));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData: any): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: Date.now().toString(),
        role: userData.role,
        name: userData.role === 'scout' ? `${userData.firstName} ${userData.lastName}` : userData.adminName,
        email: userData.email,
        phone: userData.phone,
        createdAt: new Date().toISOString()
      };
      
      setUser(newUser);
      localStorage.setItem('sportsReelsUser', JSON.stringify(newUser));
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sportsReelsUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
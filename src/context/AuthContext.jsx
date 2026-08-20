import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const mockUser = {
  id: 'user-001',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
  phone: '+1 (555) 234-5678',
  addresses: [
    {
      id: 'addr-1',
      type: 'Home',
      fullName: 'Alex Johnson',
      address: '123 Main Street, Apt 4B',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      isDefault: true,
    },
  ],
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('shopora_user') || 'null'));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('shopora_user', JSON.stringify(user));
  }, [user]);

  const login = async (email, password) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsLoading(false);
    if (email && password) {
      setUser({ ...mockUser, email });
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const register = async (name, email, password) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsLoading(false);
    setUser({ ...mockUser, name, email });
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

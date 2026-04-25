// import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
// import api from '../lib/api';

// interface User {
//   id: number;
//   username: string;
//   email: string;
//   role: 'admin' | 'editor' | 'viewer';
//   full_name?: string;
//   avatar_url?: string;
// }

// interface AuthContextType {
//   user: User | null;
//   loading: boolean;
//   login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
//   logout: () => void;
//   isAdmin: () => boolean;
//   isAuthenticated: boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error('useAuth must be used within AuthProvider');
//   return context;
// };

// interface AuthProviderProps {
//   children: ReactNode;
// }

// export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const storedUser = localStorage.getItem('user');
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//     setLoading(false);
//   }, []);

//   const login = async (email: string, password: string) => {
//     try {
//       const response = await api.post('/auth/login', { email, password });
      
//       if (response.data.success) {
//         const { user, token } = response.data.data;
//         localStorage.setItem('token', token);
//         localStorage.setItem('user', JSON.stringify(user));
//         setUser(user);
//         return { success: true };
//       }
//       return { success: false, message: response.data.message };
//     } catch (error: any) {
//       return { success: false, message: error.response?.data?.message || 'Login failed' };
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     setUser(null);
//     window.location.href = '/';
//   };

//   const isAdmin = () => user?.role === 'admin';

//   return (
//     <AuthContext.Provider value={{ user, loading, login, logout, isAdmin, isAuthenticated: !!user }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };


import React, { createContext, useState, useContext, useEffect,type ReactNode } from 'react';
import api from '../lib/api';

interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  full_name?: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isAdmin: () => boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data.success) {
        const { user, token } = response.data.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    sessionStorage.setItem('hasVisitedBefore', 'true'); // ✅ logout ke baad welcome page nahi
    window.location.href = '/';
  };

  const isAdmin = () => user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
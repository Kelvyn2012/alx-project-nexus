import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { GET_ME } from '../graphql/queries';
import { setTokens, clearTokens, getToken, setUser as setStoredUser, getUser as getStoredUser } from '../utils/auth';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [getMe] = useLazyQuery(GET_ME);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const token = getToken();
      const storedUser = getStoredUser();

      if (token && storedUser) {
        setUser(storedUser);
        setLoading(false);

        // Optionally refresh user data from server
        try {
          const { data } = await getMe();
          if (data?.me) {
            setUser(data.me);
            setStoredUser(data.me);
          }
        } catch (error) {
          console.error('Failed to refresh user data:', error);
        }
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, [getMe]);

  const login = (token, refreshToken, userData) => {
    setTokens(token, refreshToken);
    setUser(userData);
    setStoredUser(userData);
    navigate('/');
  };

  const register = (token, refreshToken, userData) => {
    setTokens(token, refreshToken);
    setUser(userData);
    setStoredUser(userData);
    navigate('/');
  };

  const logout = () => {
    clearTokens();
    setUser(null);
    navigate('/login');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

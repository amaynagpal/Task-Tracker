import React, { createContext, useReducer, useEffect } from 'react';
import api from '../services/api';
import setAuthToken from '../utils/setAuthToken';

const AuthContext = createContext();

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null,
  error: null
};

const authReducer = (state, action) => {
  console.log('Auth Reducer Action:', action.type, action.payload);
  
  switch (action.type) {
    case 'USER_LOADED':
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload,
        error: null
      };
    case 'REGISTER_SUCCESS':
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case 'REGISTER_FAIL':
    case 'AUTH_ERROR':
    case 'LOGIN_FAIL':
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: action.payload
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
};

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load User
  const loadUser = async () => {
    console.log('Loading user...');
    
    // Set loading state
    dispatch({ type: 'SET_LOADING' });
    
    if (localStorage.token) {
      console.log('Token found, setting auth token');
      setAuthToken(localStorage.token);
    } else {
      console.log('No token found');
      dispatch({ type: 'AUTH_ERROR' });
      return;
    }

    try {
      const res = await api.get('/api/auth');
      console.log('User data received:', res.data);
      
      dispatch({
        type: 'USER_LOADED',
        payload: res.data
      });
    } catch (err) {
      console.error('Error loading user:', err);
      console.error('Error response:', err.response?.data);
      
      dispatch({
        type: 'AUTH_ERROR',
        payload: err.response?.data?.msg || 'Authentication error'
      });
    }
  };

  // Load user when component mounts
  useEffect(() => {
    console.log('AuthContext mounted, loading user');
    loadUser();
  }, []);

  // Register User
  const register = async (formData) => {
    try {
      console.log('Registering user with data:', formData);
      const res = await api.post('/api/users', formData);
      console.log('Registration response:', res.data);
      
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: res.data
      });
      
      // Set the token in headers immediately
      setAuthToken(res.data.token);
      
      // Load user data after setting token
      await loadUser();
      
      return { success: true };
    } catch (err) {
      console.error('Registration error:', err);
      console.error('Registration error response:', err.response?.data);
      
      dispatch({
        type: 'REGISTER_FAIL',
        payload: err.response?.data?.msg || 'Registration failed'
      });
      
      return { success: false, error: err.response?.data?.msg || 'Registration failed' };
    }
  };

  // Login User
  const login = async (formData) => {
    try {
      console.log('Logging in user with email:', formData.email);
      const res = await api.post('/api/auth', formData);
      console.log('Login response:', res.data);
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: res.data
      });
      
      // Set the token in headers immediately
      setAuthToken(res.data.token);
      
      // Load user data after setting token
      await loadUser();
      
      return { success: true };
    } catch (err) {
      console.error('Login error:', err);
      console.error('Login error response:', err.response?.data);
      
      dispatch({
        type: 'LOGIN_FAIL',
        payload: err.response?.data?.msg || 'Invalid credentials'
      });
      
      return { success: false, error: err.response?.data?.msg || 'Invalid credentials' };
    }
  };

  // Logout
  const logout = () => {
    console.log('Logging out user');
    dispatch({ type: 'LOGOUT' });
  };

  // Clear Errors
  const clearErrors = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Update Profile
  const updateProfile = async (formData) => {
    try {
      console.log('Updating profile with data:', formData);
      const res = await api.put('/api/users/profile', formData);
      console.log('Update profile response:', res.data);
      
      dispatch({
        type: 'USER_LOADED',
        payload: res.data
      });
      
      return { success: true };
    } catch (err) {
      console.error('Update profile error:', err);
      console.error('Update profile error response:', err.response?.data);
      
      return { success: false, error: err.response?.data?.msg || 'Failed to update profile' };
    }
  };

  console.log('Current auth state:', state);

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        error: state.error,
        register,
        login,
        logout,
        clearErrors,
        loadUser,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
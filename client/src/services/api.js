import axios from 'axios';

// Create an instance of axios
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to include the token in every request
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    
    console.log(`🔒 Making ${config.method.toUpperCase()} request to: ${config.url}`);
    console.log('📝 Token present:', !!token);
    
    if (token) {
      config.headers['x-auth-token'] = token;
      console.log('✅ Token added to request headers');
    } else {
      console.log('⚠️ No token found in localStorage');
    }
    
    if (config.data) {
      console.log('📤 Request data:', config.data);
    }
    
    return config;
  },
  error => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor for global error handling
api.interceptors.response.use(
  response => {
    console.log(`✅ Response from ${response.config.url}:`, response.status);
    console.log('📥 Response data:', response.data);
    return response;
  },
  error => {
    console.error('❌ API Error:', error);
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('📋 Error Response Data:', error.response.data);
      console.error('📋 Error Status:', error.response.status);
      console.error('📋 Error Headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('📡 No response received');
      console.error('Is your backend server running on port 5000?');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('⚠️ Error Message:', error.message);
    }
    
    // Handle session expiration (401 Unauthorized)
    if (error.response && error.response.status === 401) {
      console.log('🔒 Unauthorized access detected');
      
      // Only clear token and redirect if we're not on auth pages
      const publicPaths = ['/login', '/register', '/'];
      if (!publicPaths.includes(window.location.pathname)) {
        console.log('🔄 Redirecting to login...');
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
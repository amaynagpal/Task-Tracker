import api from '../services/api';

// Set or remove the token in the headers
const setAuthToken = token => {
  console.log('setAuthToken called with token:', !!token);
  
  if (token) {
    // Apply token to every request header
    api.defaults.headers.common['x-auth-token'] = token;
    console.log('✅ Token set in axios defaults');
  } else {
    // Delete auth header
    delete api.defaults.headers.common['x-auth-token'];
    console.log('❌ Token removed from axios defaults');
  }
};

export default setAuthToken;
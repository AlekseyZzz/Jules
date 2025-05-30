import axios from 'axios';

const API_URL = '/auth'; // Assuming backend is served on the same domain or proxied

// Function to get the JWT token from localStorage
export const getToken = () => {
  return localStorage.getItem('pokerDevToken');
};

// Function to set the JWT token in localStorage
export const setToken = (token) => {
  localStorage.setItem('pokerDevToken', token);
};

// Function to remove the JWT token from localStorage
export const removeToken = () => {
  localStorage.removeItem('pokerDevToken');
};

// Configure axios to include the token in headers if it exists
const apiClient = axios.create({
  baseURL: API_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export const registerUser = async (userData) => {
  try {
    const response = await apiClient.post('/register', userData);
    return response.data;
  } catch (error) {
    // Throw a more structured error object
    throw error.response ? error.response.data : { msg: 'Network error or server not responding' };
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await apiClient.post('/login', credentials);
    if (response.data && response.data.access_token) {
      setToken(response.data.access_token);
      // You might also want to store refresh_token if using it
      // if (response.data.refresh_token) {
      //   localStorage.setItem('pokerDevRefreshToken', response.data.refresh_token);
      // }
    }
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { msg: 'Network error or server not responding' };
  }
};

// Example function to get user profile (protected route)
export const getUserProfile = async () => {
    try {
        const response = await apiClient.get('/profile');
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            // Token might be expired or invalid, try to refresh or logout
            removeToken(); // Simple logout
        }
        throw error.response ? error.response.data : { msg: 'Network error or server not responding' };
    }
};

// Function to handle logout
export const logoutUser = () => {
    removeToken();
    // localStorage.removeItem('pokerDevRefreshToken'); // if using refresh tokens
    // Potentially notify backend about logout if needed
};

export default {
  registerUser,
  loginUser,
  getUserProfile,
  logoutUser,
  getToken,
  setToken,
  removeToken
};

import axios from 'axios'; // We can use the global instance or create one if needed
                           // For simplicity, let's assume the backend is on the same host or proxied
                           // and auth headers are handled by a global interceptor if set up in authService or main axios instance.

// If your authService.js configures a global axios instance, you might not need to import it explicitly here
// or you might want to create a dedicated instance for /api routes.
// For this example, let's assume the /api prefix is standard.
const API_BASE_URL = '/api'; // All session routes are under /api

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  // We assume an interceptor (like in authService) is already in place to add the JWT token
});

// Re-add interceptor if not globally configured or if authService's instance isn't used
// This is important to ensure requests are authenticated.
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('pokerDevToken'); // Assuming this is where the token is stored
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// Helper to handle API errors
const handleError = (error) => {
  // Log error or format it
  console.error("API Call Error:", error.response || error.message);
  // Throw a more structured error object for components to use
  throw error.response ? error.response.data : { msg: 'Network error or server not responding', _rawError: error };
};

export const createSession = async (sessionData) => {
  try {
    const response = await apiClient.post('/sessions', sessionData);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getUserSessions = async () => {
  try {
    const response = await apiClient.get('/sessions');
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getSessionById = async (sessionId) => {
  try {
    const response = await apiClient.get(`/sessions/${sessionId}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const updateSession = async (sessionId, sessionData) => {
  try {
    const response = await apiClient.put(`/sessions/${sessionId}`, sessionData);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const deleteSession = async (sessionId) => {
  try {
    const response = await apiClient.delete(`/sessions/${sessionId}`);
    return response.data; // Or return status, as DELETE might return 204 No Content
  } catch (error) {
    handleError(error);
  }
};

export default {
  createSession,
  getUserSessions,
  getSessionById,
  updateSession,
  deleteSession,
};

import axios from "axios";

const backendUrl = "http://localhost:5000"; // Replace with your backend URL

axios.defaults.withCredentials = true; // Enable sending cookies with requests
export const api = axios.create({
  baseURL: backendUrl,
  withCredentials: true, // Include credentials in requests
});


// Add an interceptor to fetch CSRF token before POST requests
api.interceptors.request.use(async (config) => {
  // Only fetch CSRF token for POST/PUT/DELETE/PATCH requests
  if (config.method && ['post', 'put', 'delete', 'patch'].includes(config.method)) {
      try {
          const csrf_cookie = document.cookie
            .split('; ')
            .find(row => row.startsWith('csrf_access_token='));
          
          const csrf_token = csrf_cookie?.split('=')[1];
          config.headers['X-CSRF-TOKEN'] = csrf_token;
      } catch (error) {
          console.error('Error fetching CSRF token:', error);
      }
  }
  return config;
});
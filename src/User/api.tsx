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
          const response = await axios.get(backendUrl + '/users/get-csrf-token', {
              withCredentials: true
          });
          config.headers['X-CSRF-TOKEN'] = response.data.csrf_token;
      } catch (error) {
          console.error('Error fetching CSRF token:', error);
      }
  }
  return config;
});
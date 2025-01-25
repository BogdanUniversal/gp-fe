import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401) {
      originalRequest._retry = true;
      try {
        const csrfRefreshToken = document.cookie.split('; ')
        .find(row => row.startsWith('csrf_refresh_token='))
        ?.split('=')[1];

        await axios.post("/users/refresh", {}, {
          baseURL: api.defaults.baseURL,
          withCredentials: true,
          headers: {
            'X-CSRF-TOKEN': csrfRefreshToken,
          },
        });
        return api(originalRequest);
      } catch (error) {
        console.log(error);
      }
    }
    return Promise.reject(error);
  }
);
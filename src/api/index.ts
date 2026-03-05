import axios, { AxiosError } from "axios";
import type { InternalAxiosRequestConfig } from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach Access Token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      console.log(
        `[API] Request to ${config.url} with token: ${accessToken.substring(0, 20)}...`,
      );
    } else {
      console.log(`[API] Request to ${config.url} without token`);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor: Handle 401 and Refresh Token
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) {
          throw new Error("No refresh token");
        }

        const response = await axios.post(`${API_BASE_URL}/users/refresh/`, {
          refresh: refreshToken,
        });

        const newAccessToken = response.data.access;
        localStorage.setItem("access_token", newAccessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
export { resourcesApi } from "./resources.api";
export { reportsApi, reviewsApi, wishlistApi } from "./support.api";

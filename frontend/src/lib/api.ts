import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);

export const restaurantAPI = {
  getAll: (params?: any) => apiClient.get("/restaurants", { params }),
  getById: (id: string) => apiClient.get(`/restaurants/${id}`),
};

export const analyticsAPI = {
  getOverview: (params: any) =>
    apiClient.get("/analytics/overview", { params }),
  getTopRestaurants: (params: any) =>
    apiClient.get("/analytics/top-restaurants", { params }),
  getOrderTrends: (restaurantId: string, params: any) =>
    apiClient.get(`/analytics/restaurant/${restaurantId}/trends`, { params }),
};

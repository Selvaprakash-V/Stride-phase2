import axiosInstance from "../lib/axios";

export const userApi = {
  getMe: async () => {
    const response = await axiosInstance.get("/users/me");
    return response.data;
  },
  updateMe: async (payload) => {
    const response = await axiosInstance.put("/users/me", payload);
    return response.data;
  },
};

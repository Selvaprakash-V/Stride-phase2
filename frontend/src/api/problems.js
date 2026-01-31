import axiosInstance from "../lib/axios";

export const problemApi = {
  getProblems: async () => {
    const response = await axiosInstance.get("/problems");
    return response.data;
  },
  getProblemById: async (id) => {
    const response = await axiosInstance.get(`/problems/${id}`);
    return response.data;
  },
  createProblem: async (payload) => {
    const response = await axiosInstance.post("/problems", payload);
    return response.data;
  },
  markProblemSolved: async (payload) => {
    const response = await axiosInstance.post("/problems/solved", payload);
    return response.data;
  },
  getMySolvedProblems: async () => {
    const response = await axiosInstance.get("/problems/my-solved");
    return response.data;
  },
};

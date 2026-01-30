import { useQuery } from "@tanstack/react-query";
import { problemApi } from "../api/problems";

export const useProblems = () => {
  return useQuery({
    queryKey: ["problems"],
    queryFn: problemApi.getProblems,
  });
};

export const useProblemById = (id) => {
  return useQuery({
    queryKey: ["problem", id],
    queryFn: () => problemApi.getProblemById(id),
    enabled: !!id,
  });
};

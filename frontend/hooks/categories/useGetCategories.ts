import { getALlCategories } from "@/app/api/categories/route";
import { useQuery } from "@tanstack/react-query";

export const useGetCategories = () => {
  const query = useQuery({
    queryKey: ["categories"],
    queryFn: getALlCategories,
  });

  return query;
};

import { createCategory } from "@/app/api/categories/route";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useCreateCategory = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  return mutation;
};

export default useCreateCategory;

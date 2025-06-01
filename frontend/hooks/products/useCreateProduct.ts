import { createProduct } from "@/app/api/products/route";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useCreateProduct = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return mutation;
};

export default useCreateProduct;

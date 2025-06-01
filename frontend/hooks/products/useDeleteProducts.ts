import { deleteProduct } from "@/app/api/products/route";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (productId: string) => await deleteProduct(productId),
    onSuccess: () => {
      toast.success("Product deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      //   queryClient.invalidateQueries({ queryKey: ["product", productId] });
    },
    onError: (error: unknown) => {
      toast.error("Failed to delete product");
      console.error("Error deleting product:", error);
    },
  });

  return mutation;
};

export default useDeleteProduct;

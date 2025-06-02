import { createAndUpdateShoppingCart } from "@/app/api/carts/route";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const useCreateCart = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createAndUpdateShoppingCart,
    onSuccess: (response) => {
      if (response.success && response.data) {
        const cartId = response.data._id;

        queryClient.setQueryData(["cart", cartId], response.data);
        queryClient.invalidateQueries({
          queryKey: ["cart", cartId],
        });
        toast.success(response.message || "Cart created successfully");
      }
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to create cart: ${errorMessage}`);
    },
  });

  return mutation;
};

export default useCreateCart;

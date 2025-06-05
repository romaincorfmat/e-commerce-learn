import { createOrder } from "@/app/api/orders/route";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const useCreateOrder = (cartId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (cartId: string) => {
      if (!cartId) {
        throw new Error("Cart ID is required");
      }
      return createOrder(cartId);
    },
    onSuccess: () => {
      // Invalidate cart query to refresh the data
      if (cartId) {
        queryClient.invalidateQueries({
          queryKey: ["cart", cartId],
        });
      }

      // Invalidate orders to refresh orders list
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });

      toast.success("Order sent successfully");
    },
    onError: (error) => {
      console.error("Order creation failed:", error);
      toast.error("Failed to create order. Please try again.");
    },
  });

  return mutation;
};

export default useCreateOrder;

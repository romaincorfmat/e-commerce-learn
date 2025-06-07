import { updateOrderStatus } from "@/app/api/orders/route";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      orderId,
      status,
    }: {
      orderId: string;
      status: string;
    }) => {
      const response = await updateOrderStatus(orderId, status);
      if (!response.success) {
        throw new Error(
          response.error?.message || "Failed to update order status"
        );
      }
      return orderId;
    },
    onSuccess: (orderId: string) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });

      toast.success("Order status updated successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
};

export default useUpdateOrderStatus;

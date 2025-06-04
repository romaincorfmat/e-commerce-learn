import { createOrder } from "@/app/api/orders/route";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const useCreateOrder = (cartId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (cartId: string) => createOrder(cartId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart", cartId],
      });
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
      toast.success("Order sent successfully");
    },
  });

  return mutation;
};

export default useCreateOrder;

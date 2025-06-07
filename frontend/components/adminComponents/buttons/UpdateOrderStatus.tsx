import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useUpdateOrderStatus from "@/hooks/orders/useUpdateOrderStatus";
import React from "react";

interface UpdateOrderStatusProps {
  order: Order;
  onUpdate: (status: string) => void;
}

const UpdateOrderStatus = ({ order, onUpdate }: UpdateOrderStatusProps) => {
  const { mutate: updateOrderStatus } = useUpdateOrderStatus();

  const handleValueChange = (status: string) => {
    updateOrderStatus({ orderId: order._id, status: status });
    onUpdate(status);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Update Status</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleValueChange("pending")}>
          Pending
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleValueChange("completed")}>
          Completed
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleValueChange("cancelled")}
          className="text-destructive"
        >
          Cancelled
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UpdateOrderStatus;

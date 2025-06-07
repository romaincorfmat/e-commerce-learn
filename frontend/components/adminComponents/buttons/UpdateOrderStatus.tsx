import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useUpdateOrderStatus from "@/hooks/orders/useUpdateOrderStatus";
import React, { useState } from "react";
import ConfirmModal from "@/components/modal/ConfirmModal";

interface UpdateOrderStatusProps {
  order: Order;
  onUpdate: (status: string) => void;
}

const UpdateOrderStatus = ({ order, onUpdate }: UpdateOrderStatusProps) => {
  const { mutate: updateOrderStatus } = useUpdateOrderStatus();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);

  const handleValueChange = (status: string) => {
    setPendingStatus(status);
    setIsConfirmOpen(true);
  };

  const handleConfirm = () => {
    if (pendingStatus) {
      updateOrderStatus(
        { orderId: order._id, status: pendingStatus },
        {
          onSuccess: () => {
            onUpdate(pendingStatus);
            setPendingStatus(null);
          },
        }
      );
    }
  };

  return (
    <>
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

      <ConfirmModal
        isOpen={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title="Cancel Order"
        description="Are you sure you want to cancel this order? This action cannot be undone."
        onConfirm={handleConfirm}
        confirmText={
          pendingStatus === "cancelled"
            ? "Yes, cancel order"
            : "Yes, update status"
        }
        destructive={pendingStatus === "cancelled"}
      />
    </>
  );
};

export default UpdateOrderStatus;

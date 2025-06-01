import useDeleteProduct from "@/hooks/products/useDeleteProducts";
import { Trash2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";

interface Props {
  productId: string;
}

const DeleteProductButton = ({ productId }: Props) => {
  const deleteProductMutation = useDeleteProduct();

  const handleAction = async (productId: string) => {
    try {
      deleteProductMutation.mutate(productId);
      console.log("Delete product result: ", deleteProductMutation);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete product");
    }
  };
  return (
    <button
      onClick={() => handleAction(productId)}
      className="flex items-center justify-between w-full"
    >
      <p className="font-semibold text-red-500">Delete Product</p>
      <Trash2 className="text-red-500" />
    </button>
  );
};

export default DeleteProductButton;

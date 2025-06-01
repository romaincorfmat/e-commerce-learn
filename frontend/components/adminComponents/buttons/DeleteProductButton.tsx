import useDeleteProduct from "@/hooks/products/useDeleteProducts";
import { Trash2 } from "lucide-react";
import React from "react";

interface Props {
  productId: string;
}

const DeleteProductButton = ({ productId }: Props) => {
  const deleteProductMutation = useDeleteProduct();

  const handleAction = async (productId: string) => {
    deleteProductMutation.mutate(productId);
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

import { useUser } from "@/contexts/UserContext";
import useCreateCart from "@/hooks/carts/useCreateCart";
import { PlusIcon } from "lucide-react";

interface AddCartItemProps {
  items: {
    product: {
      _id: string;
      name: string;
      unitPrice: number;
    };
    productVariant: {
      productSku: string;
      quantity: number;
    };
  }[];
}

const AddCartItem = ({ items }: AddCartItemProps) => {
  const { user } = useUser();
  const addItemCartMutation = useCreateCart();

  if (!user?._id) {
    return <div>Please log in to add items to your cart</div>;
  }

  return (
    <div
      onClick={() => addItemCartMutation.mutate({ userId: user._id, items })}
      className="flex items-center justify-between border shadow-md rounded-md px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-800 transition-all duration-200 ease-in-out"
    >
      Add to Cart
      <PlusIcon />
    </div>
  );
};

export default AddCartItem;

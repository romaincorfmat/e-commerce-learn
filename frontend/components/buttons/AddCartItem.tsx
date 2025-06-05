import { useUser } from "@/contexts/UserContext";
import useCreateCart from "@/hooks/carts/useCreateCart";

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
    >
      AddCartItem
    </div>
  );
};

export default AddCartItem;

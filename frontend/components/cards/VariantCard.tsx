import React from "react";
import { Card } from "../ui/card";
import AddCartItem from "../buttons/AddCartItem";

interface Props {
  name: string;
  variant: Variant;
  productId: string;
  productPrice: number;
}

const VariantCard = ({ variant, name, productId, productPrice }: Props) => {
  return (
    <Card
      className="px-2 rounded-sm cursor-pointer py-2 gap-2 flex flex-col justify-between hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 ease-in-out"
      onClick={() => {}}
    >
      <h2 className="font-semibold line-clamp-1">{name}</h2>
      <div className="flex gap-2 ">
        <p>
          Color:{" "}
          <span className="font-semibold">{variant.attributes.color}</span>
        </p>
        <p>
          Size: <span className="font-semibold">{variant.attributes.size}</span>
        </p>
      </div>
      <p>
        <span className="font-semibold">{variant.stockLevel}</span> in stock
      </p>
      <AddCartItem
        items={[
          {
            product: {
              _id: productId,
              name,
              unitPrice: productPrice,
            },
            productVariant: {
              productSku: variant.sku,
              quantity: 1,
            },
          },
        ]}
      />
    </Card>
  );
};

export default VariantCard;

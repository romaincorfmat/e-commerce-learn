import useGetProduct from "@/hooks/products/useGetProduct";
import React from "react";
import Image from "next/image";

interface Props {
  item: {
    productId: string;
    totalPrice: number;
    productVariant: {
      productSku: string;
      quantity: number;
      unitPrice: number;
    };
  };
  index: number;
}

const CartDetailsCard = ({ item }: Props) => {
  const { data } = useGetProduct(item.productId);

  const productData = data?.data;

  if (!productData) {
    return <div>Product not found</div>;
  }
  const productName = productData.name;
  const productImage = productData.imageUrl;

  return (
    <div
      key={item.productVariant.productSku}
      className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4 border-t my-2 md:my-4 pt-2"
    >
      <div className="flex items-center">
        {productImage ? (
          <Image
            src={productImage}
            width={36}
            height={36}
            alt={productName}
            className="h-10 w-10 md:h-12 md:w-12 rounded-md object-cover"
          />
        ) : (
          <div className="h-10 w-10 md:h-12 md:w-12 rounded-md bg-gray-300">
            {" "}
          </div>
        )}
        <p className="ml-2 md:hidden text-sm font-medium">{productName}</p>
      </div>
      <div className="flex justify-end items-center md:hidden">
        <p className="text-sm text-right">
          ${item.productVariant.unitPrice} unit price
        </p>
      </div>
      <p className="hidden md:block">{productName}</p>
      <p className="hidden md:block">${item.productVariant.unitPrice}</p>
      <p className="text-sm md:text-base font-bold col-span-1">
        X {item.productVariant.quantity} pieces
      </p>
      <p className="text-right text-sm md:text-base">
        $<span className="font-semibold">{item.totalPrice}</span>
      </p>
    </div>
  );
};

export default CartDetailsCard;

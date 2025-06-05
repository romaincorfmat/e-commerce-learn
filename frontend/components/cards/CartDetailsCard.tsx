import React from "react";
import Image from "next/image";
import Link from "next/link";

interface Props {
  item: CartItem;
  isLoading: boolean;
  error: boolean | null;
}

const CartDetailsCard = ({ item, isLoading, error }: Props) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4 border-t my-2 md:my-4 pt-2">
      <div className="flex items-center">
        <Link
          href={`/products/${item.product._id}`}
          className="flex items-center"
        >
          {isLoading ? (
            <div className="h-10 w-10 md:h-12 md:w-12 rounded-md bg-gray-300 animate-pulse">
              {" "}
            </div>
          ) : error ? (
            <div className="h-10 w-10 md:h-12 md:w-12 rounded-md bg-gray-300">
              {" "}
            </div>
          ) : item.product.imageUrl && !error && !isLoading ? (
            <Image
              src={item.product.imageUrl}
              width={36}
              height={36}
              alt={item.product.name}
              className="h-10 w-10 md:h-12 md:w-12 rounded-md object-cover"
            />
          ) : (
            <div className="h-10 w-10 md:h-12 md:w-12 rounded-md bg-gray-300">
              {" "}
            </div>
          )}
        </Link>
        <p className="ml-2 md:hidden text-sm font-medium">
          {item.product.name}
        </p>
      </div>
      <div className="flex justify-end items-center md:hidden">
        <p className="text-sm text-right">
          ${item.productVariant.unitPrice} unit price
        </p>
      </div>
      <p className="hidden md:block">{item.product.name}</p>
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

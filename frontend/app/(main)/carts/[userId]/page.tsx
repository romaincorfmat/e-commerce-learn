"use client";
import CartDetailsCard from "@/components/cards/CartDetailsCard";
import { Button } from "@/components/ui/button";
import useGetCart from "@/hooks/carts/useGetCart";
import { useParams } from "next/navigation";
import React from "react";

const ShoppingCartPage = () => {
  const params = useParams();
  const userId = params.userId as string;

  console.log("User ID:", userId);
  const { data, isLoading, error } = useGetCart(userId);

  if (isLoading) {
    return <div>Loading your cart...</div>;
  }

  if (error) {
    return <div>Error loading cart: {error.message}</div>;
  }
  console.log("Data:", data);

  const cartData = data?.data;

  const cartTotalPrice = cartData?.items
    .reduce((total, item) => total + item.totalPrice, 0)
    .toFixed(2);

  console.log("Cart Total Price:", cartTotalPrice);
  console.log("Cart Data:", cartData);
  return (
    <div className="flex flex-col gap-4">
      <div className="border p-6">
        <h1 className="h1-title-page">Your Cart</h1>
        {cartData?.items.map((item, index) => (
          <CartDetailsCard
            key={item.productVariant.productSku}
            item={item}
            index={index}
          />
        ))}
        <div className="flex justify-end gap-4 items-center mt-4">
          <p className="text-lg">Total: </p>
          <p className="text-xl font-bold">${cartTotalPrice}</p>
        </div>
      </div>
      <div className="w-full flex justify-end">
        <Button className="w-fit max-md:w-full">Confirm Order</Button>
      </div>
    </div>
  );
};

export default ShoppingCartPage;

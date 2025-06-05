"use client";
import CartDetailsCard from "@/components/cards/CartDetailsCard";
import { Button } from "@/components/ui/button";
import { CUSTOMER_ROUTES } from "@/constants/route";
import useGetCart from "@/hooks/carts/useGetCart";
import useCreateOrder from "@/hooks/orders/useCreateOrder";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";

const ShoppingCartPage = () => {
  const params = useParams();
  const userId = params.userId as string;

  const { data, isLoading, error, refetch } = useGetCart(userId);
  const cartId = data?.data?._id;
  const confirmOrderMutation = useCreateOrder(cartId || "");

  // Handle order confirmation
  const handleOrderConfirmation = async () => {
    if (cartId) {
      await confirmOrderMutation.mutateAsync(cartId);
      // Manually refetch cart data after successful order creation
      refetch();
    }
  };

  if (isLoading) {
    return <div>Loading your cart...</div>;
  }

  if (error) {
    return <div>Error loading cart: {error.message}</div>;
  }

  const cartData = data?.data;
  const hasItems = cartData && cartData.items && cartData.items.length > 0;

  const cartTotalPrice = hasItems
    ? cartData.items
        .reduce((total, item) => total + item.totalPrice || 0, 0)
        .toFixed(2)
    : "0.00";

  return (
    <>
      {!hasItems ? (
        <div className="flex flex-col items-center justify-center min-h-[688px]">
          <div className="border bg-gray-100 px-8 py-4 rounded-md shadow">
            <h1 className="h1-title-page">Your Cart is Empty</h1>
            <p className="text-lg">Please add items to your cart.</p>
            <Button asChild className="w-full my-4">
              <Link href={CUSTOMER_ROUTES.PRODUCTS}>Start Shopping</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="border p-6">
            <h1 className="h1-title-page">Your Cart</h1>
            {cartData.items.map((item) => (
              <CartDetailsCard
                key={item.productVariant.productSku}
                item={item}
                isLoading={isLoading}
                error={error}
              />
            ))}
            <div className="flex justify-end gap-4 items-center mt-4 border-t pt-4">
              <p className="text-lg">Total: </p>
              <p className="text-xl font-bold">${cartTotalPrice}</p>
            </div>
          </div>
          <div className="w-full flex justify-end">
            <Button
              className="w-fit max-md:w-full"
              onClick={handleOrderConfirmation}
              disabled={confirmOrderMutation.isPending || !cartId}
            >
              {confirmOrderMutation.isPending
                ? "Processing..."
                : "Confirm Order"}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default ShoppingCartPage;

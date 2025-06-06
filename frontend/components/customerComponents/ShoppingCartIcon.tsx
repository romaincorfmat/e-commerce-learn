"use client";
import { useUser } from "@/contexts/UserContext";
import useGetCartStats from "@/hooks/carts/useGetCartStats";
import { ShoppingBagIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const ShoppingCartIcon = () => {
  const { user } = useUser();
  const { data, isLoading, error } = useGetCartStats(user?._id || "");

  if (isLoading || error) {
    return (
      <div className="relative">
        <ShoppingBagIcon className="w-8 h-8 max-sm:w-6 max-sm:h-6" />
      </div>
    );
  }

  const cartStats = data?.data;

  return (
    <Link href={`/carts/${user?._id}`}>
      <div className="relative" aria-label="Shopping Cart">
        {cartStats ? (
          <>
            <div
              className="sm:h-5 sm:w-5 max-sm:h-4 max-sm:w-4 bg-blue-500 rounded-full absolute -top-1 -right-1 flex items-center justify-center"
              aria-label={`${cartStats.totalItems} items in cart`}
            >
              <p className="text-xs text-white font-semibold">
                {cartStats.totalItems}
              </p>
            </div>
            <ShoppingBagIcon
              className="w-8 h-8 max-sm:w-6 max-sm:h-6"
              aria-hidden="true"
            />
          </>
        ) : (
          <ShoppingBagIcon
            className="w-8 h-8 max-sm:w-6 max-sm:h-6"
            aria-hidden="true"
          />
        )}
      </div>
    </Link>
  );
};

export default ShoppingCartIcon;

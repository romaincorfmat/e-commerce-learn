"use client";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { useUser } from "@/contexts/UserContext";
import {
  ADMIN_ROUTES,
  CUSTOMER_ROUTES,
  getCartRoute,
  getOrderRoute,
} from "@/constants/route";

interface Props {
  link: {
    name: string;
    href: string;
  };
  isAdmin?: boolean;
}

const LinkComponent = ({ link, isAdmin = false }: Props) => {
  const pathname = usePathname();
  const { user } = useUser();

  const isActive = () => {
    const fullHref = constructHref();
    return pathname === fullHref || pathname.startsWith(fullHref);
  };

  const constructHref = (): string => {
    // If href already starts with /, return as is (for custom routes)
    if (link.href.startsWith("/")) {
      return link.href;
    }

    if (link.href === "carts" && user) {
      return getCartRoute(user._id);
    }

    if (link.href === "orders" && user) {
      return getOrderRoute(user._id);
    }

    if (isAdmin) {
      switch (link.href) {
        case "dashboard":
          return ADMIN_ROUTES.DASHBOARD;
        case "manage-orders":
          return ADMIN_ROUTES.ORDERS;
        case "stock-entry":
          return ADMIN_ROUTES.STOCK_ENTRY;
        case "manage-products":
          return ADMIN_ROUTES.PRODUCTS;
        case "manage-categories":
          return ADMIN_ROUTES.CATEGORIES;
        case "manage-suppliers":
          return ADMIN_ROUTES.SUPPLIERS;
        case "manage-customers":
          return ADMIN_ROUTES.CUSTOMERS;
        case "reports":
          return ADMIN_ROUTES.REPORTS;
        case "manage-users":
          return ADMIN_ROUTES.USERS;
        default:
          return `/admin/${link.href}`;
      }
    }

    switch (link.href) {
      case "home":
        return CUSTOMER_ROUTES.HOME;
      case "products":
        return CUSTOMER_ROUTES.PRODUCTS;
      case "orders":
        return user ? getOrderRoute(user._id) : CUSTOMER_ROUTES.ORDERS;
      case "profile":
        return CUSTOMER_ROUTES.PROFILE;
      case "wishlist":
        return CUSTOMER_ROUTES.WISHLIST;
      default:
        return `/${link.href}`;
    }
  };

  return (
    <Link
      href={constructHref()}
      className={cn(
        "px-2 py-1 rounded-sm hover:bg-white transition-colors flex items-center justify-between text-sm hover:text-black/60",
        isActive()
          ? "bg-white font-semibold"
          : "text-gray-600 hover:text-gray-900"
      )}
    >
      {link.name}
      <ChevronRight className="h-4 w-4" />
    </Link>
  );
};

export default LinkComponent;

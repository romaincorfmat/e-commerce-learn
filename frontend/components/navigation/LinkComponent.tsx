"use client";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface Props {
  link: {
    name: string;
    href: string;
  };
  route?: string;
}

const LinkComponent = ({ link, route }: Props) => {
  const pathname = usePathname();

  const isActive = () => {
    const fullHref = constructHref();

    if (route) {
      return (
        pathname === fullHref ||
        (pathname.startsWith(fullHref) &&
          pathname.charAt(fullHref.length) === "/")
      );
    }

    return (
      pathname === fullHref ||
      pathname.startsWith(fullHref) ||
      (pathname.startsWith(fullHref) &&
        pathname.charAt(fullHref.length) === "/")
    );
  };

  const constructHref = () => {
    if (link.href.startsWith("/")) {
      return link.href;
    }

    if (route) {
      return `/${route}/${link.href}`;
    }

    return `/${link.href}`;
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

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
  const isActive = (href: string) => {
    return pathname === `/${route}/${href}` || pathname.startsWith(`/${href}`);
  };

  return (
    <Link
      href={link.href}
      className={cn(
        "px-2 py-1 rounded-sm hover:bg-white transition-colors flex items-center justify-between text-sm hover:text-black/60",
        isActive(link.href) ? "bg-white font-semibold" : "text-gray-600"
      )}
    >
      {link.name}
      <ChevronRight className="h-4 w-4" />
    </Link>
  );
};

export default LinkComponent;

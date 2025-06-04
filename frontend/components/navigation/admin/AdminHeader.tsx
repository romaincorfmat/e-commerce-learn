"use client";

import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import SignOutButton from "../../buttons/SignOutButton";
import LinkComponent from "../LinkComponent";
import { NAV_LINKS_ADMIN } from "@/constants/navLinks";

const AdminHeader = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed z-50 bg-gray-100 w-full  min-h-[66px] border-b flex justify-between items-center px-12">
      <h1 className="text-center text-gray-700 text-lg font-bold py-4">
        ShopOnline Admin Dashboard
      </h1>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger className="lg:hidden hover:bg-gray-200 p-1 rounded-full cursor-pointer">
          <MenuIcon className="w-6 h-6 text-gray-700 " />
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-[400px] sm:w-[540px] px-8 pt-12 flex flex-col justify-between py-16"
        >
          <SheetTitle className="hidden">Mobile Navigation</SheetTitle>
          <div className="flex flex-col gap-4 py-2">
            {NAV_LINKS_ADMIN.map((link) => (
              <div key={link.href} onClick={() => setOpen(false)}>
                <LinkComponent link={link} isAdmin />
              </div>
            ))}
          </div>
          <div onClick={() => setOpen(false)}>
            <SignOutButton />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdminHeader;

import React from "react";
import { NAV_LINKS_CUSTOMER } from "@/constants/navLinks";
import LinkComponent from "../LinkComponent";
import SignOutButton from "@/components/buttons/SignOutButton";

const CustomerLeftSidebar = () => {
  return (
    <div className="sticky top-0 left-0 max-lg:hidden lg:w-[250px]  border-r bg-gray-100 overflow-hidden pt-20 pb-12 px-4 justify-between flex flex-col">
      <div className="flex flex-col gap-4 py-2">
        {NAV_LINKS_CUSTOMER.map((link) => (
          <LinkComponent link={link} key={link.href} />
        ))}
      </div>
      <SignOutButton />
    </div>
  );
};

export default CustomerLeftSidebar;

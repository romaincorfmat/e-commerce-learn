import React from "react";
import SignOutButton from "../buttons/SignOutButton";
import { NAV_LINKS } from "@/constants/navLinks";
import LinkComponent from "./LinkComponent";

const LeftSidebar = () => {
  return (
    <div className="sticky top-0 left-0 max-lg:hidden lg:w-[250px]  border-r bg-gray-100 overflow-hidden pt-20 pb-12 px-4 justify-between flex flex-col">
      <div className="flex flex-col gap-4 py-2">
        {NAV_LINKS.map((link) => (
          <LinkComponent link={link} key={link.href} />
        ))}
      </div>
      <SignOutButton />
    </div>
  );
};

export default LeftSidebar;

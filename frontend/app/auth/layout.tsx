import Image from "next/image";
import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const AuthLAyout = ({ children }: Props) => {
  return (
    <div className="flex items-center h-screen w-screen max-md:flex-col bg-gray-100 ">
      <div className="md:flex-1  md:h-full w-full">
        <Image
          src={"/images/e-commerce.jpg"}
          width={1000}
          height={1000}
          alt="sign in page image"
          className="w-full h-full object-cover max-md:h-[255px]"
        />
      </div>
      <div className="flex-1 w-full ">
        <div className=" flex items-center justify-center h-full px-8 ">
          <div className="border shadow-md rounded-2xl p-6 w-full max-w-[466px] bg-white">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLAyout;

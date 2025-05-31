"use client";

import { signIn } from "@/app/api/auth/route";
import AuthForm from "@/components/customerComponents/forms/AuthForm";
import { SignInFormSchema } from "@/lib/validation";
import React from "react";

const LoginPag = () => {
  return (
    <AuthForm
      type="SIGN_IN"
      defaultValues={{
        email: "",
        password: "",
      }}
      schema={SignInFormSchema}
      onSubmit={signIn}
    />
  );
};

export default LoginPag;

"use client";

import { signUp } from "@/app/api/auth/route";
import AuthForm from "@/components/customerComponents/forms/AuthForm";
import { SignUpFormSchema } from "@/lib/validation";
import React from "react";

const SignUpPage = () => {
  return (
    <>
      <AuthForm
        type="SIGN_UP"
        defaultValues={{
          name: "",
          email: "",
          password: "",
        }}
        schema={SignUpFormSchema}
        onSubmit={signUp}
      />
    </>
  );
};

export default SignUpPage;

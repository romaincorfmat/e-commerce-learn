"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CreateNewProductForm from "@/components/adminComponents/forms/CreateNewProductForm";
const CreateProductModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Create New Product</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="hidden">Create Product</DialogTitle>
        <CreateNewProductForm />
      </DialogContent>
    </Dialog>
  );
};

export default CreateProductModal;

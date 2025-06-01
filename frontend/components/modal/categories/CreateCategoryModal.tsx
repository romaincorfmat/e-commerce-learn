"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CreateCategoryForm from "@/components/adminComponents/forms/CreateCategoryForm";

const CreateCategoryModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="max-md:w-full">Create Category</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="hidden">Create Category</DialogTitle>
        <CreateCategoryForm onSuccess={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateCategoryModal;

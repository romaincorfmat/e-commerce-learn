"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import useDeleteUser from "@/hooks/users/useDeleteUser";
import { X } from "lucide-react";

interface Props {
  userId: string;
}

const DeleteUserModal = ({ userId }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  // TODO : implement useDeleteUser hook
  const deleteUserMutation = useDeleteUser();

  const handleAction = async (userId: string) => {
    try {
      const result = deleteUserMutation.mutate(userId);
      console.log("delete result: ", result);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          className="rounded-full border shadow"
          size="icon"
        >
          <X />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="hidden">Delete User</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete this user ?
        </DialogDescription>
        <p>
          This action cannot be undone. All related data will also be deleted.
        </p>
        <DialogHeader>
          <Button
            variant="destructive"
            onClick={() => handleAction(userId)}
            className="rounded-full"
          >
            Delete
          </Button>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteUserModal;

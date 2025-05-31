import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CreateUserForm from "../forms/CreateUserForm";

const CreateUser = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create New User</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <CreateUserForm />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUser;

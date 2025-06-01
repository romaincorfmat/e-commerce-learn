"use client";
import CreateUser from "@/components/adminComponents/buttons/CreateUser";
import UserTable from "@/components/tables/UserTable";
import useGetUsers from "@/hooks/users/useGetUsers";
import React from "react";

const ManageUserPage = () => {
  const { data, isPending } = useGetUsers();
  const users = data?.data || [];

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg font-semibold">Loading users...</div>
      </div>
    );
  }

  if (!users) {
    return <div>No users found.</div>;
  }

  return (
    <div className="w-full">
      <div className="flex max-md:flex-col md:items-center justify-between mb-4">
        <h1 className="h1-title-page ">All your users in one place</h1>
        <CreateUser />
      </div>
      <UserTable data={users} />
    </div>
  );
};

export default ManageUserPage;

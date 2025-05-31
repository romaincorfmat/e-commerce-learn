"use client";
import { getAllUsers } from "@/app/api/user/route";
import CreateUser from "@/components/adminComponents/buttons/CreateUser";
import UserTable from "@/components/tables/UserTable";
import React, { useEffect, useState } from "react";

const ManageUserPage = () => {
  const [users, setUsers] = useState<User[] | null>(null);

  const handleGetAllUsers = async () => {
    try {
      const result = await getAllUsers();
      console.log("ManageUserPage result:", result.data);
      if (!result.success) {
        return <div>Error: {result.message}</div>;
      }

      if (!result.data || result.data.length === 0) {
        console.log("No users found.");
        return;
      }
      setUsers(result.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    handleGetAllUsers();
  }, []);

  if (!users) {
    return <div>No users found.</div>;
  }

  return (
    <div>
      <div className="flex max-md:flex-col md:items-center justify-between mb-4">
        <h1 className="text-lg font-semibold mb-3">
          All your users in one place
        </h1>
        <CreateUser />
      </div>
      <UserTable data={users} />
    </div>
  );
};

export default ManageUserPage;

import React from "react";
import SideBar from "./_components/SideBar";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="main-container flex min-h-screen">
      <SideBar />
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default AdminLayout;

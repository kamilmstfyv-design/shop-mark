import type { Metadata } from "next";
import React from "react";
import AdminTopBar from "./_components/AdminTopBar";
import SideBar from "./_components/SideBar";

export const metadata: Metadata = {
  title: {
    default: "Panel | SerabEvi555",
    template: "%s | SerabEvi555",
  },
  description: "Mağaza idarə paneli",
};

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <AdminTopBar />
      <div className="flex flex-1">
        <SideBar />
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;

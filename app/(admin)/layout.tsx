import React from "react";
import SideBar from "./_components/SideBar";

const LayoutPanel = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex main-container">
      <SideBar />
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default LayoutPanel;

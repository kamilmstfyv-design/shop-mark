import React from "react";
import Header from "@/components/layout/Header";

const RoutesLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Header />
      <main className="main-container">{children}</main>
    </div>
  );
};

export default RoutesLayout;

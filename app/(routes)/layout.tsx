import React from "react";
import Header from "@/components/layout/Header";

const RoutesLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Header />
      <main>{children}</main>
    </div>
  );
};

export default RoutesLayout;

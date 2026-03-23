import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartSheet from "@/components/layout/CartSheet";
import { CartProvider } from "@/contexts/CartContext";

const RoutesLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <CartSheet />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </CartProvider>
  );
};

export default RoutesLayout;

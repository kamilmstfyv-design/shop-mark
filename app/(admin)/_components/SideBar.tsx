import Link from "next/link";
import React from "react";

const SideBar = () => {
  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col gap-4 p-4">
      <Link href="/panel/slider">Slaydlar</Link>
      <Link href="/panel/products">Məhsullar</Link>
      <Link href="/panel/categories">Kategoriyalar</Link>
    </div>
  );
};

export default SideBar;

import Link from "next/link";
import React from "react";

const SideBar = () => {
  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col gap-4 p-4">
      <Link href="/panel/slider">Slaydere rəsm elave et</Link>
      <Link href="/panel/products">Məhsul elave et</Link>
      <Link href="/panel/categories">Kategoriya elave et</Link>
      <Link href="/panel/categories">Məhsul sil</Link>
    </div>
  );
};

export default SideBar;

import Link from "next/link";
import React from "react";

const SideBar = () => {
  return (
    <div className="w-64 bg-gray-800 text-white">
      <Link href="/panel/slider">Slaydlar</Link>
    </div>
  );
};

export default SideBar;

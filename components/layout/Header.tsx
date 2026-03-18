import { MenuIcon, ShoppingCartIcon } from "lucide-react";
import Link from "next/link";
import MobileMenu from "./MobileMenu";

const Header = () => {
  return (
    <header className=" py-4 bg-slate-800 text-white border-b border-gray-200 sticky top-0 z-50">
      <div className="flex items-center justify-between pb-4 main-container">
        <Link href="/">
          <h1 className="text-2xl font-bold">SerabEvi555</h1>
        </Link>

        <div className="flex items-center gap-4">
          <div className="relative flex items-center gap-4 cursor-pointer ">
            <ShoppingCartIcon />
            <span className="text-sm font-medium absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
              0
            </span>
          </div>
          <div className="cursor-pointer flex md:hidden">
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

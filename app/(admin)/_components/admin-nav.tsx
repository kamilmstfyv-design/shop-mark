import {
  FolderTree,
  Images,
  LayoutDashboard,
  Package,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type AdminNavItem = {
  href: string;
  label: string;
  pathLabel: string;
  description: string;
  Icon: LucideIcon;
};

/** Tək mənbə: sidebar + mobil panel menyusu */
export const ADMIN_NAV: AdminNavItem[] = [
  {
    href: "/panel",
    label: "İdarə paneli",
    pathLabel: "/panel",
    description: "Ümumi baxış və keçidlər",
    Icon: LayoutDashboard,
  },
  {
    href: "/panel/products",
    label: "Məhsullar",
    pathLabel: "/panel/products",
    description: "Əlavə et, redaktə, sil",
    Icon: Package,
  },
  {
    href: "/panel/categories",
    label: "Kateqoriyalar",
    pathLabel: "/panel/categories",
    description: "Kateqoriya və şəkillər",
    Icon: FolderTree,
  },
  {
    href: "/panel/slider",
    label: "Slayder",
    pathLabel: "/panel/slider",
    description: "Ana səhifə slayder şəkilləri",
    Icon: Images,
  },
];

export function isNavActive(pathname: string, href: string): boolean {
  if (href === "/panel") {
    return pathname === "/panel" || pathname === "/panel/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

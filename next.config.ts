import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

/** This app's root (folder that contains this config file) */
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Pin Turbopack to this repo when a parent folder (e.g. Desktop) also has a lockfile.
  turbopack: {
    root: projectRoot,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pjvutqegmjeqodwrczlv.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;

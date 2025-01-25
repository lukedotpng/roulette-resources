import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "h67hwj4dua.ufs.sh",
            },
        ],
    },
};

export default nextConfig;

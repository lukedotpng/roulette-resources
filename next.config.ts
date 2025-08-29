import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "h67hwj4dua.ufs.sh",
            },
            {
                protocol: "https",
                hostname: "cdn.discordapp.com",
            },
            {
                protocol: "https",
                hostname: "substack-post-media.s3.amazonaws.com",
            },
        ],
    },
};

export default nextConfig;

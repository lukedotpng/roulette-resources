import "../globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Stream Overlay",
};

import { Noto_Sans } from "next/font/google";

const notoSans = Noto_Sans({
    weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
    subsets: ["latin"],
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${notoSans.className}`}>{children}</body>
        </html>
    );
}

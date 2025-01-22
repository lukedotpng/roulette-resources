import type { Metadata } from "next";
import "./globals.css";
import Header from "./_components/Header";

export const metadata: Metadata = {
    title: "Roulette Resources",
    description: "Videos and guides for Hitman roulette",
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
            <body
                className={`${notoSans.className} flex min-h-screen flex-col justify-center`}
            >
                <Header />
                {children}
                {/* screen size debug */}
                <h1 className="fixed left-20 top-1 after:content-['xs'] after:sm:content-['sm'] after:md:content-['md'] after:lg:content-['lg'] after:xl:content-['xl']">
                    size:
                </h1>
            </body>
        </html>
    );
}

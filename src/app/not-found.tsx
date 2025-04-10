import Link from "next/link";
import "./globals.css";
import { Noto_Sans } from "next/font/google";

const notoSans = Noto_Sans({
    weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
    subsets: ["latin"],
});

export default function NotFound() {
    return (
        <html lang="en">
            <body
                className={`${notoSans.className} flex flex-col justify-center bg-zinc-800 text-xs sm:text-sm md:text-base`}
            >
                <main className="mt-20 flex flex-col items-center justify-center gap-20 text-white">
                    <h1 className="text-[1.5em] font-bold">
                        {"404 - Page not found :("}
                    </h1>
                    <div className="flex flex-col items-center gap-3">
                        <h3 className="text-[1.4em] text-white">
                            {"Why don't you go spin around... "}
                        </h3>
                        <Link
                            href={"/spin"}
                            className="rounded-lg bg-white px-3 py-1 text-center text-[1.3em] font-bold text-zinc-900"
                        >
                            {"Spin!"}
                        </Link>
                    </div>
                </main>
            </body>
        </html>
    );
}

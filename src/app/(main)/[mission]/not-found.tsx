"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NotFound() {
    const pathname = usePathname();
    const pathnameSlug = pathname.split("/")[1];

    console.log("pathname:", pathname);
    console.log("pathnameSlug:", pathnameSlug);

    return (
        <div className="flex flex-col items-center">
            <h2 className="text-[2rem]">{"How did you get here!?"}</h2>
            <Link
                href={"https://roulette.luke.town/" + pathnameSlug}
                className="m-5 text-center text-[1.3rem]"
            >
                <p className="decoration-red-500 decoration-2 hover:underline">
                    {"Back to mission page"}
                </p>
            </Link>
        </div>
    );
}

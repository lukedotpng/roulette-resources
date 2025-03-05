"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MissionInfoNav({ mission }: { mission: string }) {
    return (
        <nav className="my-2 flex w-80 justify-center text-xs font-semibold sm:w-fit sm:text-xl md:text-2xl">
            <NavLink text="General" href={`/${mission}`} />
            <NavLink text="Disguises" href={`/${mission}/disguises`} />
            <NavLink text="Isolations" href={`/${mission}/isolations`} />
            <NavLink text="Unique Kills" href={`/${mission}/unique_kills`} />
        </nav>
    );
}

function NavLink({ text, href }: { text: string; href: string }) {
    const pathname = usePathname();

    return (
        <Link
            data-active={pathname === href}
            className="bg-white px-2 py-1 text-zinc-900 hover:bg-red-500 hover:text-white data-[active=true]:border-b-4 data-[active=true]:border-red-500 sm:px-4 md:px-8 md:py-2"
            href={href}
            prefetch={true}
        >
            {text}
        </Link>
    );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MissionInfoNav({ mission }: { mission: string }) {
    return (
        <nav className="flex w-full justify-center px-2 text-[1em] font-semibold sm:w-[35rem] sm:text-[1.2em] md:w-[48rem]">
            <NavLink text="General" href={`/${mission}`} />
            <NavLink text="Disguises" href={`/${mission}/disguises`} />
            <NavLink text="Isolations" href={`/${mission}/isolations`} />
            <NavLink text="Unique Kills" href={`/${mission}/unique_kills`} />
            <NavLink text="Routes" href={`/${mission}/routes`} />
        </nav>
    );
}

function NavLink({ text, href }: { text: string; href: string }) {
    const pathname = usePathname();

    return (
        <Link
            data-active={pathname === href}
            className="flex-1 bg-white py-1 text-center text-zinc-900 hover:bg-red-500 hover:text-white data-[active=true]:border-b-4 data-[active=true]:border-red-500 md:py-2"
            href={href}
            prefetch={true}
        >
            {text}
        </Link>
    );
}

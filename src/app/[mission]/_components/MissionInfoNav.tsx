"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MissionInfoNav({ mission }: { mission: string }) {
    return (
        <nav className="flex text-3xl font-semibold">
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
            className="data-[active=true]:-2 bg-white px-5 py-2 text-zinc-900 hover:bg-red-500 hover:text-white data-[active=true]:border-b-4 data-[active=true]:border-red-500"
            href={href}
        >
            {text}
        </Link>
    );
}

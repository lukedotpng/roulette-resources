"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MissionInfoNav({ mission }: { mission: string }) {
    return (
        <nav className="flex gap-4 border-1 p-2 text-left text-[1.1em] font-semibold">
            <NavLink text="General" href={`/${mission}`} />
            <NavLink text="Disguises" href={`/${mission}/disguises`} />
            <NavLink text="Targets" href={`/${mission}/targets`} />
            <NavLink text="Routes" href={`/${mission}/routes`} />
        </nav>
    );
}

function NavLink({ text, href }: { text: string; href: string }) {
    const pathname = usePathname();

    return (
        <Link
            data-active={pathname === href}
            className="text-center text-white decoration-red-500 decoration-2 hover:underline data-[active=true]:underline"
            href={href}
        >
            {text}
        </Link>
    );
}

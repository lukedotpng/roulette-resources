import Link from "next/link";

export default function MissionPageNav({
    fragmentHash,
}: {
    fragmentHash: string;
}) {
    return (
        <nav className="sticky top-0 z-30 w-full max-w-full px-2 py-1 text-[.9em] text-zinc-900 sm:w-fit sm:px-5 sm:py-2 sm:text-[1em]">
            <div className="flex w-full flex-wrap justify-center gap-2 rounded-xl border-2 border-zinc-500 bg-white p-1 shadow-lg shadow-black sm:gap-5 sm:border-4">
                <NavLink target="#timings" active={fragmentHash === "#timings"}>
                    {"Timings"}
                </NavLink>
                <NavLink target="#items" active={fragmentHash === "#items"}>
                    {"Items"}
                </NavLink>
                <NavLink
                    target="#disguises"
                    active={fragmentHash === "#disguises"}
                >
                    {"Disguises"}
                </NavLink>
                <NavLink
                    target="#isolations"
                    active={fragmentHash === "#isolations"}
                >
                    {"Isolations"}
                </NavLink>
                <NavLink
                    target="#unique-kills"
                    active={fragmentHash === "#unique-kills"}
                >
                    {"Unique Kills"}
                </NavLink>
                <NavLink target="#routes" active={fragmentHash === "#routes"}>
                    {"Routes"}
                </NavLink>
                <NavLink target="#tech" active={fragmentHash === "#tech"}>
                    {"Tech"}
                </NavLink>
            </div>
        </nav>
    );
}

function NavLink({
    children,
    target,
    active,
}: {
    children: React.ReactNode;
    target: string;
    active: boolean;
}) {
    return (
        <Link
            href={target}
            data-active={active}
            className="text-center text-nowrap decoration-red-500 decoration-2 hover:border-b-red-500 hover:underline data-[active=true]:underline"
        >
            {children}
        </Link>
    );
}

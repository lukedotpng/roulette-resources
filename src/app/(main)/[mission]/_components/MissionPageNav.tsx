import Link from "next/link";

export default function MissionPageNav() {
    return (
        <nav className="sticky top-0 z-30 w-full max-w-full px-2 py-1 text-[.9em] text-zinc-900 sm:w-fit sm:px-5 sm:py-2 sm:text-[1em]">
            <div className="flex w-full flex-wrap justify-center gap-2 rounded-xl border-2 border-zinc-500 bg-white p-1 shadow-lg shadow-black sm:gap-5 sm:border-4">
                <NavLink target="#timings">{"Timings"}</NavLink>
                <NavLink target="#items">{"Items"}</NavLink>
                <NavLink target="#disguises">{"Disguises"}</NavLink>
                <NavLink target="#isolations">{"Isolations"}</NavLink>
                <NavLink target="#unique-kills">{"Unique Kills"}</NavLink>
                <NavLink target="#routes">{"Routes"}</NavLink>
                <NavLink target="#tech">{"Tech"}</NavLink>
            </div>
        </nav>
    );
}

function NavLink({
    children,
    target,
}: {
    children: React.ReactNode;
    target: string;
}) {
    return (
        <Link
            href={target}
            className="text-center text-nowrap decoration-red-500 decoration-2 hover:border-b-red-500 hover:underline"
        >
            {children}
        </Link>
    );
}

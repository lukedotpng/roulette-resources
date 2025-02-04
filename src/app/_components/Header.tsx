import Link from "next/link";
import NavDropdown from "./NavDropdown";
import { auth } from "@/auth";
import SignIn from "./SignIn";
import UserIcon from "./UserIcon";
import { SessionProvider } from "next-auth/react";

export default async function Header() {
    const session = await auth();

    let signedIn = false;

    if (session && session.user) {
        signedIn = true;
    }

    return (
        <header className="flex h-8 items-center justify-between bg-white sm:h-9 md:h-10">
            <Link href="/" prefetch={true}>
                <h1 className="px-2 text-base font-extrabold sm:text-lg md:text-2xl">
                    Rou|Re
                </h1>
            </Link>
            <div className="flex-1"></div>
            <nav className="h-full self-center text-xs font-bold sm:text-sm md:text-base">
                <NavDropdown
                    season="Season 1"
                    maps={[
                        "Paris",
                        "Sapienza",
                        "Marrakesh",
                        "Bangkok",
                        "Colorado",
                        "Hokkaido",
                    ]}
                />
                <NavDropdown
                    season="Season 2"
                    maps={[
                        "Miami",
                        "Santa Fortuna",
                        "Mumbai",
                        "Whittleton Creek",
                        "Ambrose Island",
                        "Isle of Sgail",
                        "New York",
                        "Haven Island",
                    ]}
                />
                <NavDropdown
                    season="Season 3"
                    maps={[
                        "Dubai",
                        "Dartmoor",
                        "Berlin",
                        "Chongqing",
                        "Mendoza",
                    ]}
                />
            </nav>
            <div className="px-4">
                {!signedIn ? (
                    <SignIn />
                ) : (
                    <SessionProvider>
                        <UserIcon />
                    </SessionProvider>
                )}
            </div>
        </header>
    );
}

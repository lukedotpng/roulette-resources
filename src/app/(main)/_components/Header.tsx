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
        <header className="flex h-6 items-center justify-between bg-white text-xs sm:h-9 sm:text-base md:h-10 md:text-xl">
            <Link href="/" prefetch={true}>
                <h1 className="px-2 font-extrabold">Rou|Re</h1>
            </Link>
            <div className="flex-1"></div>
            <nav className="h-full self-center font-bold">
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
                <button className="h-full w-fit px-4 font-bold outline-hidden hover:bg-red-500 hover:text-white focus:bg-red-500 focus:text-white">
                    <Link href={"/spin"}>{"Spin"}</Link>
                </button>
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

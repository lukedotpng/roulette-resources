import Link from "next/link";
import NavDropdown from "./NavDropdown";

export default function Header() {
    return (
        <header className="flex h-10 items-center justify-between">
            <Link href="/" prefetch={true}>
                <h1 className="px-2 text-2xl font-extrabold">Rou|Re</h1>
            </Link>
            <nav className="h-full self-center text-xl font-bold">
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
                        "Ambrose",
                        "Whittleton Creek",
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
        </header>
    );
}

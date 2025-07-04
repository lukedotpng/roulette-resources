"use client";

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
} from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { useState } from "react";

export default function NavDropdown({
    season,
    maps,
}: {
    season: string;
    maps: string[];
}) {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <DropdownMenu
            open={dropdownOpen}
            onOpenChange={(open) => setDropdownOpen(open)}
        >
            <DropdownMenuTrigger asChild>
                <button className="h-full w-fit px-2 font-bold outline-hidden hover:bg-red-500 hover:text-white focus:bg-red-500 focus:text-white sm:w-32 md:w-40">
                    {season}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="z-10 flex w-20 flex-col rounded-b-md text-[.8em] shadow-lg shadow-black sm:w-32 md:w-40"
                onCloseAutoFocus={(event: Event) => {
                    event.preventDefault();
                }}
            >
                {maps.map((map) => {
                    return (
                        <Link
                            key={map}
                            className="bg-white px-1 py-2 text-black last:rounded-b-sm hover:cursor-pointer hover:bg-red-500 hover:text-white focus:bg-red-500 focus:text-white"
                            onClick={() => {
                                setDropdownOpen(false);
                            }}
                            href={`/${textToPathFormat(map)}`}
                        >
                            {map}
                        </Link>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

// Converts text to lower case and replaces spaces with underscores to format them for URL paths
function textToPathFormat(text: string) {
    return text.toLowerCase().replaceAll(" ", "_");
}

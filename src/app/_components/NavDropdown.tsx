"use client";

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import Link from "next/link";

export default function NavDropdown({
    season,
    maps,
}: {
    season: string;
    maps: string[];
}) {
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <button className="h-full w-40 outline-none hover:bg-red-500 hover:text-white focus:bg-red-500 focus:text-white">
                    {season}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="flex w-40 flex-col shadow-xl shadow-black"
                onCloseAutoFocus={(event: Event) => {
                    event.preventDefault();
                }}
            >
                {maps.map((map, index) => {
                    return (
                        <Link
                            key={map}
                            className="bg-white px-1 py-2 text-base text-black last:rounded-b-sm hover:cursor-pointer hover:bg-red-500 hover:text-white focus:bg-red-500 focus:text-white"
                            href={`/${textToPathFormat(map)}`}
                            prefetch={true}
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

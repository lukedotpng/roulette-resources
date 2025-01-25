"use client";

import { Disguise } from "@/types";

import Image from "next/image";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Disguises({ disguises }: { disguises: Disguise[] }) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [activeDisguiseId, setActiveDisguiseId] = useState(
        searchParams.get("disguise") ?? disguises[0].id,
    );
    const [activeDisguise, setActiveDisguise] = useState(disguises[0]);

    useEffect(() => {
        for (const disguise of disguises) {
            if (disguise.id === activeDisguiseId) {
                setActiveDisguise(disguise);
            }
        }
    }, [activeDisguiseId, activeDisguise]);

    return (
        <section className="flex flex-col items-center gap-5 text-sm sm:flex-row sm:items-start sm:text-base md:text-xl">
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <div className="group flex flex-col">
                        <Image
                            src={activeDisguise.image_url ?? ""}
                            width={693}
                            height={517}
                            alt={DisguiseIDToDisplayText(activeDisguise.id)}
                            className="pointer-events-none hidden w-60 border-4 border-b-0 border-white sm:block"
                        ></Image>
                        <button className="group flex h-fit w-60 items-center justify-between bg-white px-4 py-1 text-left text-zinc-900 hover:bg-red-500 hover:text-white group-data-[active=true]:border-l-8 group-data-[active=true]:border-red-500 group-data-[state=open]:bg-red-500 group-data-[active=true]:pl-2 group-data-[state=open]:text-white sm:py-3">
                            <p>{DisguiseIDToDisplayText(activeDisguise.id)}</p>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 320 512"
                                className="h-4 w-4 fill-zinc-900 group-hover:fill-white group-data-[state=open]:rotate-90 group-data-[state=open]:fill-white"
                            >
                                {/* Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2024 Fonticons, Inc. */}
                                <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
                            </svg>
                        </button>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className="flex h-96 w-60 flex-col overflow-scroll shadow-lg shadow-black"
                    onCloseAutoFocus={(event: Event) => {
                        event.preventDefault();
                    }}
                >
                    {disguises.map((disguise) => {
                        return (
                            <DropdownMenuItem
                                key={disguise.id}
                                data-active={disguise.id === activeDisguiseId}
                                className="w-full bg-white px-4 py-3 text-left text-zinc-900 hover:bg-red-500 hover:text-white data-[active=true]:border-l-8 data-[active=true]:border-red-500 data-[active=true]:pl-2"
                                onClick={() => {
                                    setActiveDisguiseId(disguise.id);
                                    router.replace(`?disguise=${disguise.id}`);
                                }}
                            >
                                {DisguiseIDToDisplayText(disguise.id)}
                            </DropdownMenuItem>
                        );
                    })}
                </DropdownMenuContent>
            </DropdownMenu>
            <div className="text-base sm:text-xl md:text-2xl">
                <DisguiseCard disguise={activeDisguise} />
            </div>
        </section>
    );
}

function DisguiseCard({ disguise }: { disguise: Disguise }) {
    return (
        <div className="bg-white p-2 text-zinc-900 md:p-5">
            <div className="flex flex-col gap-2">
                {disguise.hitmaps_link && (
                    <a
                        href={disguise.hitmaps_link}
                        target="_blank"
                        className="block text-base italic underline"
                    >
                        {"Hitmaps"}
                    </a>
                )}
                {disguise.notes && (
                    <p className="text-base">{disguise.notes}</p>
                )}
                <div className="flex w-64 flex-col gap-2 sm:w-80 md:w-96 md:gap-5">
                    {disguise.video_links?.map((link) => {
                        const youtubeIdRegex =
                            /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/; // Regex found from on stack overflow https://stackoverflow.com/a/8260383

                        const videoIdMatch = link.match(youtubeIdRegex);
                        if (videoIdMatch === null || videoIdMatch.length < 8) {
                            return;
                        }

                        const videoId = videoIdMatch[7];

                        return (
                            <iframe
                                className="aspect-video h-auto w-full"
                                key={link}
                                width="380"
                                height="213"
                                src={`https://www.youtube.com/embed/${videoId}`}
                                allow="clipboard-write; picture-in-picture"
                                allowFullScreen
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function DisguiseIDToDisplayText(disguise: string) {
    let disguiseDisplayText = "";
    // disguise ID example: paris-palace_staff
    const disguiseSplit = disguise.split("-")[1]; // palace_staff
    const words = disguiseSplit.split("_"); // ["palace", "staff"]

    for (const word of words) {
        disguiseDisplayText +=
            word.charAt(0).toUpperCase() + word.slice(1) + " ";
    }

    return disguiseDisplayText;
}

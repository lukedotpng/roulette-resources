"use client";

import { Disguise } from "@/types";
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
        searchParams.get("disguise") ?? disguises[0].disguise_id,
    );
    const [activeDisguise, setActiveDisguise] = useState(disguises[0]);

    useEffect(() => {
        for (const disguise of disguises) {
            if (disguise.disguise_id === activeDisguiseId) {
                setActiveDisguise(disguise);
            }
        }
    }, [activeDisguiseId, activeDisguise]);

    return (
        <section className="flex flex-col items-center gap-5 text-sm sm:flex-row sm:items-start sm:text-base md:text-xl">
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <button className="h-fit w-60 bg-white px-4 py-1 text-left text-zinc-900 hover:bg-red-500 hover:text-white data-[active=true]:border-l-8 data-[active=true]:border-red-500 data-[state=open]:bg-red-500 data-[active=true]:pl-2 data-[state=open]:text-white sm:py-3">
                        {activeDisguise.name}
                    </button>
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
                                key={disguise.disguise_id}
                                data-active={
                                    disguise.disguise_id === activeDisguiseId
                                }
                                className="w-full bg-white px-4 py-3 text-left text-zinc-900 hover:bg-red-500 hover:text-white data-[active=true]:border-l-8 data-[active=true]:border-red-500 data-[active=true]:pl-2"
                                onClick={() => {
                                    setActiveDisguiseId(disguise.disguise_id);
                                    router.replace(
                                        `?disguise=${disguise.disguise_id}`,
                                    );
                                }}
                            >
                                {disguise.name}
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
                {disguise.hitmaps_link !== "" && (
                    <a
                        href={disguise.hitmaps_link}
                        target="_blank"
                        className="block italic underline"
                    >
                        {"Hitmaps"}
                    </a>
                )}
                {disguise.notes && (
                    <p className="text-base">{disguise.notes}</p>
                )}
                <div className="flex w-64 flex-col gap-2 sm:w-80 md:w-96 md:gap-5">
                    {disguise.video_links.map((link) => {
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

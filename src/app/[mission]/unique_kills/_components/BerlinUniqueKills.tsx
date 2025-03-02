"use client";

import { BerlinUniqueKill, UniqueKill } from "@/types";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function BerlinUniqueKills({
    uniqueKillTypes,
    uniqueKills,
}: {
    uniqueKillTypes: readonly BerlinUniqueKill[];
    uniqueKills: UniqueKill[];
}) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [activeUniqueKillId, setActiveUniqueKillId] =
        useState<BerlinUniqueKill>(
            (searchParams.get("kill") as BerlinUniqueKill) ??
                uniqueKillTypes[0],
        );

    return (
        <section className="flex flex-col items-center gap-5 text-sm sm:text-lg md:flex-row md:items-start md:text-xl">
            <DropdownMenu modal={false}>
                <div className="flex flex-col">
                    <Image
                        src={`/killmethods/${activeUniqueKillId}.webp`}
                        width={693}
                        height={517}
                        alt={UniqueKillIDToDisplayText(activeUniqueKillId)}
                        className="hidden w-60 border-4 border-b-0 border-white md:block"
                    />
                    <DropdownMenuTrigger asChild>
                        <button className="group flex h-fit w-60 items-center justify-between bg-white px-4 py-1 text-left text-zinc-900 group-data-[active=true]:border-l-8 group-data-[active=true]:border-red-500 group-data-[active=true]:pl-2 group-data-[state=open]:bg-red-500 group-data-[state=open]:text-white hover:bg-red-500 hover:text-white sm:py-3">
                            <p>
                                {UniqueKillIDToDisplayText(activeUniqueKillId)}
                            </p>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 320 512"
                                className="h-4 w-4 fill-zinc-900 group-hover:fill-white group-data-[state=open]:rotate-90 group-data-[state=open]:fill-white"
                            >
                                {/* Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2024 Fonticons, Inc. */}
                                <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
                            </svg>
                        </button>
                    </DropdownMenuTrigger>
                </div>
                <DropdownMenuContent
                    className="flex w-60 flex-col overflow-scroll shadow-lg shadow-black"
                    onCloseAutoFocus={(event: Event) => {
                        event.preventDefault();
                    }}
                >
                    {uniqueKillTypes.map((killType) => {
                        return (
                            <div key={killType}>
                                <Image
                                    src={`/killmethods/${killType}.webp`}
                                    width={693}
                                    height={517}
                                    quality={50}
                                    priority
                                    alt={UniqueKillIDToDisplayText(killType)}
                                    aria-hidden="true"
                                    className="invisible absolute h-0"
                                ></Image>
                                <DropdownMenuItem
                                    data-active={
                                        killType === activeUniqueKillId
                                    }
                                    className="w-full bg-white px-4 py-3 text-left text-zinc-900 hover:bg-red-500 hover:text-white data-[active=true]:border-l-8 data-[active=true]:border-red-500 data-[active=true]:pl-2"
                                    onClick={() => {
                                        setActiveUniqueKillId(killType);
                                        router.replace(`?kill=${killType}`);
                                    }}
                                >
                                    {UniqueKillIDToDisplayText(killType)}
                                </DropdownMenuItem>
                            </div>
                        );
                    })}
                </DropdownMenuContent>
            </DropdownMenu>
            <div className="flex flex-col gap-4 text-xs sm:text-sm md:text-base">
                <UniqueKillCard
                    killMethod={activeUniqueKillId}
                    uniqueKills={uniqueKills}
                />
            </div>
        </section>
    );
}

function UniqueKillCard({
    killMethod,
    uniqueKills,
}: {
    killMethod: string;
    uniqueKills: UniqueKill[];
}) {
    const filteredUniqueKills = uniqueKills.filter((uniqueKill) => {
        return uniqueKill.kill_method === killMethod;
    });

    if (filteredUniqueKills.length === 0) {
        return null;
    }

    return (
        <div className="w-80 bg-white text-zinc-900 sm:w-[30rem] md:w-[35rem]">
            <div className="flex flex-col gap-2 p-3">
                {filteredUniqueKills.map((uniqueKillMethod, index) => (
                    <div
                        key={index}
                        className="border-t-4 border-zinc-900 first:border-0"
                    >
                        {uniqueKillMethod.name && (
                            <p>
                                <strong>Name: </strong>
                                {uniqueKillMethod.name}
                            </p>
                        )}
                        {uniqueKillMethod.starts && (
                            <p>
                                <strong>Starts: </strong>
                                {uniqueKillMethod.starts}
                            </p>
                        )}
                        {uniqueKillMethod.requires && (
                            <p>
                                <strong>Requires: </strong>
                                {uniqueKillMethod.requires}
                            </p>
                        )}
                        {uniqueKillMethod.timings && (
                            <p>
                                <strong>Timings: </strong>
                                {uniqueKillMethod.timings}
                            </p>
                        )}
                        {uniqueKillMethod.notes && (
                            <p>
                                <strong>Notes: </strong>
                                {uniqueKillMethod.notes}
                            </p>
                        )}
                        {uniqueKillMethod.video_link && (
                            <a
                                className="w-fit font-bold underline"
                                href={uniqueKillMethod.video_link}
                                target="_blank"
                            >
                                Watch video here
                            </a>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

function UniqueKillIDToDisplayText(uniqueKill: string) {
    let uniqueKillDisplayText = "";
    const words = uniqueKill.split("_");

    for (const word of words) {
        uniqueKillDisplayText +=
            word.charAt(0).toUpperCase() + word.slice(1) + " ";
    }

    return uniqueKillDisplayText;
}

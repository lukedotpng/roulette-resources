"use client";

import { UniqueKillTypes } from "@/globals";
import { UniqueKill } from "@/types";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function UniqueKills({
    targets,
    uniqueKills,
}: {
    targets: readonly string[];
    uniqueKills: UniqueKill[];
}) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [activeTargetId, setActiveTargetId] = useState(
        searchParams.get("target") ?? targets[0],
    );

    return (
        <section className="flex flex-col items-center gap-5 text-sm sm:text-lg md:flex-row md:items-start md:text-xl">
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <button className="group flex h-fit w-60 items-center justify-between bg-white px-4 py-1 text-left text-zinc-900 hover:bg-red-500 hover:text-white data-[active=true]:border-l-8 data-[active=true]:border-red-500 data-[state=open]:bg-red-500 data-[active=true]:pl-2 data-[state=open]:text-white sm:py-3">
                        <p>{TargetIDToDisplayText(activeTargetId)}</p>
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
                <DropdownMenuContent
                    className="flex w-60 flex-col overflow-scroll shadow-lg shadow-black"
                    onCloseAutoFocus={(event: Event) => {
                        event.preventDefault();
                    }}
                >
                    {targets.map((target) => {
                        return (
                            <DropdownMenuItem
                                key={target}
                                data-active={target === activeTargetId}
                                className="w-full bg-white px-4 py-3 text-left text-zinc-900 hover:bg-red-500 hover:text-white data-[active=true]:border-l-8 data-[active=true]:border-red-500 data-[active=true]:pl-2"
                                onClick={() => {
                                    setActiveTargetId(target);
                                    router.replace(`?disguise=${target}`);
                                }}
                            >
                                {TargetIDToDisplayText(target)}
                            </DropdownMenuItem>
                        );
                    })}
                </DropdownMenuContent>
            </DropdownMenu>
            <div className="flex flex-col gap-2 text-sm sm:text-xl md:text-2xl">
                {UniqueKillTypes.map((uniqueKillType, index) => {
                    const filteredUniqueKills = uniqueKills.filter(
                        (uniqueKill) => {
                            return (
                                uniqueKill.kill_method === uniqueKillType &&
                                uniqueKill.target === activeTargetId
                            );
                        },
                    );

                    if (filteredUniqueKills.length === 0) {
                        return null;
                    }

                    return (
                        <UniqueKillCard
                            key={index}
                            killType={uniqueKillType}
                            uniqueKills={filteredUniqueKills}
                        />
                    );
                })}
            </div>
        </section>
    );
}

function UniqueKillCard({
    killType,
    uniqueKills,
}: {
    killType: string;
    uniqueKills: UniqueKill[];
}) {
    return (
        <div className="w-80 bg-white p-3 text-zinc-900 sm:w-[30rem] md:w-[35rem]">
            <div className="flex flex-col gap-2 text-base">
                <p className="text-xl font-bold">
                    {UniqueKillIDToDisplayText(killType)}
                </p>
                {uniqueKills.map((uniqueKillMethod, index) => (
                    <div key={index} className="border-t-4 border-zinc-900">
                        <p>
                            <strong>Starts: </strong>
                            {uniqueKillMethod.starts}
                        </p>
                        <p>
                            <strong>Requires: </strong>
                            {uniqueKillMethod.requires}
                        </p>
                        <p>
                            <strong>Timings: </strong>
                            {uniqueKillMethod.timings}
                        </p>
                        {uniqueKillMethod.notes && (
                            <p>
                                <strong>Notes: </strong>
                                {uniqueKillMethod.notes}
                            </p>
                        )}
                        <a
                            className="w-fit font-bold underline"
                            href={uniqueKillMethod.video_link}
                            target="_blank"
                        >
                            Watch video here
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}

function TargetIDToDisplayText(target: string) {
    let targetDisplayText = "";
    const words = target.split("_");

    for (const word of words) {
        targetDisplayText += word.charAt(0).toUpperCase() + word.slice(1) + " ";
    }

    return targetDisplayText;
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

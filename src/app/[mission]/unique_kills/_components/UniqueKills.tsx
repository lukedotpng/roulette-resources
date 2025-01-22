"use client";

import { UniqueKillTypes } from "@/globals";
import { TargetUniqueKills, UniqueKill, UniqueKillsGroup } from "@/types";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function UniqueKills({
    targets,
    uniqueKillsGroup,
}: {
    targets: readonly string[];
    uniqueKillsGroup: UniqueKillsGroup;
}) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [activeTargetId, setActiveTargetId] = useState(
        searchParams.get("target") ?? targets[0],
    );
    const [activeUniqueKill, setActiveUniqueKill] = useState<TargetUniqueKills>(
        uniqueKillsGroup[targets[0]],
    );

    useEffect(() => {
        for (const target of targets) {
            if (target === activeTargetId) {
                setActiveUniqueKill(uniqueKillsGroup[target]);
            }
        }
    }, [activeTargetId, activeUniqueKill]);

    return (
        <section className="flex flex-col items-center gap-5 text-sm sm:text-lg md:flex-row md:items-start md:text-xl">
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <button className="h-fit w-60 bg-white px-4 py-1 text-left text-zinc-900 hover:bg-red-500 hover:text-white data-[active=true]:border-l-8 data-[active=true]:border-red-500 data-[state=open]:bg-red-500 data-[active=true]:pl-2 data-[state=open]:text-white sm:py-3">
                        {TargetIDToDisplayText(activeTargetId)}
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
                {UniqueKillTypes.map((uniqueKillType, index) => (
                    <UniqueKillCard
                        key={index}
                        uniqueKill={activeUniqueKill[uniqueKillType]}
                    />
                ))}
            </div>
        </section>
    );
}

function UniqueKillCard({ uniqueKill }: { uniqueKill: UniqueKill }) {
    if (!uniqueKill) {
        return null;
    }

    return (
        <div className="w-80 bg-white p-3 text-zinc-900 sm:w-[30rem] md:w-[35rem]">
            <div className="flex flex-col gap-2 text-base">
                <p className="text-xl font-bold">{uniqueKill.name}</p>
                {uniqueKill.methods.map((method, index) => (
                    <div key={index} className="border-t-4 border-zinc-900">
                        <p>
                            <strong>Starts: </strong>
                            {method.starts}
                        </p>
                        <p>
                            <strong>Requires: </strong>
                            {method.requires}
                        </p>
                        <p>
                            <strong>Timings: </strong>
                            {method.timings}
                        </p>
                        {method.notes && (
                            <p>
                                <strong>Notes: </strong>
                                {method.notes}
                            </p>
                        )}
                        <a
                            className="w-fit font-bold underline"
                            href={method.video_link}
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

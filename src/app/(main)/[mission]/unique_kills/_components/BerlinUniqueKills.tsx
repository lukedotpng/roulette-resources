"use client";

import { BerlinUniqueKill, UniqueKill } from "@/types";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import ImageDropdown from "../../_components/ImageDropdown";
import { MethodIDToDisplayText } from "@/utils/FormattingUtils";

export default function BerlinUniqueKills({
    uniqueKillTypes,
    uniqueKills,
}: {
    uniqueKillTypes: readonly BerlinUniqueKill[];
    uniqueKills: UniqueKill[];
}) {
    const searchParams = useSearchParams();

    const [activeUniqueKillId, setActiveUniqueKillId] =
        useState<BerlinUniqueKill>(
            (searchParams.get("o") as BerlinUniqueKill) ?? uniqueKillTypes[0],
        );
    function SetActiveUniqueKill(uniqueKillId: string) {
        setActiveUniqueKillId(uniqueKillId as BerlinUniqueKill);
    }

    return (
        <section className="flex flex-col items-center gap-5 md:flex-row md:items-start">
            <ImageDropdown
                activeOption={activeUniqueKillId}
                optionImageRootPath="/killmethods"
                optionList={uniqueKillTypes as string[]}
                SetActiveOption={SetActiveUniqueKill}
                OptionFormatter={MethodIDToDisplayText}
            />
            <div className="flex flex-col gap-4">
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

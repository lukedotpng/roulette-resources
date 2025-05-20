"use client";

import { Isolation, Mission, Target, UniqueKill } from "@/types";
import ImageDropdown from "../../_components/ImageDropdown";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { BERLIN_UNIQUE_KILL_TYPES, MISSION_TARGET_LIST } from "@/utils/globals";
import {
    MethodIDToDisplayText,
    TargetIDToDisplayText,
} from "@/utils/FormattingUtils";
import Isolations from "./_Isolations/Isolations";
import BerlinUniqueKills from "./_UniqueKills/BerlinUniqueKills";
import UniqueKills from "./_UniqueKills/UniqueKills";

export default function Targets({
    mission,
    isolations,
    uniqueKills,
}: {
    mission: Mission;
    isolations: Isolation[];
    uniqueKills: UniqueKill[];
}) {
    const targets = MISSION_TARGET_LIST[mission];
    const searchParams = useSearchParams();

    const [activeTargetId, setActiveTargetId] = useState<Target>(
        (searchParams.get("target") as Target) ?? targets[0],
    );
    function SetActiveTarget(targetId: string) {
        setActiveTargetId(targetId as Target);
    }
    const [activeUniqueKill, setActiveUniqueKill] = useState<string>(
        searchParams.get("uniqueKill") ?? BERLIN_UNIQUE_KILL_TYPES[0],
    );
    function SetActiveUniqueKill(uniqueKill: string) {
        setActiveUniqueKill(uniqueKill);
    }

    const [activeTab, setActiveTab] = useState<"isolations" | "uniqueKills">(
        "isolations",
    );
    function SetActiveTab(tab: "isolations" | "uniqueKills") {
        setActiveTab(tab);
    }

    return (
        <section className="flex flex-col items-center gap-3 md:flex-row md:items-start md:gap-5">
            {mission === "berlin" && activeTab === "uniqueKills" ? (
                <ImageDropdown
                    activeOption={activeUniqueKill}
                    optionImageRootPath="/killmethods"
                    optionList={BERLIN_UNIQUE_KILL_TYPES}
                    optionQueryKey="kill"
                    SetActiveOption={SetActiveUniqueKill}
                    OptionFormatter={MethodIDToDisplayText}
                />
            ) : (
                <ImageDropdown
                    activeOption={activeTargetId}
                    optionImageRootPath="/targets"
                    optionList={targets as string[]}
                    optionQueryKey="target"
                    SetActiveOption={SetActiveTarget}
                    OptionFormatter={TargetIDToDisplayText}
                />
            )}
            <div className="flex flex-col gap-2">
                <nav className="flex w-80 justify-center text-[1.1em] font-semibold sm:w-[25rem] sm:text-[1.1em] md:w-[30rem] lg:w-[35rem]">
                    <button
                        data-active={activeTab === "isolations"}
                        className="flex-1 bg-white py-1 text-center text-zinc-900 hover:bg-red-500 hover:text-white data-[active=true]:border-b-4 data-[active=true]:border-red-500"
                        onClick={() => SetActiveTab("isolations")}
                    >
                        {"Isolations"}
                    </button>
                    <button
                        data-active={activeTab === "uniqueKills"}
                        className="flex-1 bg-white py-1 text-center text-zinc-900 hover:bg-red-500 hover:text-white data-[active=true]:border-b-4 data-[active=true]:border-red-500"
                        onClick={() => SetActiveTab("uniqueKills")}
                    >
                        {"Unique Kills"}
                    </button>
                </nav>
                {activeTab === "isolations" && (
                    <Isolations
                        mission={mission}
                        target={activeTargetId}
                        isolations={isolations}
                    />
                )}
                {activeTab === "uniqueKills" && mission !== "berlin" && (
                    <UniqueKills
                        mission={mission}
                        activeTarget={activeTargetId}
                        uniqueKills={uniqueKills}
                    />
                )}
                {activeTab === "uniqueKills" && mission === "berlin" && (
                    <BerlinUniqueKills
                        activeUniqueKill={activeUniqueKill}
                        uniqueKills={uniqueKills}
                    />
                )}
            </div>
        </section>
    );
}

"use client";

import { Mission, UniqueKillInsert, UniqueKillSelect } from "@/types";
import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import {
    MISSION_TARGET_LIST,
    STANDARD_UNIQUE_KILL_TYPES,
} from "@/utils/globals";
import { MethodIDToDisplayText } from "@/utils/FormattingUtils";
import UniqueKillEditorDialog from "./UniqueKillEditorDialog";
import UniqueKillCard from "./UniqueKillCard";

import BerlinUniqueKillCard from "./BerlinUniqueKillCard";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import InfoSection from "../_components/InfoSection";
import {
    TARGET_BANNED_KILL_METHODS_LIST,
    TARGET_UNIQUE_KILLS_LIST,
} from "@/lib/RouletteSpinner/globals";
import { SpinTarget } from "@/lib/RouletteSpinner/types";

export default function UniqueKillsSection({
    mission,
    uniqueKills,
}: {
    mission: Mission;
    uniqueKills: UniqueKillSelect[];
}) {
    const session = useSession();

    const targets = MISSION_TARGET_LIST[mission];

    let uniqueKillOptions = [...STANDARD_UNIQUE_KILL_TYPES];
    // berlin being crazy as usual
    if (mission !== "berlin") {
        for (const target of targets) {
            uniqueKillOptions = [
                ...uniqueKillOptions,
                ...TARGET_UNIQUE_KILLS_LIST[target as SpinTarget],
            ];
        }
        let electroCount = 0;
        uniqueKillOptions = uniqueKillOptions.filter((uniqueKill) => {
            let bannedTargetCount = 0;
            if (uniqueKill === "electrocution") {
                if (electroCount > 0) {
                    return false;
                }
                electroCount++;
            }
            for (const target of targets) {
                if (
                    TARGET_BANNED_KILL_METHODS_LIST[
                        target as SpinTarget
                    ].includes(uniqueKill)
                ) {
                    bannedTargetCount++;
                }
            }
            return bannedTargetCount !== targets.length;
        });
    }

    const [activeUniqueKillId, setActiveUniqueKillId] = useState(
        uniqueKillOptions[0],
    );
    function SetActiveUniqueKillId(option: string) {
        setActiveUniqueKillId(option);
    }

    const [editDialogActive, setEditDialogActive] = useState(false);
    const [createNewUniqueKill, setCreateNewUniqueKill] = useState(false);
    const [currentUniqueKillToEdit, setCurrentUniqueToEdit] =
        useState<UniqueKillInsert>({
            id: "",
            target: "",
            kill_method: "",
            mission: mission,
            name: "New Unique Kill",
            info: "",
            video_link: "",
            visible: true,
        });

    function HandleUniqueKillEditTrigger(
        uniqueKill: UniqueKillInsert,
        isNew: boolean,
    ) {
        setCreateNewUniqueKill(isNew);
        setEditDialogActive(true);
        setCurrentUniqueToEdit(uniqueKill);
    }

    const listedUniqueKills = useMemo(
        () =>
            uniqueKills.filter((uniqueKill) => {
                return uniqueKill.kill_method === activeUniqueKillId;
            }),
        [activeUniqueKillId, uniqueKills],
    );

    return (
        <InfoSection id="unique-kills">
            <h1 className="border-b-2 border-white text-[1.2em] font-bold">
                {"Unique Kills"}
            </h1>
            <div className="flex flex-col items-center gap-2 md:flex-row md:items-start">
                <div className="flex w-full max-w-60 flex-col items-center gap-2 md:max-w-50 md:gap-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="group flex w-full min-w-24 flex-1 items-center justify-between rounded-lg border-2 border-zinc-500 bg-white p-0.5 font-bold text-zinc-900 hover:bg-red-500 hover:text-white md:hidden">
                                <p className="ml-1">
                                    {MethodIDToDisplayText(activeUniqueKillId)}
                                </p>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 320 512"
                                    className="mr-1 h-3 w-3 fill-zinc-900 group-hover:fill-white group-data-[state=open]:rotate-90 sm:h-4 sm:w-4"
                                >
                                    {/* Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2024 Fonticons, Inc. */}
                                    <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
                                </svg>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="z-20 -mt-1 flex h-fit max-h-72 w-48 flex-col overflow-y-auto rounded-lg border-2 border-zinc-500 text-[.9em] shadow-[0_0_20px_0px] shadow-black">
                            {uniqueKillOptions.map((uniqueKill) => (
                                <DropdownMenuItem
                                    key={uniqueKill}
                                    className="border-t-1 border-zinc-900 bg-white p-1 text-zinc-900 first:border-t-0 hover:bg-red-500 hover:text-white"
                                    onClick={() => {
                                        setActiveUniqueKillId(uniqueKill);
                                    }}
                                >
                                    {MethodIDToDisplayText(uniqueKill)}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <div className="hidden w-full flex-row flex-wrap justify-center gap-1 md:flex md:flex-col">
                        {uniqueKillOptions.map((uniqueKill) => {
                            return (
                                <button
                                    key={uniqueKill}
                                    data-active={
                                        uniqueKill === activeUniqueKillId
                                    }
                                    className="flex-1 rounded-lg border-2 border-zinc-500 bg-white p-0.5 font-bold text-zinc-900 hover:bg-red-500 hover:text-white data-[active=true]:bg-red-500 data-[active=true]:text-white"
                                    onClick={() => {
                                        SetActiveUniqueKillId(uniqueKill);
                                    }}
                                >
                                    {MethodIDToDisplayText(uniqueKill)}
                                </button>
                            );
                        })}
                    </div>
                    {session.data?.user?.admin && (
                        <button
                            className="w-full rounded-lg border-2 border-zinc-500 bg-white p-0.5 font-bold text-zinc-900 hover:bg-red-500 hover:text-white"
                            onClick={() =>
                                HandleUniqueKillEditTrigger(
                                    {
                                        id: "",
                                        target: "",
                                        kill_method: activeUniqueKillId,
                                        mission: mission,
                                        name: "New Unique Kill",
                                        info: "",
                                        video_link: "",
                                        visible: true,
                                    },
                                    true,
                                )
                            }
                        >
                            {"Add New Unique Kill"}
                        </button>
                    )}
                </div>
                <div className="flex w-full justify-center gap-2 sm:gap-2">
                    {mission !== "berlin" ? (
                        <UniqueKillCard
                            mission={mission}
                            targets={targets}
                            uniqueKills={listedUniqueKills}
                            handleUniqueKillEditTrigger={
                                HandleUniqueKillEditTrigger
                            }
                        />
                    ) : (
                        <BerlinUniqueKillCard
                            mission={mission}
                            uniqueKills={listedUniqueKills}
                            handleUniqueKillEditTrigger={
                                HandleUniqueKillEditTrigger
                            }
                        />
                    )}
                </div>
            </div>
            {editDialogActive && (
                <UniqueKillEditorDialog
                    uniqueKill={currentUniqueKillToEdit}
                    isNew={createNewUniqueKill}
                    editDialogActive={editDialogActive}
                    setEditDialogActive={setEditDialogActive}
                />
            )}
        </InfoSection>
    );
}

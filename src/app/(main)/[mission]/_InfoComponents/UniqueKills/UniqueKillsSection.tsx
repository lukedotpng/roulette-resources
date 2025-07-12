"use client";

import {
    Mission,
    SpinTarget,
    UniqueKillInsert,
    UniqueKillSelect,
} from "@/types";
import { use, useState } from "react";
import { useSession } from "next-auth/react";
import {
    MISSION_TARGET_LIST,
    STANDARD_UNIQUE_KILL_TYPES,
} from "@/utils/globals";
import { MethodIDToDisplayText } from "@/utils/FormattingUtils";
import UniqueKillEditorDialog from "../../_EditorComponents/UniqueKillEditorDialog";
import UniqueKillCard from "./UniqueKillCard";
import {
    TARGET_BANNED_KILL_METHODS_LIST,
    TARGET_UNIQUE_KILLS_LIST,
} from "@/app/(main)/spin/utils/SpinGlobals";
import BerlinUniqueKillCard from "./BerlinUniqueKillCard";

export default function UniqueKillsSection({
    mission,
    uniqueKillsPromise,
}: {
    mission: Mission;
    uniqueKillsPromise: Promise<UniqueKillSelect[]>;
}) {
    const uniqueKills = use(uniqueKillsPromise);

    const session = useSession();

    const targets = MISSION_TARGET_LIST[mission];

    let uniqueKillOptions = [...STANDARD_UNIQUE_KILL_TYPES];
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

    return (
        <section className="flex w-full flex-col justify-center gap-2.5 px-2 sm:px-5">
            <h1 className="border-b-2 border-white text-[1.2em] font-bold">
                {"Unique Kills"}
            </h1>
            <div className="flex flex-col items-center gap-2 md:flex-row md:items-start">
                <div className="flex flex-col items-center gap-2 md:gap-4">
                    <div className="flex flex-row flex-wrap justify-center gap-1 md:flex-col">
                        {uniqueKillOptions.map((uniqueKill) => {
                            return (
                                <button
                                    key={uniqueKill}
                                    data-active={
                                        uniqueKill === activeUniqueKillId
                                    }
                                    className="max-w-50 min-w-24 flex-1 rounded-lg border-2 border-zinc-500 bg-white p-1 font-bold text-zinc-900 hover:bg-red-500 hover:text-white data-[active=true]:bg-red-500 data-[active=true]:text-white md:w-50"
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
                            className="w-full max-w-50 rounded-lg border-2 border-zinc-500 bg-white p-1 font-bold text-zinc-900 hover:bg-red-500 hover:text-white"
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
                            targets={targets}
                            uniqueKills={uniqueKills.filter((uniqueKill) => {
                                return (
                                    uniqueKill.kill_method ===
                                    activeUniqueKillId
                                );
                            })}
                            handleUniqueKillEditTrigger={
                                HandleUniqueKillEditTrigger
                            }
                        />
                    ) : (
                        <BerlinUniqueKillCard
                            uniqueKills={uniqueKills.filter((uniqueKill) => {
                                return (
                                    uniqueKill.kill_method ===
                                    activeUniqueKillId
                                );
                            })}
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
        </section>
    );
}

"use client";

import { Mission, Target, UniqueKill } from "@/types";
import UniqueKillEditorDialog from "./UniqueKillEditorDialog";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { UniqueKillTypes } from "@/utils/globals";
import UniqueKillCard from "./UniqueKillCard";

export default function UniqueKills({
    mission,
    activeTarget,
    uniqueKills,
}: {
    mission: Mission;
    activeTarget: Target;
    uniqueKills: UniqueKill[];
}) {
    const session = useSession();

    const [editDialogActive, setEditDialogActive] = useState(false);
    const [createNewUniqueKill, setCreateNewUniqueKill] = useState(false);
    const [currentUniqueKillToEdit, setCurrentUniqueToEdit] =
        useState<UniqueKill>({
            id: "",
            target: "",
            kill_method: "",
            mission: mission,
            name: "New Unique Kill",
            requires: "",
            starts: "",
            timings: "",
            notes: "",
            info: "",
            video_link: "",
            visible: true,
        });

    function handleUniqueKillEditTrigger(
        uniqueKill: UniqueKill,
        isNew: boolean,
    ) {
        setCreateNewUniqueKill(isNew);
        setEditDialogActive(true);
        setCurrentUniqueToEdit(uniqueKill);
    }

    return (
        <>
            <div className="flex flex-col gap-2 sm:gap-2">
                {UniqueKillTypes.map((uniqueKillType, index) => {
                    const filteredUniqueKills = uniqueKills.filter(
                        (uniqueKill) => {
                            return (
                                uniqueKill.kill_method === uniqueKillType &&
                                uniqueKill.target === activeTarget &&
                                uniqueKill.visible
                            );
                        },
                    );

                    if (filteredUniqueKills.length === 0) {
                        return null;
                    }

                    filteredUniqueKills.sort((a, b) =>
                        a.name.localeCompare(b.name),
                    );

                    return (
                        <UniqueKillCard
                            key={index}
                            killType={uniqueKillType}
                            uniqueKills={filteredUniqueKills}
                            handleUniqueKillEditTrigger={
                                handleUniqueKillEditTrigger
                            }
                        />
                    );
                })}
                {session.data?.user?.admin && (
                    <button
                        className="mt-2 w-full items-center justify-between rounded-xl border-4 border-zinc-500 bg-white p-2 font-bold text-zinc-900 hover:bg-red-500 hover:text-white"
                        onClick={() => {
                            handleUniqueKillEditTrigger(
                                {
                                    id: "",
                                    target: activeTarget,
                                    kill_method: "loud_kills",
                                    mission: mission,
                                    name: "New Unique Kill",
                                    requires: "",
                                    starts: "",
                                    timings: "",
                                    notes: "",
                                    info: "",
                                    video_link: "",
                                    visible: true,
                                },
                                true,
                            );
                        }}
                    >
                        {"Create New Unique Kill"}
                    </button>
                )}
            </div>
            {editDialogActive && (
                <UniqueKillEditorDialog
                    uniqueKill={currentUniqueKillToEdit}
                    isNew={createNewUniqueKill}
                    editDialogActive={editDialogActive}
                    setEditDialogActive={setEditDialogActive}
                />
            )}
        </>
    );
}

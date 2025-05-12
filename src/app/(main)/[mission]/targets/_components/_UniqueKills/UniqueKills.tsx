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
            map: mission,
            name: "New Unique Kill",
            requires: "",
            starts: "",
            timings: "",
            notes: "",
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
            <div className="flex flex-col gap-2 sm:gap-4">
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
                        className="w-full items-center justify-between rounded-lg bg-white p-1 font-bold text-zinc-900 hover:bg-red-500 hover:text-white data-[active=true]:border-b-2 data-[active=true]:border-red-500 sm:p-2 sm:data-[active=true]:border-b-4"
                        onClick={() => {
                            handleUniqueKillEditTrigger(
                                {
                                    id: "",
                                    target: activeTarget,
                                    kill_method: "loud_kills",
                                    map: mission,
                                    name: "New Unique Kill",
                                    requires: "",
                                    starts: "",
                                    timings: "",
                                    notes: "",
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

"use client";

import { UniqueKill } from "@/types";
import UniqueKillEditorDialog from "./UniqueKillEditorDialog";
import { useSession } from "next-auth/react";
import { useState } from "react";
import BerlinUniqueKillCard from "./BerlinUniqueKillCard";

export default function BerlinUniqueKills({
    activeUniqueKill,
    uniqueKills,
}: {
    activeUniqueKill: string;
    uniqueKills: UniqueKill[];
}) {
    const session = useSession();

    const [editDialogActive, setEditDialogActive] = useState(false);
    const [createNewUniqueKill, setCreateNewUniqueKill] = useState(false);
    const [currentUniqueKillToEdit, setCurrentUniqueToEdit] =
        useState<UniqueKill>({
            id: "",
            target: "",
            kill_method: activeUniqueKill,
            mission: "berlin",
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

    const filteredUniqueKills = uniqueKills.filter((uniqueKill) => {
        return (
            uniqueKill.kill_method === activeUniqueKill && uniqueKill.visible
        );
    });

    return (
        <>
            <div className="flex flex-col gap-2 sm:gap-4">
                <BerlinUniqueKillCard
                    uniqueKills={filteredUniqueKills}
                    handleUniqueKillEditTrigger={handleUniqueKillEditTrigger}
                />
                {session.data?.user?.admin && (
                    <button
                        className="w-full items-center justify-between rounded-lg bg-white p-1 font-bold text-zinc-900 hover:bg-red-500 hover:text-white data-[active=true]:border-b-2 data-[active=true]:border-red-500 sm:p-2 sm:data-[active=true]:border-b-4"
                        onClick={() => {
                            handleUniqueKillEditTrigger(
                                {
                                    id: "",
                                    target: "",
                                    kill_method: activeUniqueKill,
                                    mission: "berlin",
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

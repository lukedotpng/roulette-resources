"use client";

import { Isolation, Mission, Target } from "@/types";
import IsolationCard from "./IsolationCard";
import { useState } from "react";
import { useSession } from "next-auth/react";
import IsolationEditorDialog from "./IsolationEditorDialog";

export default function Isolations({
    mission,
    target,
    isolations,
}: {
    mission: Mission;
    target: Target;
    isolations: Isolation[];
}) {
    const session = useSession();

    const [editDialogActive, setEditDialogActive] = useState(false);
    const [createNewIsolation, setCreateNewIsolation] = useState(false);
    const [currentIsolationToEdit, setCurrentIsolationToEdit] =
        useState<Isolation>({
            id: "",
            target: "",
            map: mission,
            name: "New Isolation",
            requires: "",
            starts: "",
            timings: "",
            notes: "",
            video_link: "",
            visible: true,
        });

    function handleIsolationEditTrigger(isolation: Isolation, isNew: boolean) {
        setCreateNewIsolation(isNew);
        setEditDialogActive(true);
        setCurrentIsolationToEdit(isolation);
    }

    return (
        <>
            <div className="flex flex-col gap-2">
                {isolations.map((isolation, index) => {
                    if (
                        target !== isolation.target ||
                        isolation.visible === false
                    ) {
                        return null;
                    }
                    return (
                        <IsolationCard
                            key={index}
                            isolation={isolation}
                            handleIsolationEditTrigger={
                                handleIsolationEditTrigger
                            }
                        />
                    );
                })}
                {session.data?.user?.admin && (
                    <button
                        className="w-full rounded-b-lg bg-white p-3 text-zinc-900 hover:bg-red-500 hover:text-white"
                        onClick={() =>
                            handleIsolationEditTrigger(
                                {
                                    id: "",
                                    target: target,
                                    map: mission,
                                    name: "New Isolation",
                                    requires: "",
                                    starts: "",
                                    timings: "",
                                    notes: "",
                                    video_link: "",
                                    visible: true,
                                },
                                true,
                            )
                        }
                    >
                        Add New Isolation
                    </button>
                )}
            </div>
            {editDialogActive && (
                <IsolationEditorDialog
                    isolation={currentIsolationToEdit}
                    isNew={createNewIsolation}
                    editDialogActive={editDialogActive}
                    setEditDialogActive={setEditDialogActive}
                />
            )}
        </>
    );
}

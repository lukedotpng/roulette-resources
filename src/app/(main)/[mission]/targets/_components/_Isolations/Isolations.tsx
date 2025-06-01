"use client";

import dynamic from "next/dynamic";

import { IsolationInsert, IsolationSelect, Mission, Target } from "@/types";
// Dont rerender because of MDXEditor
const IsolationCard = dynamic(() => import("./IsolationCard"), { ssr: false });
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
    isolations: IsolationSelect[];
}) {
    const session = useSession();

    const [editDialogActive, setEditDialogActive] = useState(false);
    const [createNewIsolation, setCreateNewIsolation] = useState(false);
    const [currentIsolationToEdit, setCurrentIsolationToEdit] =
        useState<IsolationInsert>({
            id: "",
            target: "",
            mission: mission,
            name: "New Isolation",
            info: "",
            video_link: "",
            visible: true,
        });

    function handleIsolationEditTrigger(
        isolation: IsolationInsert,
        isNew: boolean,
    ) {
        setCreateNewIsolation(isNew);
        setEditDialogActive(true);
        setCurrentIsolationToEdit(isolation);
    }

    const sortedIsolations = [...isolations];
    sortedIsolations.sort((a, b) => a.name.localeCompare(b.name));

    return (
        <>
            <div className="flex flex-col gap-2">
                {sortedIsolations.map((isolation, index) => {
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
                        className="w-full rounded-xl border-4 border-zinc-500 bg-white p-3 text-zinc-900 hover:bg-red-500 hover:text-white"
                        onClick={() =>
                            handleIsolationEditTrigger(
                                {
                                    id: "",
                                    target: target,
                                    mission: mission,
                                    name: "New Isolation",
                                    info: "",
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

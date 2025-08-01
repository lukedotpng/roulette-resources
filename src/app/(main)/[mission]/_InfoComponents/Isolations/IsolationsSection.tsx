"use client";

import { IsolationInsert, IsolationSelect, Mission, Target } from "@/types";
import { useState } from "react";
import { useSession } from "next-auth/react";
import IsolationEditorDialog from "../../_EditorComponents/IsolationEditorDialog";
import { MISSION_TARGET_LIST } from "@/utils/globals";
import { TargetIDToDisplayText } from "@/utils/FormattingUtils";
import IsolationCard from "./IsolationCard";

export default function IsolationsSection({
    mission,
    isolations,
}: {
    mission: Mission;
    isolations: IsolationSelect[];
}) {
    const session = useSession();

    const targets =
        mission === "hokkaido"
            ? (["yuki_yamazaki"] as readonly Target[])
            : MISSION_TARGET_LIST[mission];

    const [activeTargetId, setActiveTargetId] = useState(targets[0]);
    function SetActiveTarget(option: string) {
        setActiveTargetId(option as Target);
    }

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

    function HandleIsolationEditTrigger(
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
        <section className="flex w-full flex-col justify-center gap-2.5 px-2 sm:px-5">
            <h1 className="border-b-2 border-white text-[1.2em] font-bold">
                {"Isolations"}
            </h1>
            <div className="flex flex-col items-center gap-2 md:flex-row md:items-start">
                <div className="flex w-full flex-col items-center gap-2 md:max-w-50 md:gap-4">
                    <div className="flex w-full flex-row flex-wrap justify-center gap-1 md:flex-col">
                        {targets.map((target) => {
                            return (
                                <button
                                    key={target}
                                    data-active={target === activeTargetId}
                                    className="w-full max-w-50 flex-1 rounded-lg border-2 border-zinc-500 bg-white p-1 font-bold text-nowrap text-zinc-900 hover:bg-red-500 hover:text-white data-[active=true]:bg-red-500 data-[active=true]:text-white md:w-50"
                                    onClick={() => {
                                        SetActiveTarget(target);
                                    }}
                                >
                                    {TargetIDToDisplayText(target)}
                                </button>
                            );
                        })}
                    </div>
                    {session.data?.user?.admin && (
                        <button
                            className="w-full max-w-50 rounded-lg border-2 border-zinc-500 bg-white p-1 font-bold text-zinc-900 hover:bg-red-500 hover:text-white"
                            onClick={() =>
                                HandleIsolationEditTrigger(
                                    {
                                        id: "",
                                        target: "",
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
                <div className="flex w-full flex-wrap justify-center gap-2">
                    {sortedIsolations.map((isolation, index) => {
                        if (
                            activeTargetId !== isolation.target ||
                            isolation.visible === false
                        ) {
                            return null;
                        }
                        return (
                            <IsolationCard
                                key={index}
                                isolation={isolation}
                                HandleIsolationEditTrigger={
                                    HandleIsolationEditTrigger
                                }
                            />
                        );
                    })}
                </div>
            </div>
            {editDialogActive && (
                <IsolationEditorDialog
                    isolation={currentIsolationToEdit}
                    isNew={createNewIsolation}
                    editDialogActive={editDialogActive}
                    setEditDialogActive={setEditDialogActive}
                />
            )}
        </section>
    );
}

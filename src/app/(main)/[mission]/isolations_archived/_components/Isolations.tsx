"use client";

import { Isolation, Mission, Target } from "@/types";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import IsolationEditorDialog from "./IsolationEditorDialog";
import IsolationCard from "./IsolationCard";
import ImageDropdown from "../../_components/ImageDropdown";

export default function Isolations({
    targets,
    mission,
    isolations,
}: {
    targets: readonly Target[];
    mission: Mission;
    isolations: Isolation[];
}) {
    const searchParams = useSearchParams();
    const session = useSession();

    const [activeTargetId, setActiveTargetId] = useState<Target>(
        (searchParams.get("o") as Target) ?? targets[0],
    );
    function SetActiveTarget(targetId: string) {
        setActiveTargetId(targetId as Target);
    }

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
        <section className="flex flex-col items-center gap-5 md:flex-row md:items-start">
            <ImageDropdown
                activeOption={activeTargetId}
                optionImageRootPath="/targets"
                optionList={targets as string[]}
                SetActiveOption={SetActiveTarget}
                OptionFormatter={TargetIDToDisplayText}
                optionQueryKey="target"
            />
            <div className="flex flex-col gap-2">
                {isolations.map((isolation, index) => {
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
                                    target: activeTargetId,
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
        </section>
    );
}

function TargetIDToDisplayText(target: string) {
    let targetDisplayText = "";
    const words = target.split("_");

    for (const word of words) {
        targetDisplayText += word.charAt(0).toUpperCase() + word.slice(1) + " ";
    }

    return targetDisplayText;
}

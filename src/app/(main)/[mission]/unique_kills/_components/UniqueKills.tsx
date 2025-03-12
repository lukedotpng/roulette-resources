"use client";

import { UniqueKillTypes } from "@/lib/globals";
import { Mission, Target, UniqueKill } from "@/types";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import UniqueKillCard from "./UniqueKillCard";
import UniqueKillEditorDialog from "./UniqueKillEditorDialog";
import { useSession } from "next-auth/react";
import ImageDropdown from "../../_components/ImageDropdown";
import { TargetIDToDisplayText } from "@/lib/FormattingUtils";

export default function UniqueKills({
    targets,
    mission,
    uniqueKills,
}: {
    targets: readonly Target[];
    mission: Mission;
    uniqueKills: UniqueKill[];
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
        <section className="flex flex-col items-center gap-3 md:flex-row md:items-start md:gap-5">
            <ImageDropdown
                activeOption={activeTargetId}
                optionImageRootPath="/targets"
                optionList={targets as string[]}
                SetActiveOption={SetActiveTarget}
                OptionFormatter={TargetIDToDisplayText}
            />
            <div className="flex flex-col gap-2 sm:gap-4">
                {UniqueKillTypes.map((uniqueKillType, index) => {
                    const filteredUniqueKills = uniqueKills.filter(
                        (uniqueKill) => {
                            return (
                                uniqueKill.kill_method === uniqueKillType &&
                                uniqueKill.target === activeTargetId &&
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
                        className="w-full items-center justify-between rounded-lg bg-white p-3 font-bold text-zinc-900 hover:bg-red-500 hover:text-white data-[active=true]:border-b-2 data-[active=true]:border-red-500 sm:data-[active=true]:border-b-4"
                        onClick={() => {
                            handleUniqueKillEditTrigger(
                                {
                                    id: "",
                                    target: activeTargetId,
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
        </section>
    );
}

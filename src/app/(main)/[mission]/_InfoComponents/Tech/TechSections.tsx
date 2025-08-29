"use client";

import { TechSelect, Mission, TechInsert } from "@/types";
import { useSession } from "next-auth/react";
import { useState } from "react";
import TechCard from "./TechCard";
import TechEditorDialog from "../../_EditorComponents/TechEditorDialog";

export default function TechSection({
    mission,
    tech,
}: {
    mission: Mission;
    tech: TechSelect[];
}) {
    const session = useSession();

    const [editDialogActive, setEditDialogActive] = useState(false);
    const [createNewTech, setCreateNewTech] = useState(false);
    const [currentTechToEdit, setCurrentTechToEdit] = useState<TechInsert>({
        id: "",
        mission: mission,
        name: "New Tech",
        notes: "",
        video_link: "",
        visible: true,
    });

    function HandleTechEditTrigger(tech: TechInsert, isNew: boolean) {
        setCreateNewTech(isNew);
        setEditDialogActive(true);
        setCurrentTechToEdit(tech);
    }

    return (
        <section className="flex w-full flex-col justify-center gap-2.5 px-2 sm:px-5">
            <h1 className="border-b-2 border-white text-[1.2em] font-bold">
                {"Tech"}
            </h1>
            <div className="flex flex-col items-center gap-2 md:flex-row md:items-start">
                <div className="flex w-full max-w-50 flex-col items-center gap-2 md:gap-4">
                    {session.data?.user?.admin && (
                        <button
                            className="w-full max-w-50 min-w-24 rounded-lg border-2 border-zinc-500 bg-white p-1 font-bold text-zinc-900 hover:bg-red-500 hover:text-white md:w-50"
                            onClick={() =>
                                HandleTechEditTrigger(
                                    {
                                        id: "",
                                        mission: mission,
                                        name: "New Tech",
                                        notes: "",
                                        video_link: "",
                                        visible: true,
                                    },
                                    true,
                                )
                            }
                        >
                            Add New Tech
                        </button>
                    )}
                </div>
                <div className="flex w-full flex-wrap justify-center gap-2 sm:gap-2">
                    {tech === null || tech.length === 0 ? (
                        <h1>No data for this map :(</h1>
                    ) : (
                        tech.map((tech, index) => {
                            if (tech.visible === false) {
                                return null;
                            }
                            return (
                                <TechCard
                                    key={index}
                                    tech={tech}
                                    HandleTechEditTrigger={
                                        HandleTechEditTrigger
                                    }
                                />
                            );
                        })
                    )}
                </div>
            </div>
            {editDialogActive && (
                <TechEditorDialog
                    tech={currentTechToEdit}
                    isNew={createNewTech}
                    editDialogActive={editDialogActive}
                    setEditDialogActive={setEditDialogActive}
                />
            )}
        </section>
    );
}

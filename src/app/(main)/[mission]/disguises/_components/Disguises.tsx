"use client";

import { Disguise } from "@/types";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import DisguiseCard from "./DisguiseCard";
import DisguiseVideoEditorDialog from "./DisguiseVideoEditorDialog";
import { DisguiseIDToDisplayText } from "@/utils/FormattingUtils";
import { useSession } from "next-auth/react";
import ImageDropdown from "../../_components/ImageDropdown";

export default function Disguises({ disguises }: { disguises: Disguise[] }) {
    const searchParams = useSearchParams();
    const session = useSession();

    const disguiseIdList: string[] = [];
    for (const disguise of disguises) {
        disguiseIdList.push(disguise.id);
    }

    const [activeDisguiseId, setActiveDisguiseId] = useState(
        searchParams.get("o") ?? disguises[0].id,
    );
    const [activeDisguise, setActiveDisguise] = useState(disguises[0]);

    const [editDialogActive, setEditDialogActive] = useState(false);

    useEffect(() => {
        for (const disguise of disguises) {
            if (disguise.id === activeDisguiseId) {
                setActiveDisguise(disguise);
            }
        }
    }, [activeDisguiseId, activeDisguise, disguises]);

    return (
        <section className="flex flex-col items-center gap-3 sm:flex-row sm:items-start sm:gap-5">
            <ImageDropdown
                activeOption={activeDisguiseId}
                optionImageRootPath="/disguises"
                optionList={disguiseIdList}
                SetActiveOption={setActiveDisguiseId}
                OptionFormatter={DisguiseIDToDisplayText}
            />
            <div>
                <DisguiseCard disguise={activeDisguise} />
                {session.data?.user?.admin && (
                    <button
                        className="mt-1 w-full rounded-b-lg bg-white p-3 text-zinc-900 hover:bg-red-500 hover:text-white"
                        onClick={() => setEditDialogActive(true)}
                    >
                        Add New Video
                    </button>
                )}
            </div>
            {editDialogActive && (
                <DisguiseVideoEditorDialog
                    disguise={activeDisguise}
                    editDialogActive={editDialogActive}
                    setEditDialogActive={setEditDialogActive}
                />
            )}
        </section>
    );
}

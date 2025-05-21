"use client";

import { Disguise, DisguiseVideo, Mission } from "@/types";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import DisguiseCard from "./DisguiseCard";
import DisguiseVideoEditorDialog from "./DisguiseVideoEditorDialog";
import { DisguiseIDToDisplayText } from "@/utils/FormattingUtils";
import { useSession } from "next-auth/react";
import ImageDropdown from "../../_components/ImageDropdown";

export default function Disguises({
    mission,
    disguises,
}: {
    mission: Mission;
    disguises: Disguise[];
}) {
    const searchParams = useSearchParams();
    const session = useSession();

    const disguiseIdList: string[] = [];
    for (const disguise of disguises) {
        const disguiseIdListNoMission = disguise.id.split("-")[1];
        disguiseIdList.push(disguiseIdListNoMission);
    }

    const searchParamQuery = "d";
    const [activeDisguiseId, setActiveDisguiseId] = useState(
        searchParams.get(searchParamQuery) ?? disguiseIdList[0],
    );
    const [activeDisguise, setActiveDisguise] = useState(disguises[0]);
    useEffect(() => {
        setActiveDisguiseId(
            searchParams.get(searchParamQuery) ?? disguiseIdList[0],
        );
    }, [searchParams.get(searchParamQuery)]);

    const [disguiseVideoToEdit, setDisguiseVideoToEdit] =
        useState<DisguiseVideo>({
            id: "",
            notes: "",
            disguise_id: "",
            link: "",
            visible: true,
        });
    const [editDialogActive, setEditDialogActive] = useState(false);
    const [disguiseIsNew, setDisguiseIsNew] = useState(false);
    function SetEditDialogActive(
        updatedEditDialogActive: boolean,
        isNew: boolean,
        disguiseVideo?: DisguiseVideo,
    ) {
        setEditDialogActive(updatedEditDialogActive);
        setDisguiseIsNew(isNew);
        if (isNew) {
            const newDisguiseVideo: DisguiseVideo = {
                id: "",
                notes: "",
                disguise_id: activeDisguise.id,
                link: "",
                visible: true,
            };
            setDisguiseVideoToEdit(newDisguiseVideo);
        } else if (disguiseVideo !== undefined) {
            setDisguiseVideoToEdit(disguiseVideo);
        }
    }

    useEffect(() => {
        for (const disguise of disguises) {
            const disguiseIdWithMission = mission + "-" + activeDisguiseId;
            if (disguise.id === disguiseIdWithMission) {
                setActiveDisguise(disguise);
            }
        }
    }, [activeDisguiseId, activeDisguise, disguises]);

    return (
        <section className="flex flex-col items-center gap-3 sm:flex-row sm:items-start sm:gap-5">
            <ImageDropdown
                activeOption={activeDisguiseId}
                optionImageRootPath="/disguises"
                optionImagePrefix={mission + "-"}
                optionList={disguiseIdList}
                SetActiveOption={setActiveDisguiseId}
                OptionFormatter={DisguiseIDToDisplayText}
                optionQueryKey={searchParamQuery}
            />
            <div className="flex flex-col gap-2">
                <DisguiseCard
                    disguise={activeDisguise}
                    SetEditDialogActive={SetEditDialogActive}
                />
                {session.data?.user?.admin && (
                    <button
                        className="w-full rounded-xl border-4 border-zinc-500 bg-white p-2 font-bold text-zinc-900 hover:bg-red-500 hover:text-white"
                        onClick={() => SetEditDialogActive(true, true)}
                    >
                        {"Add New Video"}
                    </button>
                )}
            </div>
            {editDialogActive && (
                <DisguiseVideoEditorDialog
                    disguise={activeDisguise}
                    disguiseVideo={disguiseVideoToEdit}
                    isNew={disguiseIsNew}
                    editDialogActive={editDialogActive}
                    setEditDialogActive={setEditDialogActive}
                />
            )}
        </section>
    );
}

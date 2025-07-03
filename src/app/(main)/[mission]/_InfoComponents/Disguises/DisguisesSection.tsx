"use client";

import {
    DisguiseSelect,
    DisguiseVideoInsert,
    DisguiseVideoSelect,
    Mission,
} from "@/types";
import ImageDropdown from "../../_components/ImageDropdown";
import { DisguiseIDToDisplayText } from "@/utils/FormattingUtils";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, use } from "react";
import DisguiseCard from "./DisguiseCard";
import DisguiseVideoEditorDialog from "../../disguises/_components/DisguiseVideoEditorDialog";

export default function DisguisesSection({
    mission,
    disguisesPromise,
}: {
    mission: Mission;
    disguisesPromise: Promise<DisguiseSelect[]>;
}) {
    const disguises = use(disguisesPromise);

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
        useState<DisguiseVideoInsert>({
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
        disguiseVideo?: DisguiseVideoSelect,
    ) {
        setEditDialogActive(updatedEditDialogActive);
        setDisguiseIsNew(isNew);
        if (isNew) {
            const newDisguiseVideo: DisguiseVideoInsert = {
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
        <section className="flex w-full flex-col justify-center gap-2.5 px-2 sm:px-5">
            <h1 className="border-b-2 border-white text-[1.5em] font-bold">
                {"Disguises"}
            </h1>
            <div className="flex gap-2">
                <div className="flex flex-col gap-2">
                    <ImageDropdown
                        activeOption={activeDisguiseId}
                        optionImageRootPath="/disguises"
                        optionImagePrefix={mission + "-"}
                        optionList={disguiseIdList}
                        SetActiveOption={setActiveDisguiseId}
                        OptionFormatter={DisguiseIDToDisplayText}
                        optionQueryKey={searchParamQuery}
                    />
                    {session.data?.user?.admin && (
                        <button
                            className="w-full rounded-lg border-2 border-zinc-500 bg-white p-1 font-bold text-zinc-900 hover:bg-red-500 hover:text-white"
                            onClick={() => SetEditDialogActive(true, true)}
                        >
                            {"Add New Video"}
                        </button>
                    )}
                </div>
                <div className="flex flex-1 flex-col gap-2">
                    <DisguiseCard
                        disguise={activeDisguise}
                        SetEditDialogActive={SetEditDialogActive}
                    />
                </div>
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

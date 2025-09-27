import {
    DisguiseSelect,
    DisguiseVideoInsert,
    DisguiseVideoSelect,
    Mission,
} from "@/types";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import DisguiseCard from "./DisguiseCard";
import DisguiseVideoEditorDialog from "../../_EditorComponents/DisguiseVideoEditorDialog";
import DisguiseOptionPicker from "./DisguiseOptionPicker";

export default function DisguisesSection({
    mission,
    disguises,
}: {
    mission: Mission;
    disguises: DisguiseSelect[];
}) {
    const searchParams = useSearchParams();
    const session = useSession();

    const disguiseIdList: string[] = useMemo(() => {
        const disguiseIdList = [];
        for (const disguise of disguises) {
            const disguiseIdListNoMission = disguise.id.split("-")[1];
            disguiseIdList.push(disguiseIdListNoMission);
        }
        return disguiseIdList;
    }, [disguises]);

    const searchParamQuery = "d";
    const [activeDisguiseId, setActiveDisguiseId] = useState(
        searchParams.get(searchParamQuery) ?? disguiseIdList[0],
    );
    const [activeDisguise, setActiveDisguise] = useState(disguises[0]);
    useEffect(() => {
        setActiveDisguiseId(
            searchParams.get(searchParamQuery) ?? disguiseIdList[0],
        );
    }, [disguiseIdList, searchParams]);

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
    }, [activeDisguiseId, disguises, mission]);

    return (
        <section
            id="disguises"
            className="flex w-full flex-col justify-center gap-2.5 px-2 sm:px-5"
        >
            <h1 className="border-b-2 border-white text-[1.2em] font-bold">
                {"Disguises"}
            </h1>
            <div className="flex flex-col items-center gap-2 md:flex-row md:items-start">
                <div className="flex w-full max-w-50 flex-col gap-2">
                    <DisguiseOptionPicker
                        mission={mission}
                        activeDisguise={activeDisguiseId}
                        disguiseList={disguiseIdList}
                        SetActiveDisguise={setActiveDisguiseId}
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

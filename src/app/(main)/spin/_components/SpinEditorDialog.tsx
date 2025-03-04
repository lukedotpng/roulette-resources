import {
    Dialog,
    DialogContent,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
} from "@radix-ui/react-dialog";

import {
    DisguiseIDToDisplayText,
    DisguiseImagePathFormatter,
    MethodIDToDisplayText,
} from "../../../../lib/SpinUtils";
import { Mission, SpinTarget, SpinUpdateAction } from "@/types";
import {
    MissionDisguisesList,
    MissionSpinInfoList,
    TargetUniqueKillsList,
    weapons,
} from "../SpinGlobals";
import { Dispatch, SetStateAction } from "react";
import Image from "next/image";

export default function SpinEditorDialog({
    mission,
    target,
    categoryToEdit,
    HandleSpinEdit,
    dialogActive,
    setDialogActive,
}: {
    mission: Mission;
    target: SpinTarget;
    categoryToEdit: SpinUpdateAction;
    HandleSpinEdit: (updatedValue: string) => void;
    dialogActive: boolean;
    setDialogActive: Dispatch<SetStateAction<boolean>>;
}) {
    const meleeOptions = MissionSpinInfoList[mission].conditions.melee;
    const weaponOptions = weapons;
    const uniqueKillOptions =
        target === "erich_soders"
            ? [...TargetUniqueKillsList[target]]
            : [
                  ...MissionSpinInfoList[mission].conditions.unique_kill,
                  ...TargetUniqueKillsList[target],
              ];

    const disguises = MissionDisguisesList[mission];

    return (
        <Dialog
            open={dialogActive}
            onOpenChange={(open) => setDialogActive(open)}
        >
            <DialogPortal>
                <DialogOverlay className="fixed inset-0 bg-zinc-900 opacity-80" />
                <DialogContent className="fixed top-1/2 left-1/2 max-h-[70%] w-[90%] -translate-x-1/2 -translate-y-1/2 overflow-scroll rounded-lg bg-white sm:max-h-[90%] sm:w-[35rem]">
                    <DialogTitle className="w-full p-3 text-center text-base font-bold sm:text-xl">
                        {`Choose a ${categoryToEdit === "condition" ? "Method" : "Disguise"}`}
                    </DialogTitle>
                    {categoryToEdit === "condition" ? (
                        <div className="flex justify-center">
                            {target !== "erich_soders" && (
                                <MethodOptionList
                                    title={"Melees"}
                                    target={target}
                                    options={meleeOptions}
                                    HandleClick={HandleSpinEdit}
                                />
                            )}
                            <MethodOptionList
                                title={"Weapons"}
                                target={target}
                                options={weaponOptions}
                                HandleClick={HandleSpinEdit}
                            />
                            <MethodOptionList
                                title={"Unique Kills"}
                                target={target}
                                options={uniqueKillOptions}
                                HandleClick={HandleSpinEdit}
                            />
                        </div>
                    ) : (
                        <DisguiseOptionList
                            mission={mission}
                            options={disguises}
                            HandleClick={HandleSpinEdit}
                        />
                    )}
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}

function MethodOptionList({
    title,
    target,
    options,
    HandleClick,
}: {
    title: string;
    target: SpinTarget;
    options: string[];
    HandleClick: (option: string) => void;
}) {
    return (
        <section className="mx-1 mb-2 flex h-fit flex-col border-zinc-900 text-[.6rem] sm:mb-4 sm:text-base">
            <h2 className="text-center font-bold">{title}</h2>
            <div className="flex flex-col gap-1">
                {options.map((option) => {
                    return (
                        <div key={option} className="border-zinc-900">
                            <button
                                className="w-full border-2 border-zinc-900 bg-white px-2 py-1 text-zinc-900 hover:bg-red-500 hover:text-white"
                                onClick={() => {
                                    if (
                                        option === "explosive" &&
                                        target !== "erich_soders"
                                    ) {
                                        HandleClick("remote_" + option);
                                        return;
                                    }
                                    HandleClick(option);
                                }}
                            >
                                {MethodIDToDisplayText(option)}
                            </button>
                            {title === "Weapons" &&
                                (option === "explosive" &&
                                target !== "erich_soders" ? (
                                    <div className="mx-1 mb-1 flex border-2 border-t-0 border-zinc-900 text-[.9em]">
                                        <button
                                            className="flex-1 bg-white px-2 text-zinc-900 hover:bg-red-500 hover:text-white"
                                            onClick={() =>
                                                HandleClick("remote_" + option)
                                            }
                                        >
                                            {"Remote"}
                                        </button>
                                        <button
                                            className="flex-1 bg-white px-2 text-zinc-900 hover:bg-red-500 hover:text-white"
                                            onClick={() =>
                                                HandleClick("loud_" + option)
                                            }
                                        >
                                            {"Loud"}
                                        </button>
                                        <button
                                            className="flex-1 bg-white px-2 text-zinc-900 hover:bg-red-500 hover:text-white"
                                            onClick={() =>
                                                HandleClick("impact_" + option)
                                            }
                                        >
                                            {"Impact"}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="mx-1 mb-1 flex border-2 border-t-0 border-zinc-900 text-[.9em]">
                                        <button
                                            className="flex-1 bg-white px-2 text-zinc-900 hover:bg-red-500 hover:text-white"
                                            onClick={() =>
                                                HandleClick(
                                                    "silenced_" + option,
                                                )
                                            }
                                        >
                                            {"Silenced"}
                                        </button>
                                        <button
                                            className="flex-1 bg-white px-2 text-zinc-900 hover:bg-red-500 hover:text-white"
                                            onClick={() =>
                                                HandleClick("loud_" + option)
                                            }
                                        >
                                            {"Loud"}
                                        </button>
                                    </div>
                                ))}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

function DisguiseOptionList({
    mission,
    options,
    HandleClick,
}: {
    mission: Mission;
    options: string[];
    HandleClick: (option: string) => void;
}) {
    options.sort((a, b) => (a < b ? 0 : 1));

    return (
        <section className="mx-1 mb-2 flex h-fit flex-col border-zinc-900 text-[.6rem] sm:text-base">
            <div className="grid grid-cols-2 gap-1">
                {options.map((option) => {
                    return (
                        <div
                            key={option}
                            className="flex border-2 border-zinc-900"
                        >
                            <button
                                className="w-full bg-white text-zinc-900 hover:bg-red-500 hover:text-white"
                                onClick={() => {
                                    HandleClick(option);
                                }}
                            >
                                {DisguiseIDToDisplayText(option)}
                            </button>
                            <Image
                                src={DisguiseImagePathFormatter(
                                    option,
                                    mission,
                                )}
                                alt={option ?? "No Disguise"}
                                width={693}
                                height={517}
                                quality={10}
                                className="aspect-[693/517] h-full w-10 border-l-[1px] border-white object-cover sm:w-16 sm:border-l-2"
                            />
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

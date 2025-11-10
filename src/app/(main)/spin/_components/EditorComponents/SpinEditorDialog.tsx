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
} from "@/utils/FormattingUtils";
import { Mission } from "@/types";
import { Dispatch, SetStateAction } from "react";
import Image from "next/image";
import { SpinUpdateAction } from "../../types";
import {
    WEAPONS,
    TARGET_UNIQUE_KILLS_LIST,
    MISSION_DISGUISES_LIST,
    MISSION_CONDITIONS_MAP,
} from "@/lib/RouletteSpinner/globals";
import { SpinTarget } from "@/lib/RouletteSpinner/types";

export default function SpinEditorDialog({
    mission,
    target,
    categoryToEdit,
    EditSpin,
    dialogActive,
    setDialogActive,
}: {
    mission: Mission;
    target: SpinTarget;
    categoryToEdit: SpinUpdateAction;
    EditSpin: (updatedValue: string) => void;
    dialogActive: boolean;
    setDialogActive: Dispatch<SetStateAction<boolean>>;
}) {
    const meleeOptions = MISSION_CONDITIONS_MAP[mission].killMethods.melees;
    const weaponOptions = WEAPONS;
    const uniqueKillOptions =
        target === "erich_soders"
            ? [...TARGET_UNIQUE_KILLS_LIST[target]]
            : [
                  ...MISSION_CONDITIONS_MAP[mission].killMethods.unique_kills,
                  ...TARGET_UNIQUE_KILLS_LIST[target],
              ];

    const disguises = MISSION_DISGUISES_LIST[mission];

    return (
        <Dialog
            open={dialogActive}
            onOpenChange={(open) => setDialogActive(open)}
        >
            <DialogPortal>
                <DialogOverlay className="fixed inset-0 bg-zinc-900 opacity-80" />
                <DialogContent className="fixed top-1/2 left-1/2 max-h-[20rem] w-[90%] max-w-[40rem] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg bg-white sm:max-h-[30rem]">
                    <DialogTitle className="w-full p-3 text-center text-base font-bold sm:text-xl">
                        {`Choose a ${categoryToEdit === "killMethod" ? "Method" : "Disguise"}`}
                    </DialogTitle>
                    {categoryToEdit === "killMethod" ? (
                        <div className="flex w-full justify-around">
                            {target !== "erich_soders" && (
                                <MethodOptionList
                                    title={"Melees"}
                                    target={target}
                                    options={meleeOptions}
                                    HandleClick={EditSpin}
                                />
                            )}
                            <MethodOptionList
                                title={"Weapons"}
                                target={target}
                                options={weaponOptions}
                                HandleClick={EditSpin}
                            />
                            <MethodOptionList
                                title={"Unique Kills"}
                                target={target}
                                options={uniqueKillOptions}
                                HandleClick={EditSpin}
                            />
                        </div>
                    ) : (
                        <DisguiseOptionList
                            mission={mission}
                            options={disguises}
                            HandleClick={EditSpin}
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
                    if (option === "explosive" && target === "erich_soders") {
                        return;
                    }
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
                                    if (
                                        option === "explosive" &&
                                        target === "erich_soders"
                                    ) {
                                        HandleClick("explosion");
                                        return;
                                    }
                                    HandleClick(option);
                                }}
                            >
                                {MethodIDToDisplayText(option)}
                            </button>
                            {title === "Weapons" &&
                                (option === "explosive" ? (
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
    const sortedOptions = [...options];
    sortedOptions.sort((a, b) => (a < b ? 0 : 1));

    return (
        <section className="mx-1 mb-2 flex h-fit flex-col border-zinc-900 text-[.6rem] sm:text-base">
            <div className="grid grid-cols-2 gap-1">
                {sortedOptions.map((option) => {
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
                                className="aspect-[693/517] h-full w-10 object-cover sm:w-16"
                            />
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

import {
    TargetImagePathFormatter,
    DisguiseIDToDisplayText,
    TargetIDToDisplayText,
    MethodIDToDisplayText,
    MethodImagePathFormatter,
    DisguiseImagePathFormatter,
} from "@/utils/FormattingUtils";
import {
    Mission,
    SpinInfo,
    SpinOptions,
    SpinTarget,
    SpinUpdateAction,
} from "@/types";
import Image from "next/image";
import TargetSpinCardRow from "./TargetSpinCardRow";
import SpinEditorDialog from "../EditorComponents/SpinEditorDialog";
import { useState } from "react";

export default function TargetSpinCard({
    spin,
    target,
    mission,
    options,
    RespinCondition,
    EditSpin,
}: {
    spin: SpinInfo;
    target: SpinTarget;
    mission: Mission;
    options: SpinOptions;
    RespinCondition: (target: SpinTarget, action: SpinUpdateAction) => void;
    EditSpin: (
        target: SpinTarget,
        action: SpinUpdateAction,
        newValue: string,
    ) => void;
}) {
    const [editDialogActive, setEditDialogActive] = useState(false);
    const [categoryToEdit, setCategoryToEdit] =
        useState<SpinUpdateAction>("killMethod");

    const killMethodLocked =
        options.lockedConditions.val[target] !== undefined &&
        options.lockedConditions.val[target].killMethod !== "";

    const disguiseLocked =
        options.lockedConditions.val[target] !== undefined &&
        options.lockedConditions.val[target].disguise !== "";

    const showNtkoBar =
        spin[target]?.ntko ||
        (!killMethodLocked &&
            (options.manualMode.val || options.canAlwaysEditNTKO.val));

    return (
        <div className="w-full max-w-[48rem] border-2 border-white text-white">
            <div className="flex h-24 w-full text-white sm:h-36">
                <div className="relative w-28 border-r-[1px] border-white sm:w-48 sm:border-r-2">
                    <Image
                        src={TargetImagePathFormatter(target)}
                        alt={target}
                        width={693}
                        height={517}
                        className="h-full object-cover object-center"
                    />
                    <h1 className="absolute bottom-0 w-full bg-zinc-900/75 text-center text-[.65rem] font-bold sm:text-[1em]">
                        {TargetIDToDisplayText(target)}
                    </h1>
                </div>
                <div className="flex h-full flex-1 flex-col">
                    <TargetSpinCardRow
                        title="Method"
                        info={
                            MethodIDToDisplayText(spin[target]?.killMethod) ??
                            "No Method"
                        }
                        imageSrc={MethodImagePathFormatter(
                            spin[target]?.killMethod || "No Method",
                            target,
                        )}
                        options={options}
                        HandleSpinUpdate={() =>
                            RespinCondition(target, "killMethod")
                        }
                        EditSpin={() => {
                            setCategoryToEdit("killMethod");
                            setEditDialogActive(true);
                        }}
                        LockCondition={() => {
                            if (spin[target] === undefined) {
                                return;
                            }
                            const updatedLockedConditions = structuredClone(
                                options.lockedConditions.val,
                            );
                            if (updatedLockedConditions[target] === undefined) {
                                updatedLockedConditions[target] = {
                                    killMethod: "",
                                    disguise: "",
                                    ntko: false,
                                };
                            }

                            // Only set lock condition if no condition is locked,
                            // remove lock if there is a current condition
                            if (
                                updatedLockedConditions[target].killMethod ===
                                ""
                            ) {
                                updatedLockedConditions[target].killMethod =
                                    spin[target].killMethod;
                                updatedLockedConditions[target].ntko =
                                    spin[target].ntko;
                            } else {
                                updatedLockedConditions[target].killMethod = "";
                                updatedLockedConditions[target].ntko = false;
                            }

                            options.lockedConditions.Set(
                                updatedLockedConditions,
                            );
                        }}
                        conditionLocked={killMethodLocked}
                    />
                    <TargetSpinCardRow
                        title="Disguise"
                        info={
                            DisguiseIDToDisplayText(spin[target]?.disguise) ??
                            "No Disguise"
                        }
                        imageSrc={DisguiseImagePathFormatter(
                            spin[target]?.disguise || "No Disguise",
                            mission,
                        )}
                        options={options}
                        HandleSpinUpdate={() =>
                            RespinCondition(target, "disguise")
                        }
                        EditSpin={() => {
                            setCategoryToEdit("disguise");
                            setEditDialogActive(true);
                        }}
                        LockCondition={() => {
                            if (spin[target] === undefined) {
                                return;
                            }
                            const updatedLockedConditions = structuredClone(
                                options.lockedConditions.val,
                            );
                            if (updatedLockedConditions[target] === undefined) {
                                updatedLockedConditions[target] = {
                                    killMethod: "",
                                    disguise: "",
                                    ntko: false,
                                };
                            }

                            // Only set lock condition if no condition is locked,
                            // remove lock if there is a current condition
                            if (
                                updatedLockedConditions[target].disguise === ""
                            ) {
                                updatedLockedConditions[target].disguise =
                                    spin[target].disguise;
                            } else {
                                updatedLockedConditions[target].disguise = "";
                            }

                            options.lockedConditions.Set(
                                updatedLockedConditions,
                            );
                        }}
                        conditionLocked={disguiseLocked}
                    />
                    <SpinEditorDialog
                        mission={mission}
                        target={target}
                        categoryToEdit={categoryToEdit}
                        EditSpin={(updatedValue) => {
                            setEditDialogActive(false);
                            EditSpin(target, categoryToEdit, updatedValue);
                        }}
                        dialogActive={editDialogActive}
                        setDialogActive={setEditDialogActive}
                    />
                </div>
            </div>
            {showNtkoBar && (
                <div
                    data-active={spin[target]?.ntko}
                    className="group relative border-t-[1px] border-white bg-zinc-900 py-0.5 text-center text-[.9em] font-bold data-[active=true]:bg-red-500 sm:border-t-2 sm:py-1 sm:text-[1em]"
                >
                    <span className="decoration-2 group-data-[active=false]:line-through">
                        No Target Pacification
                    </span>
                    {!options.matchMode.val && !killMethodLocked && (
                        <button
                            className="absolute top-0 right-2 h-full fill-white"
                            onClick={() =>
                                RespinCondition(target, "toggle_ntko")
                            }
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 448 512"
                                className="hidden h-full w-3 fill-white group-data-[active=true]:block sm:w-5"
                            >
                                {/* Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2024 Fonticons, Inc. */}
                                <path d="M64 80c-8.8 0-16 7.2-16 16l0 320c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-320c0-8.8-7.2-16-16-16L64 80zM0 96C0 60.7 28.7 32 64 32l320 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zM152 232l144 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-144 0c-13.3 0-24-10.7-24-24s10.7-24 24-24z" />
                            </svg>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 448 512"
                                className="hidden h-full w-3 fill-white group-data-[active=false]:block sm:w-5"
                            >
                                {/* Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2024 Fonticons, Inc. */}
                                <path d="M64 80c-8.8 0-16 7.2-16 16l0 320c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-320c0-8.8-7.2-16-16-16L64 80zM0 96C0 60.7 28.7 32 64 32l320 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zM200 344l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
                            </svg>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

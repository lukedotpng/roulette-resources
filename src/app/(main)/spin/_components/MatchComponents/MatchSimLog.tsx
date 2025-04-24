import { MatchSimRecord, Mission, Spin, SpinOptions } from "@/types";
import {
    Dialog,
    DialogTrigger,
    DialogPortal,
    DialogOverlay,
    DialogContent,
    DialogTitle,
} from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import {
    DisguiseIDToDisplayText,
    MethodIDToDisplayText,
    MillisecondsToTimeString,
    TargetIDToDisplayText,
} from "@/utils/FormattingUtils";
import { ParseSpinQuery } from "../../utils/SpinQuery";
import { SpinMissionTargetsList } from "../../utils/SpinGlobals";
import MissionSwitcher from "../PoolComponents/MissionSwitcher";
import Link from "next/link";

export default function MatchSimLog({
    options,
    currentSpin,
}: {
    options: SpinOptions;
    currentSpin: Spin | null;
}) {
    const [showSpinIndex, setShowSpinIndex] = useState(-1);
    const [deleteRecordConfirmationActive, setDeleteRecordConfirmationActive] =
        useState(false);

    const [activeMission, setActiveMission] = useState<Mission>(
        currentSpin ? currentSpin.mission : "paris",
    );
    useEffect(() => {
        if (currentSpin) {
            setActiveMission(currentSpin.mission);
        }
    }, [currentSpin]);

    function OnMissionSwitch(mission: Mission) {
        setShowSpinIndex(-1);
        setActiveMission(mission);
    }

    const [copiedToClipboardAlertActive, setCopiedToClipboardAlertActive] =
        useState(false);

    function EnableCopiedToClipboardAlert() {
        if (!copiedToClipboardAlertActive) {
            setCopiedToClipboardAlertActive(true);
            setTimeout(() => {
                setCopiedToClipboardAlertActive(false);
            }, 1500);
        }
    }

    function GetSimRecordsForMission() {
        const filteredSimRecords = options.simRecords.val.filter((record) => {
            return record.mission === activeMission;
        });
        const sortedSimRecords = filteredSimRecords.sort(
            (a, b) => a.time - b.time,
        );
        return sortedSimRecords;
    }

    function DeleteRecord(record: MatchSimRecord) {
        const updatedSimRecords = options.simRecords.val.filter(
            (currRecord) => {
                if (
                    record.date === currRecord.date &&
                    record.mission === currRecord.mission &&
                    record.spinId === currRecord.spinId &&
                    record.time === currRecord.time
                ) {
                    return false;
                }
                return true;
            },
        );

        setShowSpinIndex(-1);
        options.simRecords.Set(updatedSimRecords);
    }

    return (
        <Dialog>
            <DialogTrigger className="group aspect-square h-full bg-white text-zinc-900 hover:bg-red-500 hover:text-white">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    className="h-[.875rem] w-full fill-zinc-900 group-hover:fill-white sm:h-[1.4rem]"
                >
                    {/* Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2024 Fonticons, Inc. */}
                    <path
                        xmlns="http://www.w3.org/2000/svg"
                        d="M4.1 38.2C1.4 34.2 0 29.4 0 24.6C0 11 11 0 24.6 0L133.9 0c11.2 0 21.7 5.9 27.4 15.5l68.5 114.1c-48.2 6.1-91.3 28.6-123.4 61.9L4.1 38.2zm503.7 0L405.6 191.5c-32.1-33.3-75.2-55.8-123.4-61.9L350.7 15.5C356.5 5.9 366.9 0 378.1 0L487.4 0C501 0 512 11 512 24.6c0 4.8-1.4 9.6-4.1 13.6zM80 336a176 176 0 1 1 352 0A176 176 0 1 1 80 336zm184.4-94.9c-3.4-7-13.3-7-16.8 0l-22.4 45.4c-1.4 2.8-4 4.7-7 5.1L168 298.9c-7.7 1.1-10.7 10.5-5.2 16l36.3 35.4c2.2 2.2 3.2 5.2 2.7 8.3l-8.6 49.9c-1.3 7.6 6.7 13.5 13.6 9.9l44.8-23.6c2.7-1.4 6-1.4 8.7 0l44.8 23.6c6.9 3.6 14.9-2.2 13.6-9.9l-8.6-49.9c-.5-3 .5-6.1 2.7-8.3l36.3-35.4c5.6-5.4 2.5-14.8-5.2-16l-50.1-7.3c-3-.4-5.7-2.4-7-5.1l-22.4-45.4z"
                    />
                </svg>
            </DialogTrigger>
            <DialogPortal>
                <DialogOverlay className="fixed inset-0 bg-zinc-900 opacity-80" />
                <DialogContent className="fixed top-1/5 left-1/2 w-[90%] -translate-x-1/2 rounded-lg bg-white sm:w-[30rem]">
                    <DialogTitle className="flex w-full items-center justify-between p-3 pb-0 text-[1.15em]">
                        <span className="flex-1 font-bold">
                            {"Match Sim Log"}
                        </span>
                        <MissionSwitcher
                            currentMission={activeMission}
                            HandleMissionSwitch={OnMissionSwitch}
                            textColor="zinc-900"
                        />
                        <div className="flex-1"></div>
                    </DialogTitle>
                    <div className="flex max-h-[25rem] flex-col gap-3 overflow-y-scroll p-3 sm:max-h-[30rem]">
                        <ul className="flex h-full w-full flex-col gap-3 overflow-y-scroll">
                            {GetSimRecordsForMission().map((record, index) => {
                                const spin = ParseSpinQuery(record.spinId);

                                if (!spin) {
                                    return;
                                }

                                const targets =
                                    SpinMissionTargetsList[spin.mission];
                                const recordDate = new Date(record.date);

                                return (
                                    <li
                                        key={record.time}
                                        className="flex flex-col border-2 px-1"
                                    >
                                        <div className="flex justify-between gap-1">
                                            <div></div>
                                            <h2 className="inline text-[1.1em]">
                                                <span className="font-mono">
                                                    {MillisecondsToTimeString(
                                                        record.time,
                                                        false,
                                                    )}
                                                </span>
                                                <span>{" - "}</span>
                                                <span>
                                                    {recordDate.toLocaleDateString()}
                                                </span>
                                            </h2>

                                            <button
                                                className="group flex w-10 items-center justify-end"
                                                data-open={
                                                    showSpinIndex === index
                                                }
                                                onClick={() => {
                                                    if (
                                                        showSpinIndex === index
                                                    ) {
                                                        setShowSpinIndex(-1);
                                                    } else {
                                                        setShowSpinIndex(index);
                                                    }
                                                }}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 320 512"
                                                    className={
                                                        "aspect-square h-2.5 fill-zinc-900 group-data-[open=true]:rotate-90 sm:h-3.5"
                                                    }
                                                >
                                                    {/* Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2024 Fonticons, Inc. */}
                                                    <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
                                                </svg>
                                            </button>
                                        </div>
                                        {showSpinIndex === index && (
                                            <div className="flex flex-col p-3 text-[.9em]">
                                                {targets.map((target) => {
                                                    const targetSpinInfo =
                                                        spin.info[target];
                                                    if (!targetSpinInfo) {
                                                        return;
                                                    }

                                                    return (
                                                        <p
                                                            key={target}
                                                            className="inline"
                                                        >
                                                            <span className="font-bold">
                                                                {TargetIDToDisplayText(
                                                                    target,
                                                                )}
                                                                {":"}
                                                            </span>{" "}
                                                            <span>
                                                                <span>
                                                                    {MethodIDToDisplayText(
                                                                        targetSpinInfo.killMethod,
                                                                    )}
                                                                </span>
                                                            </span>
                                                            {" / "}
                                                            <span>
                                                                {DisguiseIDToDisplayText(
                                                                    targetSpinInfo.disguise,
                                                                )}
                                                            </span>
                                                            {targetSpinInfo.ntko && (
                                                                <span className="">
                                                                    {" / NTKO"}
                                                                </span>
                                                            )}
                                                        </p>
                                                    );
                                                })}
                                                <div className="mt-3 flex w-full justify-around gap-3">
                                                    <Link
                                                        href={`/spin?s=${record.spinId}`}
                                                        className="flex-1 border-2 border-zinc-900 py-0.5 text-center decoration-red-500 hover:underline"
                                                        target="_blank"
                                                    >
                                                        {"Replay Spin"}
                                                    </Link>
                                                    <button
                                                        data-active={
                                                            !copiedToClipboardAlertActive
                                                        }
                                                        className="flex-1 cursor-pointer border-2 border-zinc-900 py-0.5 text-center decoration-red-500 data-[active=false]:!cursor-not-allowed data-[active=true]:hover:underline"
                                                        onClick={() => {
                                                            if (
                                                                copiedToClipboardAlertActive
                                                            ) {
                                                                return;
                                                            }
                                                            navigator.clipboard.writeText(
                                                                "https://roulette.luke.town/spin?s=" +
                                                                    record.spinId,
                                                            );
                                                            EnableCopiedToClipboardAlert();
                                                        }}
                                                    >
                                                        {copiedToClipboardAlertActive
                                                            ? "Copied!"
                                                            : "Share Spin"}
                                                    </button>
                                                    <button
                                                        className="flex-1 border-2 border-zinc-900 py-0.5 text-center decoration-red-500 hover:underline"
                                                        onClick={() => {
                                                            setDeleteRecordConfirmationActive(
                                                                true,
                                                            );
                                                        }}
                                                    >
                                                        {"Remove Spin"}
                                                    </button>
                                                    <Dialog
                                                        open={
                                                            deleteRecordConfirmationActive
                                                        }
                                                        onOpenChange={() => {
                                                            setDeleteRecordConfirmationActive(
                                                                false,
                                                            );
                                                        }}
                                                    >
                                                        <DialogPortal>
                                                            <DialogOverlay className="fixed inset-0 bg-zinc-900 opacity-80" />
                                                            <DialogContent className="fixed top-1/2 left-1/2 w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white sm:w-[30rem]">
                                                                <DialogTitle className="w-full p-3 text-center font-bold">
                                                                    Are you sure
                                                                    you want to
                                                                    delete?
                                                                </DialogTitle>
                                                                <div className="flex">
                                                                    <button
                                                                        className="flex-1 rounded-bl-lg bg-white p-3 text-zinc-900 hover:bg-red-500 hover:text-white"
                                                                        onClick={() =>
                                                                            setDeleteRecordConfirmationActive(
                                                                                false,
                                                                            )
                                                                        }
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                    <button
                                                                        className="flex-1 rounded-br-lg bg-white p-3 text-zinc-900 hover:bg-red-500 hover:text-white"
                                                                        onClick={() => {
                                                                            DeleteRecord(
                                                                                record,
                                                                            );
                                                                        }}
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                </div>
                                                            </DialogContent>
                                                        </DialogPortal>
                                                    </Dialog>
                                                </div>
                                            </div>
                                        )}
                                    </li>
                                );
                            })}
                            {GetSimRecordsForMission().length === 0 && (
                                <h2 className="text-center">
                                    {
                                        "No records for this mission, get to work!!"
                                    }
                                </h2>
                            )}
                        </ul>
                    </div>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}

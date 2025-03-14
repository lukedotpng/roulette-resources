"use client";

import SpinInfoSection from "./SpinInfoSection";
import MissionQueueSelection from "./MissionQueueSelection";
import MissionQueueSpinControls from "./MissionQueueSpinControls";
import RandomMissionSpinControls from "./RandomMissionSpinControls";

import { useEffect, useState } from "react";
import { useSpinManager } from "../useSpinManager";
import SpinTipsSection from "./SpinTipsSection";
import SpinOptions from "./SpinOptions";
import MissionPoolSelection from "./MissionPoolSelection";
import QueueList from "./QueueList";

export default function MainSection() {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const spinManager = useSpinManager();

    if (!isMounted) {
        return (
            <main className="flex flex-1 flex-col items-center gap-5"></main>
        );
    }

    return (
        <main className="m-3 flex flex-col items-center gap-3 text-xs sm:m-5 sm:gap-5 sm:text-base">
            <div
                data-active={spinManager.noMissionsSelectedAlertActive}
                aria-hidden={spinManager.noMissionsSelectedAlertActive}
                className="fixed -top-36 z-10 rounded-md bg-red-500 p-4 font-bold text-white shadow-xl shadow-black transition-[top] ease-in-out data-[active=true]:visible data-[active=true]:top-20"
            >
                {"Please select missions"}
            </div>
            {spinManager.queueMode ? (
                <MissionQueueSpinControls
                    GenerateNextSpin={spinManager.GenerateNextSpin}
                    GeneratePreviousSpin={spinManager.GeneratePreviousSpin}
                    RegenerateSpin={spinManager.RegenerateSpin}
                />
            ) : (
                <RandomMissionSpinControls
                    GenerateRandomSpin={spinManager.GenerateRandomSpin}
                    RegenerateSpin={spinManager.RegenerateSpin}
                />
            )}
            {spinManager.currentSpin && (
                <>
                    {spinManager.queueMode &&
                        spinManager.settings.showQueueList && (
                            <QueueList
                                queueIndex={spinManager.queueIndex}
                                UpdateQueueIndex={spinManager.UpdateQueueIndex}
                                missionQueue={spinManager.missionQueue}
                            />
                        )}
                    <SpinInfoSection
                        spin={spinManager.currentSpin}
                        HandleSpinUpdate={spinManager.HandleSpinUpdate}
                        HandleSpinEdit={spinManager.HandleSpinEdit}
                        settings={spinManager.settings}
                    />
                </>
            )}
            <div className="flex h-5 w-full flex-wrap justify-center gap-2 sm:h-8 sm:gap-4">
                <button
                    className="group flex w-24 items-center justify-center bg-white text-zinc-900 sm:w-36"
                    onClick={spinManager.ToggleQueueMode}
                    data-active={spinManager.queueMode}
                >
                    <div className="ml-1 aspect-square h-3 border-1 border-zinc-900 bg-white group-data-[active=true]:bg-red-500 sm:ml-2 sm:h-4 sm:border-2"></div>
                    <span className="flex-1 text-nowrap underline decoration-transparent decoration-2 group-hover:decoration-red-500">
                        {"Queue Mode"}
                    </span>
                </button>
                {spinManager.queueMode ? (
                    <MissionQueueSelection
                        missionQueue={spinManager.missionQueue}
                        setMissionQueue={spinManager.setMissionQueue}
                    />
                ) : (
                    <MissionPoolSelection
                        missionPool={spinManager.missionPool}
                        setMissionPool={spinManager.setMissionPool}
                    />
                )}
                <button
                    className="group flex w-20 items-center justify-center bg-white text-zinc-900 sm:w-28"
                    onClick={spinManager.settings.ToggleManualMode}
                    data-active={spinManager.settings.manualMode}
                >
                    <div className="ml-1 aspect-square h-3 border-1 border-zinc-900 bg-white group-data-[active=true]:bg-red-500 sm:ml-2 sm:h-4 sm:border-2"></div>
                    <span className="flex-1 text-nowrap underline decoration-transparent decoration-2 group-hover:decoration-red-500">
                        {"Edit Spin"}
                    </span>
                </button>
                <SpinOptions
                    settings={spinManager.settings}
                    overlayId={spinManager.overlayId}
                />
            </div>
            {spinManager.settings.showTips &&
                spinManager.currentSpin !== undefined && (
                    <SpinTipsSection
                        query={spinManager.query}
                        mission={spinManager.currentSpin.mission}
                    />
                )}
        </main>
    );
}

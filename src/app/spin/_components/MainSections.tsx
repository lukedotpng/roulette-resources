"use client";

import SpinInfoSection from "./SpinInfoSection";
import MissionQueueSelection from "./MissionQueueSelection";
import MissionQueueSpinControls from "./MissionQueueSpinControls";
import RandomMissionSpinControls from "./RandomMissionSpinControls";

import { useEffect, useState } from "react";
import RandomMissionOptions from "./RandomMissionOptions";
import { useSpinManager } from "../useSpinManager";

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
                className="absolute -top-36 rounded-md bg-red-500 p-4 font-bold text-white shadow-xl shadow-black transition-[top] ease-in-out data-[active=true]:visible data-[active=true]:top-20"
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
            <SpinInfoSection
                spin={spinManager.currentSpin}
                HandleSpinUpdate={spinManager.HandleSpinUpdate}
            />
            <div className="flex flex-wrap justify-center gap-4">
                <button
                    className="group flex w-fit items-center justify-start bg-white p-1 text-zinc-900"
                    onClick={spinManager.ToggleQueueMode}
                    data-active={spinManager.queueMode}
                >
                    <div className="mr-2 aspect-square h-4 border-2 border-zinc-900 bg-white group-data-[active=true]:bg-red-500"></div>
                    <span className="text-nowrap underline decoration-transparent decoration-2 group-hover:decoration-red-500">
                        {"Queue Mode"}
                    </span>
                </button>
                {spinManager.queueMode ? (
                    <MissionQueueSelection
                        missionQueue={spinManager.missionQueue}
                        setMissionQueue={spinManager.setMissionQueue}
                    />
                ) : (
                    <RandomMissionOptions
                        setMissionPool={spinManager.setMissionPool}
                        dontRepeatMission={spinManager.dontRepeatMission}
                        ToggleDontRepeatMission={
                            spinManager.ToggleDontRepeatMission
                        }
                    />
                )}
            </div>
        </main>
    );
}

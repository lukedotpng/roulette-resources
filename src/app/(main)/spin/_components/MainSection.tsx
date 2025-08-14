"use client";

import SpinInfoSection from "./SpinComponents/SpinInfoSection";
import MissionQueueSpinControls from "./QueueComponents/MissionQueueSpinControls";
import RandomMissionSpinControls from "./PoolComponents/RandomMissionSpinControls";

import { useEffect, useState } from "react";
import { useSpinManager } from "../useSpinManager";
import SpinTipsSection from "./SpinTipsSection";
import QueueList from "./QueueComponents/QueueList";
import MissionSwitcher from "./PoolComponents/MissionSwitcher";
import { Mission } from "@/types";
import MatchTimerSection from "./MatchComponents/MatchTimerSection";
import SpinInfoMatchPlaceholder from "./MatchComponents/SpinInfoMatchPlaceholder";
import SimpleQueueList from "./QueueComponents/SimpleQueueList";
import SpinToolbar from "./OptionsComponents/SpinToolbar";

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

    const SpinControls = () => {
        switch (spinManager.spinMode) {
            case "pool":
                return (
                    <RandomMissionSpinControls
                        NewSpin={spinManager.NewSpin}
                        Respin={spinManager.Respin}
                    />
                );
            case "queue":
                return (
                    <MissionQueueSpinControls
                        GenerateNextSpin={spinManager.NextSpin}
                        GeneratePreviousSpin={spinManager.PreviousSpin}
                        Respin={spinManager.Respin}
                    />
                );
            case "seeded_queue":
                return null;
        }
    };

    const MissionSwitchControls = () => {
        if (spinManager.currentSpin === null) {
            return null;
        }
        switch (spinManager.spinMode) {
            case "pool":
                return (
                    <MissionSwitcher
                        currentMission={spinManager.currentSpin.mission}
                        HandleMissionSwitch={(mission: Mission) =>
                            spinManager.NewSpin(mission)
                        }
                    />
                );
            case "queue":
                if (spinManager.options.showQueueList) {
                    return (
                        <SimpleQueueList
                            queueIndex={spinManager.queueIndex}
                            UpdateQueueIndex={spinManager.SetQueueIndex}
                            missionQueue={spinManager.missionQueue}
                        />
                    );
                } else {
                    return (
                        <QueueList
                            queueIndex={spinManager.queueIndex}
                            UpdateQueueIndex={spinManager.SetQueueIndex}
                            missionQueue={spinManager.missionQueue}
                        />
                    );
                }
        }
    };

    return (
        <main className="m-3 flex flex-col items-center gap-2 text-xs sm:m-5 sm:gap-3 sm:text-base">
            <SpinControls />
            <MissionSwitchControls />

            {spinManager.currentSpin && (
                <>
                    {spinManager.matchModeManager.enabled && (
                        <MatchTimerSection spinManager={spinManager} />
                    )}
                    {spinManager.matchModeManager.enabled &&
                    !spinManager.matchModeManager.matchActive ? (
                        <SpinInfoMatchPlaceholder
                            mission={spinManager.currentSpin.mission}
                            layoutMode={spinManager.options.spinTheme.value}
                        />
                    ) : (
                        <SpinInfoSection spinManager={spinManager} />
                    )}
                </>
            )}

            <SpinToolbar spinManager={spinManager} />

            {spinManager.options.showTips.value && spinManager.currentSpin && (
                <SpinTipsSection
                    query={spinManager.spinQuery}
                    mission={spinManager.currentSpin.mission}
                    matchModeManager={spinManager.matchModeManager}
                />
            )}

            <div
                data-active={spinManager.noMissionsSelectedAlertActive}
                aria-hidden={spinManager.noMissionsSelectedAlertActive}
                className="fixed -top-36 z-10 rounded-md bg-red-500 p-4 font-bold text-white shadow-xl shadow-black transition-[top] ease-in-out data-[active=true]:visible data-[active=true]:top-20"
            >
                {"Please select missions"}
            </div>
        </main>
    );
}

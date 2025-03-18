"use client";

import SpinInfoSection from "./SpinInfoSection";
import MissionQueueSpinControls from "./MissionQueueSpinControls";
import RandomMissionSpinControls from "./RandomMissionSpinControls";

import { useEffect, useState } from "react";
import { useSpinManager } from "../useSpinManager";
import SpinTipsSection from "./SpinTipsSection";
import QueueList from "./QueueList";
import MissionSwitcher from "./MissionSwitcher";
import { Mission } from "@/types";
import SpinOptionsSection from "./SpinOptionsSection";

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
        <main className="m-3 flex flex-col items-center gap-2 text-xs sm:m-5 sm:gap-3 sm:text-base">
            {spinManager.options.queueMode.val ? (
                <MissionQueueSpinControls
                    GenerateNextSpin={spinManager.GenerateNextSpin}
                    GeneratePreviousSpin={spinManager.GeneratePreviousSpin}
                    Respin={spinManager.Respin}
                />
            ) : (
                <RandomMissionSpinControls
                    NewSpin={spinManager.NewSpin}
                    Respin={spinManager.Respin}
                />
            )}
            {spinManager.currentSpin && (
                <>
                    {!spinManager.options.queueMode.val && (
                        <MissionSwitcher
                            currentMission={spinManager.currentSpin.mission}
                            HandleMissionSwitch={(mission: Mission) =>
                                spinManager.NewSpin(mission)
                            }
                        />
                    )}
                    {spinManager.options.queueMode.val &&
                        spinManager.options.showQueueList.val && (
                            <QueueList
                                queueIndex={spinManager.queueIndex}
                                UpdateQueueIndex={spinManager.UpdateQueueIndex}
                                missionQueue={
                                    spinManager.options.missionQueue.val
                                }
                            />
                        )}
                    <SpinInfoSection
                        spin={spinManager.currentSpin}
                        spinLegal={spinManager.spinLegal}
                        RespinCondition={spinManager.RespinCondition}
                        EditSpin={spinManager.EditSpin}
                        options={spinManager.options}
                    />
                </>
            )}

            <SpinOptionsSection
                options={spinManager.options}
                overlayId={spinManager.overlayId}
                RegenerateOverlayId={spinManager.RegenerateOverlayId}
            />

            {spinManager.options.showTips.val &&
                spinManager.currentSpin !== undefined && (
                    <SpinTipsSection
                        query={spinManager.query}
                        mission={spinManager.currentSpin.mission}
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

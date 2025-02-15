"use client";

import { Missions } from "@/globals";
import { Mission, MissionSpin } from "@/types";
import { GenerateMissionSpin } from "../SpinManager";
import SpinInfoSection from "./SpinInfoSection";
import MissionQueueSelection from "./MissionQueueSelection";
import MissionQueueSpinControls from "./MissionQueueSpinControls";
import RandomMissionSpinControls from "./RandomMissionSpinControls";
import {
    GetSpinFromQuery,
    GetRandomMission,
    CreateSpinQuery,
} from "../SpinUtils";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import RandomMissionOptions from "./RandomMissionOptions";

export default function MainSection() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [isMounted, setIsMounted] = useState(false);

    // Options
    const [missionPool, setMissionPool] = useState<Mission[]>(Missions);
    const [queueMode, setQueueMode] = useState(false);
    const [missionQueue, setMissionQueue] = useState<Mission[]>([]);
    const [queueIndex, setQueueIndex] = useState(0);
    const [noRepeatForXSpins, setNoRepeatForXSpins] = useState(0);
    const [pastSpins, setPastSpins] = useState<Mission[]>([]);

    const [noMissionsSelectedAlertActive, setNoMissionsSelectedAlertActive] =
        useState(false);

    const [missionSpin, setMissionSpin] = useState<MissionSpin>(
        GetSpinFromQuery(searchParams.get("s") ?? "", missionPool),
    );

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        setMissionSpin(
            GetSpinFromQuery(searchParams.get("s") ?? "", missionPool),
        );
        console.log("Spin query loaded");
    }, [searchParams, missionPool]);

    useEffect(() => {
        const spinQuery = CreateSpinQuery(missionSpin);

        const params = new URLSearchParams(searchParams.toString());
        params.set("s", spinQuery);
        router.push(`/spin?${params.toString()}`);
    }, [missionSpin]);

    useEffect(() => {
        if (pastSpins.length > noRepeatForXSpins) {
            setPastSpins([]);
        }
    }, [noRepeatForXSpins, pastSpins]);

    function GenerateRandomSpin() {
        if (missionPool.length === 0) {
            setNoMissionsSelectedAlertActive(true);

            if (!noMissionsSelectedAlertActive) {
                setTimeout(() => {
                    setNoMissionsSelectedAlertActive(false);
                }, 1500);
            }
            return;
        }

        let randomMission = GetRandomMission(missionPool);
        while (pastSpins.includes(randomMission)) {
            randomMission = GetRandomMission(missionPool);
        }

        const missionSpin: MissionSpin = GenerateMissionSpin(randomMission);
        const updatedPastSpins = [...pastSpins];
        updatedPastSpins.push(randomMission);
        if (
            updatedPastSpins.length >
            Math.min(noRepeatForXSpins, missionPool.length - 1)
        ) {
            updatedPastSpins.shift();
        }
        setPastSpins(updatedPastSpins);
        console.log(updatedPastSpins);

        setMissionSpin(missionSpin);
    }

    function ToggleQueueMode() {
        const updatedQueueMode = !queueMode;
        setQueueMode(updatedQueueMode);

        if (updatedQueueMode) {
            if (missionQueue.length === 0) {
                setMissionQueue(["paris"]);
                setQueueIndex(0);
                setMissionSpin(GenerateMissionSpin("paris"));
            } else {
                setMissionSpin(GenerateMissionSpin(missionQueue[0]));
            }
        }
    }
    function RegenerateSpin() {
        const newSpin = GenerateMissionSpin(missionSpin.mission);
        setMissionSpin(newSpin);
    }
    function GenerateNextSpin() {
        const nextIndex = queueIndex + 1;
        if (nextIndex === missionQueue.length) {
            return;
        }
        setQueueIndex(nextIndex);
        setMissionSpin(GenerateMissionSpin(missionQueue[nextIndex]));
    }
    function GeneratePreviousSpin() {
        const prevIndex = queueIndex - 1;
        if (prevIndex < 0) {
            return;
        }
        setQueueIndex(prevIndex);
        setMissionSpin(GenerateMissionSpin(missionQueue[prevIndex]));
    }

    if (!isMounted) {
        return (
            <main className="flex flex-1 flex-col items-center gap-5 bg-zinc-800"></main>
        );
    }

    return (
        <main className="flex flex-1 flex-col items-center gap-3 bg-zinc-800 p-2 pt-3 text-xs sm:gap-5 sm:p-5 sm:pt-5 sm:text-base">
            <div
                data-active={noMissionsSelectedAlertActive}
                aria-hidden={noMissionsSelectedAlertActive}
                className="absolute -top-36 rounded-md bg-red-500 p-4 font-bold text-white shadow-xl shadow-black transition-[top] ease-in-out data-[active=true]:visible data-[active=true]:top-20"
            >
                {"Please select missions"}
            </div>
            {queueMode ? (
                <MissionQueueSpinControls
                    GenerateNextSpin={GenerateNextSpin}
                    GeneratePreviousSpin={GeneratePreviousSpin}
                    RegenerateSpin={RegenerateSpin}
                />
            ) : (
                <RandomMissionSpinControls
                    GenerateRandomSpin={GenerateRandomSpin}
                />
            )}
            <SpinInfoSection missionSpin={missionSpin} />
            <div className="flex flex-wrap justify-center gap-4">
                <button
                    className="group flex w-fit items-center justify-start bg-white p-1 text-zinc-900"
                    onClick={ToggleQueueMode}
                    data-active={queueMode}
                >
                    <div className="mr-2 aspect-square h-4 border-2 border-zinc-900 bg-white group-data-[active=true]:bg-red-500"></div>
                    <span className="text-nowrap underline decoration-transparent decoration-2 group-hover:decoration-red-500">
                        {"Queue Mode"}
                    </span>
                </button>
                {queueMode ? (
                    <MissionQueueSelection
                        missionQueue={missionQueue}
                        setMissionQueue={setMissionQueue}
                    />
                ) : (
                    <RandomMissionOptions
                        setMissionPool={setMissionPool}
                        noRepeatForXSpins={noRepeatForXSpins}
                        setNoRepeatForXSpins={setNoRepeatForXSpins}
                    />
                )}
            </div>
        </main>
    );
}

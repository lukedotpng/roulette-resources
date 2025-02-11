"use client";

import { Missions } from "@/globals";
import { Mission, Spin } from "@/types";
import { GenerateSpinForMission } from "../SpinManager";
import SpinInfoSection from "./SpinInfoSection";
import { useEffect, useState } from "react";
import MissionPoolSelection from "./MissionPoolSelection";

export default function MainSection() {
    const [isMounted, setIsMounted] = useState(false);

    const [mission, setMission] = useState<Mission>(
        Missions[Math.floor(Math.random() * Missions.length)],
    );
    const [spin, setSpin] = useState<Spin>(GenerateSpinForMission(mission));

    // Options
    const [missionPool, setMissionPool] = useState<Mission[]>(Missions);
    // const [missionQueue, setMissionQueue] = useState<Mission[]>(Missions);
    // const [noRepeatForXSpins, setNoRepeatForXSpins] = useState<number>(0);

    const [noMissionsSelectedAlertActive, setNoMissionsSelectedAlertActive] =
        useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, [isMounted]);

    if (!isMounted) {
        return (
            <main className="flex flex-1 flex-col items-center gap-5 bg-zinc-900"></main>
        );
    }

    return (
        <main className="flex flex-1 flex-col items-center gap-5 bg-zinc-900 p-5">
            <div
                data-active={noMissionsSelectedAlertActive}
                aria-hidden={noMissionsSelectedAlertActive}
                className="absolute -top-36 rounded-md bg-red-500 p-4 font-bold text-white transition-[top] ease-in-out data-[active=true]:visible data-[active=true]:top-20"
            >
                {"Please select missions"}
            </div>

            <button
                className="h-10 w-40 bg-white font-bold text-zinc-900 hover:bg-red-500 hover:text-white"
                onClick={() => {
                    if (missionPool.length === 0) {
                        setNoMissionsSelectedAlertActive(true);

                        setTimeout(() => {
                            setNoMissionsSelectedAlertActive(false);
                        }, 1500);
                        return;
                    }
                    const randomMission = GetRandomMission(missionPool);
                    const spin: Spin = GenerateSpinForMission(randomMission);

                    setMission(randomMission);
                    setSpin(spin);
                }}
            >
                Spin
            </button>
            <SpinInfoSection spin={spin} mission={mission} />
            <MissionPoolSelection setMissionPool={setMissionPool} />
        </main>
    );
}

function GetRandomMission(missionPool: Mission[]): Mission {
    const randomMission =
        missionPool[Math.floor(Math.random() * missionPool.length)];

    return randomMission;
}

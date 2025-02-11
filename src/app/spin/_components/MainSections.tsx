"use client";

import { Missions } from "@/globals";
import { Mission, Spin } from "@/types";
import { GenerateSpinForMission } from "../SpinManager";
import SpinInfoSection from "./SpinInfoSection";
import { useEffect, useState } from "react";

export default function MainSection() {
    const [isMounted, setIsMounted] = useState(false);

    const [mission, setMission] = useState<Mission>(
        Missions[Math.floor(Math.random() * Missions.length)],
    );
    const [spin, setSpin] = useState<Spin>(GenerateSpinForMission(mission));

    // Options
    const [missionPool] = useState<Mission[]>(Missions);
    // const [missionQueue, setMissionQueue] = useState<Mission[]>(Missions);
    // const [noRepeatForXSpins, setNoRepeatForXSpins] = useState<number>(0);

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
            <button
                className="h-10 w-40 bg-white font-bold text-zinc-900 hover:bg-red-500 hover:text-white"
                onClick={() => {
                    const randomMission = GetRandomMission(missionPool);
                    const spin: Spin = GenerateSpinForMission(randomMission);

                    setMission(randomMission);
                    setSpin(spin);
                }}
            >
                Spin
            </button>
            <SpinInfoSection spin={spin} mission={mission} />
            <div className="flex-1"></div>
        </main>
    );
}

function GetRandomMission(missionPool: Mission[]): Mission {
    const randomMission =
        missionPool[Math.floor(Math.random() * missionPool.length)];

    return randomMission;
}

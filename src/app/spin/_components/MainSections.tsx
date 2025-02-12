"use client";

import { Missions } from "@/globals";
import { Mission, MissionSpin, Spin } from "@/types";
import { GenerateMissionSpin } from "../SpinManager";
import SpinInfoSection from "./SpinInfoSection";
import { useEffect, useState } from "react";
import MissionPoolSelection from "./MissionPoolSelection";
import {
    KillMethodOptions,
    MissionDisguisesList,
    SpinMissionTargetsList,
} from "../SpinGlobals";

import { useRouter, useSearchParams } from "next/navigation";

export default function MainSection() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [isMounted, setIsMounted] = useState(false);

    // Options
    const [missionPool, setMissionPool] = useState<Mission[]>(Missions);
    // const [queueMode, setQueueMode] = useState(false);
    // const [missionQueue, setMissionQueue] = useState<Mission[]>(Missions);
    // const [noRepeatForXSpins, setNoRepeatForXSpins] = useState<number>(0);

    const [noMissionsSelectedAlertActive, setNoMissionsSelectedAlertActive] =
        useState(false);

    const [missionSpin, setMissionSpin] = useState<MissionSpin>(
        GetInitialSpin(searchParams.get("s") ?? "", missionPool),
    );

    useEffect(() => {
        setIsMounted(true);
    }, [isMounted]);

    if (!isMounted) {
        return (
            <main className="flex flex-1 flex-col items-center gap-5 bg-zinc-800"></main>
        );
    }

    return (
        <main className="flex flex-1 flex-col items-center gap-5 bg-zinc-800 p-5">
            <div
                data-active={noMissionsSelectedAlertActive}
                aria-hidden={noMissionsSelectedAlertActive}
                className="absolute -top-36 rounded-md bg-red-500 p-4 font-bold text-white shadow-xl shadow-black transition-[top] ease-in-out data-[active=true]:visible data-[active=true]:top-20"
            >
                {"Please select missions"}
            </div>

            <button
                className="h-10 w-40 bg-white font-bold text-zinc-900 hover:bg-red-500 hover:text-white"
                onClick={() => {
                    if (missionPool.length === 0) {
                        setNoMissionsSelectedAlertActive(true);

                        if (!noMissionsSelectedAlertActive) {
                            setTimeout(() => {
                                setNoMissionsSelectedAlertActive(false);
                            }, 1500);
                        }
                        return;
                    }

                    const randomMission = GetRandomMission(missionPool);
                    const missionSpin: MissionSpin =
                        GenerateMissionSpin(randomMission);

                    setMissionSpin(missionSpin);

                    const spinQuery = CreateSpinQuery(missionSpin);

                    const params = new URLSearchParams(searchParams.toString());
                    params.set("s", spinQuery);
                    router.push(`/spin?${params.toString()}`);
                }}
            >
                Spin
            </button>
            <SpinInfoSection missionSpin={missionSpin} />
            <div className="flex gap-4">
                {/* <button
                    className="group flex items-center justify-start bg-white p-1 pr-2 text-zinc-900"
                    onClick={() => setQueueMode(!queueMode)}
                >
                    <div
                        data-active={queueMode}
                        className="mr-2 h-8 w-8 border-4 border-zinc-900 bg-white data-[active=true]:bg-red-500"
                    ></div>
                    <span>{"Toggle Queue"}</span>
                </button> */}
                <MissionPoolSelection setMissionPool={setMissionPool} />
            </div>
        </main>
    );
}

function GetRandomMission(missionPool: Mission[]): Mission {
    if (!missionPool || missionPool.length === 0) {
        console.log("ERROR:", "Mission pool is empty");
        return Missions[Math.floor(Math.random() * Missions.length)];
    }

    const randomMission =
        missionPool[Math.floor(Math.random() * missionPool.length)];

    return randomMission;
}

function GetInitialSpin(query: string, missionPool: Mission[]): MissionSpin {
    if (!query) {
        return GenerateMissionSpin(GetRandomMission(missionPool));
    }
    const parsedSpin = ParseSpinQuery(query);
    if (!parsedSpin) {
        return GenerateMissionSpin(GetRandomMission(missionPool));
    }

    return parsedSpin;
}

function CreateSpinQuery(missionSpin: MissionSpin) {
    let spinQuery = "";

    const missionIndex = GetMissionIndex(missionSpin.mission);
    const spinTargets = SpinMissionTargetsList[missionSpin.mission];

    spinQuery += `m${missionIndex}-`;

    spinTargets.forEach((target, index) => {
        const targetSpin = missionSpin.spin[target];
        const conditionIndex = GetConditionIndex(targetSpin?.condition ?? "");
        const disguiseIndex = GetMissionDisguiseIndex(
            targetSpin?.disguise ?? "",
            missionSpin.mission,
        );

        spinQuery += `t${index}c${conditionIndex}d${disguiseIndex}`;
        const ntko = targetSpin?.ntko ?? false;
        spinQuery += ntko ? "k1" : "k0";
    });

    return spinQuery;
}

function ParseSpinQuery(spinQuery: string): MissionSpin | null {
    const spin = {} as Spin;

    const missionIndexRegex = /(?!m)\d+/;
    const missionIndexMatch = spinQuery.match(missionIndexRegex);
    if (!missionIndexMatch) {
        console.error("No mission index found in spin query");
        return null;
    }
    const missionIndex = parseInt(missionIndexMatch[0]);
    const mission = GetMissionFromIndex(missionIndex);

    const spinTargets = SpinMissionTargetsList[mission];
    spinTargets.forEach((target, index) => {
        const conditionIndexRegex = new RegExp(`t${index}c(\\d+)`);
        const conditionMatch = spinQuery.match(conditionIndexRegex);
        if (!conditionMatch || conditionMatch.length < 2) {
            console.error(`No match found for target condition: ${target}`);
            return null;
        }
        const conditionIndex = parseInt(conditionMatch[1]);
        const condition = GetConditionFromIndex(conditionIndex);

        const disguiseIndexRegex = new RegExp(
            `t${index}c${conditionIndex}d(\\d+)`,
        );
        const disguiseMatch = spinQuery.match(disguiseIndexRegex);
        if (!disguiseMatch || disguiseMatch.length < 2) {
            console.error(`No match found for target disguise: ${target}`);
            return null;
        }
        const disguiseIndex = parseInt(disguiseMatch[1]);
        const disguise = GetMissionDisguiseFromIndex(disguiseIndex, mission);

        const ntkoIndexRegex = new RegExp(
            `t${index}c${conditionIndex}d${disguiseIndex}k(\\d+)`,
        );
        const ntkoMatch = spinQuery.match(ntkoIndexRegex);
        if (!ntkoMatch || ntkoMatch.length < 2) {
            console.error(`No match found for target ntko: ${target}`);
            return null;
        }
        const ntkoIndex = parseInt(ntkoMatch[1]);
        const ntko = ntkoIndex === 1;

        spin[target] = {
            condition: condition,
            disguise: disguise,
            ntko: ntko,
        };
    });

    return { mission: mission, spin: spin };
}

function GetMissionIndex(mission: Mission): number {
    return Missions.indexOf(mission);
}
function GetMissionFromIndex(index: number): Mission {
    return Missions[index];
}

function GetConditionIndex(condition: string): number {
    return KillMethodOptions.indexOf(condition);
}
function GetConditionFromIndex(index: number): string {
    return KillMethodOptions[index];
}

function GetMissionDisguiseIndex(disguise: string, mission: Mission): number {
    const disguiseList = MissionDisguisesList[mission];

    return disguiseList.indexOf(disguise);
}
function GetMissionDisguiseFromIndex(index: number, mission: Mission): string {
    const disguiseList = MissionDisguisesList[mission];

    return disguiseList[index];
}

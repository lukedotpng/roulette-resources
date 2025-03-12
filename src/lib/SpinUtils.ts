import { Missions } from "@/lib/globals";
import { Mission } from "@/types";
import {
    KillMethodOptions,
    MissionDisguisesList,
} from "../app/(main)/spin/SpinGlobals";

export function GetRandomMission(missionPool: Mission[]): Mission {
    if (!missionPool || missionPool.length === 0) {
        console.error("ERROR:", "Mission pool is empty");
        return Missions[Math.floor(Math.random() * Missions.length)];
    }

    const randomMission =
        missionPool[Math.floor(Math.random() * missionPool.length)];

    return randomMission;
}

export function GetMissionIndex(mission: Mission): number {
    return Missions.indexOf(mission);
}
export function GetMissionFromIndex(index: number): Mission {
    return Missions[index];
}

export function GetConditionIndex(condition: string): number {
    return KillMethodOptions.indexOf(condition);
}
export function GetConditionFromIndex(index: number): string {
    return KillMethodOptions[index];
}

export function GetMissionDisguiseIndex(
    disguise: string,
    mission: Mission,
): number {
    const disguiseList = MissionDisguisesList[mission];

    return disguiseList.indexOf(disguise);
}
export function GetMissionDisguiseFromIndex(
    index: number,
    mission: Mission,
): string {
    const disguiseList = MissionDisguisesList[mission];

    return disguiseList[index];
}

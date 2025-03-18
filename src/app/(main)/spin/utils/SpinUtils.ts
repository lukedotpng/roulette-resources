import { Mission } from "@/types";
import { Missions } from "@/utils/globals";

export function GetRandomMission(missionPool: Mission[]): Mission {
    if (!missionPool || missionPool.length === 0) {
        console.error("ERROR:", "Mission pool is empty");
        return Missions[Math.floor(Math.random() * Missions.length)];
    }

    const randomMission =
        missionPool[Math.floor(Math.random() * missionPool.length)];

    return randomMission;
}

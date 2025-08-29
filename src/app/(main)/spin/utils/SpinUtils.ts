import { Mission } from "@/types";
import { MISSIONS } from "@/utils/globals";

export function GetRandomMission(missionPool: Mission[]): Mission {
    if (!missionPool || missionPool.length === 0) {
        console.error("ERROR:", "Mission pool is empty");
        return MISSIONS[Math.floor(Math.random() * MISSIONS.length)];
    }

    const randomMission =
        missionPool[Math.floor(Math.random() * missionPool.length)];

    return randomMission;
}

export function GenerateRandomSeed(length?: number) {
    const charOptions =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const newQueueSeedLength = length ?? 20;
    let newQueueSeed = "";

    for (let i = 0; i < newQueueSeedLength; i++) {
        const randIndex = Math.floor(Math.random() * charOptions.length);
        newQueueSeed += charOptions[randIndex];
    }

    return newQueueSeed;
}

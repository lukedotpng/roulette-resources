import { Missions } from "@/globals";
import { Mission, SpinTarget } from "@/types";
import {
    KillMethodOptions,
    MissionDisguisesList,
} from "../app/spin/SpinGlobals";

export function GetRandomMission(missionPool: Mission[]): Mission {
    if (!missionPool || missionPool.length === 0) {
        console.log("ERROR:", "Mission pool is empty");
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

export function MapIDToDisplayText(map: string) {
    let mapDisplayText = "";
    const words = map.split("_");

    for (const word of words) {
        let parsedWord = word.charAt(0).toUpperCase() + word.slice(1) + " ";
        if (parsedWord == "Of ") {
            parsedWord = parsedWord.toLowerCase();
        }
        mapDisplayText += parsedWord;
    }

    return mapDisplayText;
}

export function ItemIDToDisplayText(item: string | undefined) {
    if (!item) {
        return "Err No Condition";
    }
    let itemDisplayText = "";
    // disguise ID example: paris-palace_staff
    const words = item.split("_"); // ["palace", "staff"]

    for (let word of words) {
        if (word.toLowerCase() === "smg") {
            word = "SMG";
        }
        itemDisplayText += word.charAt(0).toUpperCase() + word.slice(1) + " ";
    }

    return itemDisplayText.trim();
}

export function DisguiseIDToDisplayText(disguise: string | undefined) {
    if (!disguise) {
        return "Err No Disguise";
    }
    let disguiseDisplayText = "";
    const words = disguise.split("_"); // ["palace", "staff"]

    for (const word of words) {
        if (word.toLowerCase() === "dj") {
            disguiseDisplayText += "DJ";
        } else {
            disguiseDisplayText +=
                word.charAt(0).toUpperCase() + word.slice(1) + " ";
        }
    }

    return disguiseDisplayText.trim();
}

export function TargetIDToDisplayText(target: string) {
    let targetDisplayText = "";
    const words = target.split("_");

    for (let word of words) {
        if (word.toLowerCase() === "ica") {
            word = "ICA";
        }
        targetDisplayText += word.charAt(0).toUpperCase() + word.slice(1) + " ";
    }

    return targetDisplayText;
}

export function TargetImagePathFormatter(target: string) {
    if (target.startsWith("ica_agent")) {
        target = "ica_agent";
    }
    return "/targets/" + target + ".webp";
}

export function MethodImagePathFormatter(
    method: string | undefined,
    target: SpinTarget,
) {
    if (!method) {
        return "";
    }

    if (target === "erich_soders" && method === "electrocution") {
        return "/killmethods/" + "soders_electrocution" + ".webp";
    }

    if (method.startsWith("loud_")) {
        method = method.split("loud_")[1];
    } else if (method.startsWith("silenced_")) {
        method = method.split("silenced_")[1];
    }

    return "/killmethods/" + method + ".webp";
}

import { Missions } from "@/globals";
import { Mission, MissionSpin, Spin } from "@/types";
import {
    SpinMissionTargetsList,
    KillMethodOptions,
    MissionDisguisesList,
} from "./SpinGlobals";
import { GenerateMissionSpin } from "./SpinManager";

export function GetRandomMission(missionPool: Mission[]): Mission {
    if (!missionPool || missionPool.length === 0) {
        console.log("ERROR:", "Mission pool is empty");
        return Missions[Math.floor(Math.random() * Missions.length)];
    }

    const randomMission =
        missionPool[Math.floor(Math.random() * missionPool.length)];

    return randomMission;
}

export function GetSpinFromQuery(
    query: string,
    missionPool: Mission[],
): MissionSpin {
    if (!query) {
        return GenerateMissionSpin(GetRandomMission(missionPool));
    }
    const parsedSpin = ParseSpinQuery(query);
    if (!parsedSpin) {
        return GenerateMissionSpin(GetRandomMission(missionPool));
    }

    return parsedSpin;
}

export function CreateSpinQuery(missionSpin: MissionSpin) {
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

export function ParseSpinQuery(spinQuery: string): MissionSpin | null {
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

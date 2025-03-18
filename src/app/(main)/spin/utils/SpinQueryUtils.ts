import {
    KillMethodOptions,
    MissionDisguisesList,
    SpinMissionTargetsList,
} from "./SpinGlobals";
import { GenerateSpin } from "./SpinGenerationUtils";
import { Mission, Spin, SpinInfo } from "@/types";
import { GetRandomMission } from "./SpinUtils";
import { Missions } from "@/utils/globals";

export function GetSpinFromQuery(
    query: string,
    generateSpinOnError: boolean,
    missionPool?: Mission[],
): Spin | undefined {
    if (!query) {
        if (!generateSpinOnError) {
            return undefined;
        }
        return GenerateSpin(GetRandomMission(missionPool || Missions));
    }
    const parsedSpin = ParseSpinQuery(query);
    if (!parsedSpin) {
        if (!generateSpinOnError) {
            return undefined;
        }
        return GenerateSpin(GetRandomMission(missionPool || Missions));
    }

    return parsedSpin;
}

export function ValidateSpinQuery(query: string): boolean {
    const missionSpin = ParseSpinQuery(query);

    if (missionSpin === null) {
        return false;
    }
    return true;
}

export function CreateSpinQuery(spin: Spin) {
    let spinQuery = "";

    const missionIndex = GetMissionIndex(spin.mission);
    const spinTargets = SpinMissionTargetsList[spin.mission];

    spinQuery += `m${missionIndex}`;

    spinTargets.forEach((target, index) => {
        const targetSpin = spin.info[target];
        const conditionIndex = GetConditionIndex(targetSpin?.condition ?? "");
        const disguiseIndex = GetMissionDisguiseIndex(
            targetSpin?.disguise ?? "",
            spin.mission,
        );

        spinQuery += `t${index}c${conditionIndex}d${disguiseIndex}`;
        const ntko = targetSpin?.ntko ?? false;
        spinQuery += ntko ? "k1" : "k0";
    });

    return spinQuery;
}

export function ParseSpinQuery(spinQuery: string): Spin | null {
    const spinInfo = {} as SpinInfo;

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

        spinInfo[target] = {
            condition: condition,
            disguise: disguise,
            ntko: ntko,
        };
    });

    return { mission: mission, info: spinInfo };
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

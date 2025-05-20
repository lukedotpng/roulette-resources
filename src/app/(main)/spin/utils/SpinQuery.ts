import {
    KillMethodOptions,
    MissionDisguisesList,
    SpinInfoIdMap,
    SpinMissionTargetsList,
} from "./SpinGlobals";
import { GenerateSpin } from "./SpinGeneration";
import { Mission, Spin, SpinInfo } from "@/types";
import { GetRandomMission } from "./SpinUtils";
import { MISSIONS } from "@/utils/globals";

export function CreateSpinQuery(spin: Spin) {
    let spinQuery = "";

    const missionId = SpinInfoIdMap[spin.mission];
    const spinTargets = SpinMissionTargetsList[spin.mission];

    spinQuery += missionId;

    spinTargets.forEach((target) => {
        const targetSpin = spin.info[target];
        if (!targetSpin) {
            return "err";
        }

        let conditionId = SpinInfoIdMap[targetSpin.killMethod];
        let disguiseId = SpinInfoIdMap[targetSpin.disguise];

        if (!conditionId) {
            conditionId = "b0"; // b0 => "Any"
        }
        if (!disguiseId) {
            disguiseId = "b0"; // b0 => "Any"
        }

        spinQuery += `${conditionId}${disguiseId}`;
        const ntko = targetSpin?.ntko ?? false;
        spinQuery += ntko ? "1" : "0";
    });

    return spinQuery;
}

export function ParseSpinQuery(spinQuery: string): Spin | null {
    const spinInfo = {} as SpinInfo;

    if (spinQuery.length === 0) {
        return null;
    }

    // If it is an old spin query, use the old parser
    if (spinQuery[0] === "m") {
        return OldParseSpinQuery(spinQuery);
    }

    const missionId = spinQuery.slice(0, 2);
    const mission = SpinInfoIdMap[missionId] as Mission;

    if (!mission) {
        return null;
    }

    const spinTargets = SpinMissionTargetsList[mission];
    if (!spinTargets) {
        return null;
    }

    for (let i = 0; i < spinTargets.length; i++) {
        const target = spinTargets[i];

        const targetInfoIndexStart = 2 + i * 5;
        const conditionId = spinQuery.slice(
            targetInfoIndexStart,
            targetInfoIndexStart + 2,
        );

        const condition = SpinInfoIdMap[conditionId];
        if (!condition) {
            return null;
        }

        const disguiseId = spinQuery.slice(
            targetInfoIndexStart + 2,
            targetInfoIndexStart + 4,
        );
        const disguise = SpinInfoIdMap[disguiseId];
        if (!disguise) {
            return null;
        }

        const ntkoId = spinQuery.slice(
            targetInfoIndexStart + 4,
            targetInfoIndexStart + 5,
        );
        const ntko = ntkoId === "1";

        spinInfo[target] = {
            killMethod: condition,
            disguise: disguise,
            ntko: ntko,
        };
    }

    return { mission: mission, info: spinInfo };
}

export function GetSpinFromQuery(
    query: string,
    generateSpinOnError: boolean,
    missionPool?: Mission[],
): Spin | null {
    if (!query) {
        if (!generateSpinOnError) {
            return null;
        }
        return GenerateSpin(GetRandomMission(missionPool || [...MISSIONS]));
    }
    const parsedSpin = ParseSpinQuery(query);
    if (!parsedSpin) {
        if (!generateSpinOnError) {
            return null;
        }
        return GenerateSpin(GetRandomMission(missionPool || [...MISSIONS]));
    }

    return parsedSpin;
}

export function OldCreateSpinQuery(spin: Spin) {
    let spinQuery = "";

    const missionIndex = GetMissionIndex(spin.mission);
    const spinTargets = SpinMissionTargetsList[spin.mission];

    spinQuery += `m${missionIndex}`;

    spinTargets.forEach((target, index) => {
        const targetSpin = spin.info[target];
        const conditionIndex = GetConditionIndex(targetSpin?.killMethod ?? "");
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

export function OldParseSpinQuery(spinQuery: string): Spin | null {
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
    if (!spinTargets) {
        return null;
    }

    for (let i = 0; i < spinTargets.length; i++) {
        const target = spinTargets[i];

        const conditionIndexRegex = new RegExp(`t${i}c(\\d+)`);
        const conditionMatch = spinQuery.match(conditionIndexRegex);
        if (!conditionMatch || conditionMatch.length < 2) {
            console.error(`No match found for target condition: ${target}`);
            return null;
        }
        const conditionIndex = parseInt(conditionMatch[1]);
        const condition = GetConditionFromIndex(conditionIndex);

        const disguiseIndexRegex = new RegExp(`t${i}c${conditionIndex}d(\\d+)`);
        const disguiseMatch = spinQuery.match(disguiseIndexRegex);
        if (!disguiseMatch || disguiseMatch.length < 2) {
            console.error(`No match found for target disguise: ${target}`);
            return null;
        }
        const disguiseIndex = parseInt(disguiseMatch[1]);
        const disguise = GetMissionDisguiseFromIndex(disguiseIndex, mission);

        const ntkoIndexRegex = new RegExp(
            `t${i}c${conditionIndex}d${disguiseIndex}k(\\d+)`,
        );
        const ntkoMatch = spinQuery.match(ntkoIndexRegex);
        if (!ntkoMatch || ntkoMatch.length < 2) {
            console.error(`No match found for target ntko: ${target}`);
            return null;
        }
        const ntkoIndex = parseInt(ntkoMatch[1]);
        const ntko = ntkoIndex === 1;

        if (!condition || !disguise) {
            return null;
        }

        spinInfo[target] = {
            killMethod: condition,
            disguise: disguise,
            ntko: ntko,
        };
    }

    return { mission: mission, info: spinInfo };
}

function GetMissionIndex(mission: Mission): number {
    return MISSIONS.indexOf(mission);
}
function GetMissionFromIndex(index: number): Mission {
    return MISSIONS[index];
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

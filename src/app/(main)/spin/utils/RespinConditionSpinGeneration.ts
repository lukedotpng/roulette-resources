import {
    ConditionType,
    Mission,
    Spin,
    SpinInfo,
    SpinTarget,
    TargetConditions,
} from "@/types";
import {
    SpinMissionTargetsList,
    MissionSpinInfoList,
    TargetUniqueKillsList,
    weapons,
    weaponModifierPrefix,
    explosiveModifierPrefix,
} from "./SpinGlobals";
import { CanBeNTKO, SpinIsLegal } from "./SpinCheckUtils";

export function GenerateSpin(mission: Mission): Spin {
    const targets = SpinMissionTargetsList[mission];
    const spinInfoOptions = MissionSpinInfoList[mission];

    const spinInfo: SpinInfo = {};

    const reorderedTargets: SpinTarget[] = [];
    const indexList: number[] = [];

    for (let i = 0; i < targets.length; i++) {
        let randomIndex = 0;
        do {
            randomIndex = Math.floor(Math.random() * targets.length);
        } while (indexList.includes(randomIndex));
        indexList.push(randomIndex);
    }

    for (let i = 0; i < targets.length; i++) {
        spinInfo[targets[i]] = { condition: "", disguise: "", ntko: false };
        reorderedTargets[i] = targets[indexList[i]];
        // reorderedTargets[i] = targets[i];
    }

    const disguisesSpun: string[] = [];
    reorderedTargets.forEach((target) => {
        if (!spinInfo[target]) {
            return;
        }

        let targetDisguise = "";

        do {
            targetDisguise = GetRandomDisguise(spinInfoOptions.disguises);
            spinInfo[target].disguise = targetDisguise;
        } while (disguisesSpun.includes(targetDisguise));
        disguisesSpun.push(targetDisguise);
    });

    reorderedTargets.forEach((target) => {
        do {
            if (!spinInfo[target]) {
                return;
            }

            const { condition, isNoKO } = GetRandomCondition(
                spinInfoOptions.conditions,
                target,
            );
            spinInfo[target].condition = condition;
            spinInfo[target].ntko = isNoKO;
        } while (!SpinIsLegal({ mission: mission, info: spinInfo }).legal);
    });

    return { mission: mission, info: spinInfo };
}

function GetRandomDisguise(disguiseList: string[]): string {
    return disguiseList[Math.floor(Math.random() * disguiseList.length)];
}

function GetRandomCondition(conditions: TargetConditions, target: SpinTarget) {
    const conditionTypeList: ConditionType[] = [
        "weapons",
        "unique_kills",
        "melees",
    ];
    let conditionTypeSize = 3;
    // Remove possibility of melees if Soders
    if (target === "erich_soders") {
        conditionTypeSize = 2;
    }

    // Get which condition type to choose from
    const conditionType: ConditionType =
        conditionTypeList[Math.floor(Math.random() * conditionTypeSize)];

    const updatedConditions = structuredClone(conditions);

    // Modfiy possible conditions for Soders
    if (target === "erich_soders") {
        updatedConditions.unique_kills = TargetUniqueKillsList[target];
        // Remove explosive on weapon kills list, it is considered a unique kill here :P
        updatedConditions.weapons.pop();
    } else {
        updatedConditions.unique_kills = [
            ...TargetUniqueKillsList[target],
            ...conditions.unique_kills,
        ];
    }

    const conditionOptions: string[] = updatedConditions[conditionType];

    let condition =
        conditionOptions[Math.floor(Math.random() * conditionOptions.length)];

    // Add "silenced_" , "loud_", or no prefix if condition is a firearm
    if (weapons.includes(condition) && condition !== "explosive") {
        const modifierPrefix =
            weaponModifierPrefix[
                Math.floor(Math.random() * weaponModifierPrefix.length)
            ];

        condition = modifierPrefix + condition;
    }
    // Add "remote_" , "impact_", or "loud_" prefix if condition is explosive
    else if (condition === "explosive") {
        const modifierPrefix =
            explosiveModifierPrefix[
                Math.floor(Math.random() * explosiveModifierPrefix.length)
            ];

        condition = modifierPrefix + condition;
    }

    // 1/4 chance to add NTKO if possible, some rule checks done in CanBeNTKO
    const isNoKO =
        CanBeNTKO(target, condition).ntkoLegal && Math.random() <= 0.25;

    // Log info if somehow no condition is found
    if (!condition) {
        console.log("TARGET CONDITION:", condition);
        console.log("CONDITIONS LIST:", conditionOptions);
        console.log("CONDITIONS TYPE:", conditionType);
        console.log("CUSTOM CONDITIONS:", updatedConditions);
    }

    return { condition, isNoKO };
}

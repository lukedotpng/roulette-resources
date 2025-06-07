import {
    KillMethodType,
    Mission,
    Spin,
    SpinInfo,
    SpinTarget,
    TargetKillMethods,
} from "@/types";
import { CanBeNTKO, SpinIsLegal } from "../SpinCheck";
import {
    EXPLOSIVE_MODIFIER_PREFIX,
    MISSION_SPIN_INFO_LIST,
    SPIN_MISSION_TARGETS_LIST,
    TARGET_UNIQUE_KILLS_LIST,
    WEAPON_MODIFIER_PREFIX,
    WEAPONS,
} from "../SpinGlobals";

export function GenerateSpin(mission: Mission): Spin {
    const targets = SPIN_MISSION_TARGETS_LIST[mission];
    const spinInfoOptions = MISSION_SPIN_INFO_LIST[mission];

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
        spinInfo[targets[i]] = { killMethod: "", disguise: "", ntko: false };
        // reorderedTargets[i] = targets[indexList[i]];
        reorderedTargets[i] = targets[i];
    }

    do {
        targets.forEach((target) => {
            spinInfo[target] = { disguise: "", killMethod: "", ntko: false };

            const targetDisguise = GetRandomDisguise(spinInfoOptions.disguises);
            spinInfo[target].disguise = targetDisguise;

            const { condition, isNoKO } = GetRandomCondition(
                spinInfoOptions.killMethods,
                target,
            );
            spinInfo[target].killMethod = condition;
            spinInfo[target].ntko = isNoKO;
        });
    } while (!SpinIsLegal({ mission: mission, info: spinInfo }).legal);

    return { mission: mission, info: spinInfo };
}

function GetRandomDisguise(disguiseList: string[]): string {
    return disguiseList[Math.floor(Math.random() * disguiseList.length)];
}

function GetRandomCondition(
    killMethods: TargetKillMethods,
    target: SpinTarget,
) {
    const killMethodTypeList: KillMethodType[] = [
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
    const killMethodType: KillMethodType =
        killMethodTypeList[Math.floor(Math.random() * conditionTypeSize)];

    const updatedConditions = structuredClone(killMethods);

    // Modfiy possible conditions for Soders
    if (target === "erich_soders") {
        updatedConditions.unique_kills = TARGET_UNIQUE_KILLS_LIST[target];
        // Remove explosive on weapon kills list, it is considered a unique kill here :P
        updatedConditions.weapons.pop();
    } else {
        updatedConditions.unique_kills = [
            ...TARGET_UNIQUE_KILLS_LIST[target],
            ...killMethods.unique_kills,
        ];
    }

    const conditionOptions: string[] = updatedConditions[killMethodType];

    let condition =
        conditionOptions[Math.floor(Math.random() * conditionOptions.length)];

    // Add "silenced_" , "loud_", or no prefix if condition is a firearm
    if (WEAPONS.includes(condition) && condition !== "explosive") {
        const modifierPrefix =
            WEAPON_MODIFIER_PREFIX[
                Math.floor(Math.random() * WEAPON_MODIFIER_PREFIX.length)
            ];

        condition = modifierPrefix + condition;
    }
    // Add "remote_" , "impact_", or "loud_" prefix if condition is explosive
    else if (condition === "explosive") {
        const modifierPrefix =
            EXPLOSIVE_MODIFIER_PREFIX[
                Math.floor(Math.random() * EXPLOSIVE_MODIFIER_PREFIX.length)
            ];

        condition = modifierPrefix + condition;
    }

    // 1/4 chance to add NTKO if possible, some rule checks done in CanBeNTKO
    // dont pass disguise, file will probably be deleted soon anyway
    const isNoKO =
        CanBeNTKO(target, condition, "").ntkoLegal && Math.random() <= 0.25;

    // Log info if somehow no condition is found
    if (!condition) {
        console.log("TARGET CONDITION:", condition);
        console.log("CONDITIONS LIST:", conditionOptions);
        console.log("CONDITIONS TYPE:", killMethodType);
        console.log("CUSTOM CONDITIONS:", updatedConditions);
    }

    return { condition, isNoKO };
}

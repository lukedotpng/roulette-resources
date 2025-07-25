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

            const { killMethod, isNoKO } = GetRandomCondition(
                spinInfoOptions.killMethods,
                target,
            );
            spinInfo[target].killMethod = killMethod;
            spinInfo[target].ntko = isNoKO;
        } while (!SpinIsLegal({ mission: mission, info: spinInfo }).legal);
    });

    return { mission: mission, info: spinInfo };
}

function GetRandomDisguise(disguiseList: string[]): string {
    return disguiseList[Math.floor(Math.random() * disguiseList.length)];
}

function GetRandomCondition(conditions: TargetKillMethods, target: SpinTarget) {
    const killMethodTypeList: KillMethodType[] = [
        "weapons",
        "unique_kills",
        "melees",
    ];
    let killMethodTypeSize = 3;
    // Remove possibility of melees if Soders
    if (target === "erich_soders") {
        killMethodTypeSize = 2;
    }

    // Get which condition type to choose from
    const killMethodType: KillMethodType =
        killMethodTypeList[Math.floor(Math.random() * killMethodTypeSize)];

    const updatedKillMethods = structuredClone(conditions);

    // Modfiy possible conditions for Soders
    if (target === "erich_soders") {
        updatedKillMethods.unique_kills = TARGET_UNIQUE_KILLS_LIST[target];
        // Remove explosive on weapon kills list, it is considered a unique kill here :P
        updatedKillMethods.weapons.pop();
    } else {
        updatedKillMethods.unique_kills = [
            ...TARGET_UNIQUE_KILLS_LIST[target],
            ...conditions.unique_kills,
        ];
    }

    const killMethodOptions: string[] = updatedKillMethods[killMethodType];

    let killMethod =
        killMethodOptions[Math.floor(Math.random() * killMethodOptions.length)];

    // Add "silenced_" , "loud_", or no prefix if condition is a firearm
    if (WEAPONS.includes(killMethod) && killMethod !== "explosive") {
        const modifierPrefix =
            WEAPON_MODIFIER_PREFIX[
                Math.floor(Math.random() * WEAPON_MODIFIER_PREFIX.length)
            ];

        killMethod = modifierPrefix + killMethod;
    }
    // Add "remote_" , "impact_", or "loud_" prefix if condition is explosive
    else if (killMethod === "explosive") {
        const modifierPrefix =
            EXPLOSIVE_MODIFIER_PREFIX[
                Math.floor(Math.random() * EXPLOSIVE_MODIFIER_PREFIX.length)
            ];

        killMethod = modifierPrefix + killMethod;
    }

    // 1/4 chance to add NTKO if possible, some rule checks done in CanBeNTKO
    const isNoKO =
        CanBeNTKO(target, killMethod, "").ntkoLegal && Math.random() <= 0.25;

    // Log info if somehow no condition is found
    if (!killMethod) {
        console.log("TARGET CONDITION:", killMethod);
        console.log("CONDITIONS LIST:", killMethodOptions);
        console.log("CONDITIONS TYPE:", killMethodType);
        console.log("CUSTOM CONDITIONS:", updatedKillMethods);
    }

    return { killMethod, isNoKO };
}

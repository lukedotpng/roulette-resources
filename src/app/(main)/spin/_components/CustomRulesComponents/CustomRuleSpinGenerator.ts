import {
    KillMethodType,
    Mission,
    Spin,
    SpinInfo,
    SpinTarget,
    TargetKillMethods,
} from "@/types";

import { Ruleset } from "./CustomRuleTypes";
import {
    MISSION_SPIN_INFO_LIST,
    SODERS_UNIQUE_KILLS,
    SPIN_MISSION_TARGETS_LIST,
    UNIQUE_KILLS,
    WEAPONS_WITH_MODIFIERS,
} from "../../utils/SpinGlobals";

export function GenerateSpin(ruleset: Ruleset, mission: Mission): Spin {
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
    }

    const disguisesSpun: string[] = [];
    reorderedTargets.forEach((target) => {
        if (!spinInfo[target]) {
            return;
        }

        const targetDisguise = GetRandomDisguise(
            spinInfoOptions.disguises,
            disguisesSpun,
            ruleset,
        );
        disguisesSpun.push(targetDisguise);
        spinInfo[target].disguise = targetDisguise;
    });

    const killMethodsSpun: string[] = [];
    reorderedTargets.forEach((target) => {
        if (!spinInfo[target]) {
            return;
        }

        const { killMethod, isNoKO } = GetRandomCondition(
            mission,
            target,
            spinInfoOptions.killMethods,
            killMethodsSpun,
            spinInfo[target].disguise,
            disguisesSpun,
            ruleset,
        );

        killMethodsSpun.push(killMethod);
        spinInfo[target].killMethod = killMethod;
        spinInfo[target].ntko = isNoKO;
    });

    return { mission: mission, info: spinInfo };
}

function GetRandomDisguise(
    disguiseList: string[],
    disguisesSpun: string[],
    ruleset: Ruleset,
): string {
    let disguise = "";
    do {
        disguise =
            disguiseList[Math.floor(Math.random() * disguiseList.length)];
    } while (
        ruleset.conditions.global.disguisesCantRepeat &&
        disguisesSpun.includes(disguise)
    );
    return disguise;
}

function GetRandomCondition(
    mission: Mission,
    target: SpinTarget,
    killMethods: TargetKillMethods,
    killMethodsSpun: string[],
    disguise: string,
    disguisesSpun: string[],
    ruleset: Ruleset,
) {
    const targetInfo = ruleset.targets && ruleset.targets[target];

    const remoteForcedInDisguise =
        targetInfo !== undefined &&
        targetInfo.remoteForcedDisguises !== undefined &&
        targetInfo.remoteForcedDisguises.includes(disguise);

    // Get all possible melees from regular items to custom kills
    const allMelees = [...killMethods.melees];
    if (targetInfo.customKills?.melees) {
        for (const killMethod of targetInfo.customKills.melees) {
            allMelees.push(killMethod);
        }
    }
    if (ruleset.customKills.melees) {
        for (const killMethod of ruleset.customKills.melees) {
            allMelees.push(killMethod);
        }
    }
    // Get only legal melees back, removing banned and repeated (if applicable) kills
    const filteredMelees = GetFilteredKillMethods(
        "melees",
        allMelees,
        killMethodsSpun,
        remoteForcedInDisguise,
        mission,
        target,
        disguise,
        disguisesSpun,
        ruleset,
    );

    // Get all possible weapons from regular items to custom kills
    const allWeapons = [...WEAPONS_WITH_MODIFIERS];
    if (targetInfo.customKills?.weapons) {
        for (const killMethod of targetInfo.customKills.weapons) {
            allWeapons.push(killMethod);
        }
    }
    if (ruleset.customKills.weapons) {
        for (const killMethod of ruleset.customKills.weapons) {
            allWeapons.push(killMethod);
        }
    }
    // Get only legal weapons back, removing banned and repeated (if applicable) kills
    const filteredWeapons = GetFilteredKillMethods(
        "weapons",
        allWeapons,
        killMethodsSpun,
        remoteForcedInDisguise,
        mission,
        target,
        disguise,
        disguisesSpun,
        ruleset,
    );

    // Get all possible unique kills from regular items to custom kills
    const allUniqueKills =
        target === "erich_soders"
            ? [...SODERS_UNIQUE_KILLS]
            : [...UNIQUE_KILLS];
    if (targetInfo.customKills?.unique_kills) {
        for (const killMethod of targetInfo.customKills.unique_kills) {
            allUniqueKills.push(killMethod);
        }
    }
    if (ruleset.customKills.unique_kills) {
        for (const killMethod of ruleset.customKills.unique_kills) {
            allUniqueKills.push(killMethod);
        }
    }
    // Get only legal weapons back, removing banned and repeated (if applicable) kills
    const filteredUniqueKills = GetFilteredKillMethods(
        "unique_kills",
        allUniqueKills,
        killMethodsSpun,
        remoteForcedInDisguise,
        mission,
        target,
        disguise,
        disguisesSpun,
        ruleset,
    );

    const killMethodTypeList: KillMethodType[] = [];
    // Add kill types if they are possible
    if (filteredMelees.length > 0) {
        killMethodTypeList.push("melees");
    }
    if (filteredWeapons.length > 0) {
        killMethodTypeList.push("weapons");
    }
    if (filteredUniqueKills.length > 0) {
        killMethodTypeList.push("unique_kills");
    }

    const killMethodType =
        killMethodTypeList[
            Math.floor(Math.random() * killMethodTypeList.length)
        ];

    let killMethod = "Any";
    switch (killMethodType) {
        case "melees":
            killMethod =
                filteredMelees[
                    Math.floor(Math.random() * filteredMelees.length)
                ];
            break;
        case "weapons":
            killMethod =
                filteredWeapons[
                    Math.floor(Math.random() * filteredWeapons.length)
                ];
            break;
        case "unique_kills":
            killMethod =
                filteredUniqueKills[
                    Math.floor(Math.random() * filteredUniqueKills.length)
                ];
            break;
    }

    if (killMethod === "Any") {
        console.log("KILL METHOD TYPE", killMethodType);
        console.log("MELEES", filteredMelees);
        console.log("WEAPONS", filteredWeapons);
        console.log("UNIQUE KILLS", filteredUniqueKills);
    }

    // 1/4 chance to add NTKO if possible, doesnt make sense for Soders
    let isNoKO = false;
    if (target !== "erich_soders" && IsNTKOValid(target, killMethod, ruleset)) {
        isNoKO = Math.random() <= 0.25;
    }

    return { killMethod, isNoKO };
}

function GetFilteredKillMethods(
    killMethodType: KillMethodType,
    killMethods: string[],
    killMethodsSpun: string[],
    remoteForced: boolean,
    mission: Mission,
    target: SpinTarget,
    disguise: string,
    disguisesSpun: string[],
    ruleset: Ruleset,
): string[] {
    const targetInfo = ruleset.targets && ruleset.targets[target];

    const killMethodsCantRepeat =
        ruleset.conditions !== undefined &&
        ruleset.conditions.global.killMethodsCantRepeat;

    return killMethods.filter((killMethod) => {
        if (remoteForced) {
            if (!ruleset.remoteKillMethods.includes(killMethod)) {
                return false;
            }
        }

        if (targetInfo.bannedKills?.includes(killMethod)) {
            return false;
        }

        if (targetInfo.bannedKillsWithDisguise !== undefined) {
            for (const bannedKillWithDisguise of targetInfo.bannedKillsWithDisguise) {
                if (bannedKillWithDisguise.disguise === disguise) {
                    if (bannedKillWithDisguise.kills.includes(killMethod)) {
                        return false;
                    }
                }
            }
        }

        const { killMethod: killMethodNoModifier } =
            SplitKillMethodModifier(killMethod);

        for (let i = 0; i < killMethodsSpun.length; i++) {
            if (killMethodsCantRepeat) {
                const { killMethod: pastKillMethodNoModifier } =
                    SplitKillMethodModifier(killMethodsSpun[i]);

                if (killMethodNoModifier === pastKillMethodNoModifier) {
                    return false;
                }
            }

            let allComboGroupsCantRepeat = [
                ...ruleset.conditions.global.conditionCombosGroupsCantRepeat,
            ];
            if (ruleset.conditions.missions[mission] !== undefined) {
                allComboGroupsCantRepeat = [
                    ...allComboGroupsCantRepeat,
                    ...ruleset.conditions.missions[mission]
                        .conditionCombosGroupsCantRepeat,
                ];
            }

            for (const conditionComboGroup of allComboGroupsCantRepeat) {
                let oneComboHasBeenSpun = false;
                let currentConditionsMatchCombo = false;
                for (const conditionCombo of conditionComboGroup.combos) {
                    if (
                        conditionCombo.disguises.length === 0 &&
                        conditionCombo.killMethods.length === 0
                    ) {
                        continue;
                    }

                    if (
                        (conditionCombo.killMethods.length === 0 ||
                            conditionCombo.killMethods.includes(killMethod)) &&
                        (conditionCombo.disguises.length === 0 ||
                            conditionCombo.disguises.includes(disguise))
                    ) {
                        currentConditionsMatchCombo = true;
                    }

                    const killMethodInComboHasBeenSpun =
                        conditionCombo.killMethods.length === 0 ||
                        conditionCombo.killMethods.includes(killMethodsSpun[i]);
                    const disguiseInComboHasBeenSpun =
                        conditionCombo.disguises.length === 0 ||
                        conditionCombo.disguises.includes(disguisesSpun[i]);

                    if (
                        killMethodInComboHasBeenSpun &&
                        disguiseInComboHasBeenSpun
                    ) {
                        oneComboHasBeenSpun = true;
                    }
                }
                if (oneComboHasBeenSpun && currentConditionsMatchCombo) {
                    return false;
                }
            }
        }

        return true;
    });
}

function SplitKillMethodModifier(killMethod: string) {
    let killMethodNoModifier = killMethod;
    let modifier = "";
    if (
        killMethod.startsWith("loud_") ||
        killMethod.startsWith("silenced_") ||
        killMethod.startsWith("remote_") ||
        killMethod.startsWith("impact_")
    ) {
        let modifierEndIndex = 0;
        for (const letter of killMethod) {
            if (letter === "_") {
                break;
            }
            modifierEndIndex++;
        }
        killMethodNoModifier = killMethod.slice(modifierEndIndex + 1);
        modifier = killMethod.slice(0, modifierEndIndex - 1);
    }

    return { modifier: modifier, killMethod: killMethodNoModifier };
}

function IsNTKOValid(target: SpinTarget, killMethod: string, ruleset: Ruleset) {
    if (!ruleset.ntkoValidKills.includes(killMethod)) {
        return false;
    }

    if (
        ruleset.targets[target].ntkoBannedKills === undefined ||
        ruleset.targets[target].ntkoBannedKills.length === 0
    ) {
        return true;
    }

    if (ruleset.targets[target].ntkoBannedKills.includes(killMethod)) {
        return false;
    }

    return true;
}

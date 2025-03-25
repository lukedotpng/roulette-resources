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
    weaponModifierPrefix,
    explosiveModifierPrefix,
    TargetBannedConditionsList,
    largeWeaponsList,
    explosiveConditionList,
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
        // reorderedTargets[i] = targets[indexList[i]];
        reorderedTargets[i] = targets[i];
    }

    const disguisesSpun: string[] = [];
    reorderedTargets.forEach((target) => {
        if (!spinInfo[target]) {
            return;
        }

        const targetDisguise = GetRandomDisguise(
            spinInfoOptions.disguises,
            disguisesSpun,
        );

        spinInfo[target].disguise = targetDisguise;
        disguisesSpun.push(targetDisguise);
    });

    const conditionsSpun: string[] = [];
    let largeWeaponSpun = false;

    reorderedTargets.forEach((target) => {
        if (!spinInfo[target]) {
            return;
        }

        const { condition, isNoKO } = GetRandomCondition(
            spinInfoOptions.conditions,
            target,
            conditionsSpun,
            largeWeaponSpun,
            spinInfo[target].disguise,
        );
        spinInfo[target].condition = condition;
        conditionsSpun.push(condition);
        if (largeWeaponsList.includes(condition)) {
            largeWeaponSpun = true;
        }

        spinInfo[target].ntko = isNoKO;
    });

    return { mission: mission, info: spinInfo };
}

function GetRandomDisguise(
    disguiseList: string[],
    disguisesSpun: string[],
): string {
    // ~26ms per 100,000 spins
    // const validDisguises = disguiseList.filter((disguise) => {
    //     if (disguisesSpun.includes(disguise)) {
    //         return false;
    //     }
    //     return true;
    // });

    // return validDisguises[Math.floor(Math.random() * validDisguises.length)];

    // ~6ms per 100,000 spins
    let disguise =
        disguiseList[Math.floor(Math.random() * disguiseList.length)];
    while (disguisesSpun.includes(disguise)) {
        disguise =
            disguiseList[Math.floor(Math.random() * disguiseList.length)];
    }
    return disguise;
}

function GetRandomCondition(
    conditions: TargetConditions,
    target: SpinTarget,
    conditionsSpun: string[],
    largeWeaponSpun: boolean,
    disguise: string,
) {
    const noMeleesOrRemoteForced =
        target === "erich_soders" ||
        (disguise === "prisoner" && target === "claus_strandberg") ||
        disguise === "stalker" ||
        disguise === "knights_armor";

    const conditionTypeList: ConditionType[] = [
        "unique_kills",
        "weapons",
        "melees",
    ];
    let conditionTypeSize = 3;
    // Remove possibility of melees if Soders or disguise is remote only
    if (noMeleesOrRemoteForced) {
        conditionTypeSize = 2;
    }

    // Get which condition type to choose from
    let conditionType: ConditionType =
        conditionTypeList[Math.floor(Math.random() * conditionTypeSize)];
    let conditionOptions: string[];

    // Condition type check cut ~550ms per 100,000 spins for Paris
    if (conditionType === "unique_kills") {
        conditionOptions = GetLegalUniqueKills(
            target,
            disguise,
            conditions.unique_kills,
            conditionsSpun,
        );
    } else if (conditionType === "weapons") {
        // Filter previously spun weapons, counting modfied weapons as equal to regual weapons (i.e "silenced_pistol" === "pistol")
        conditionOptions = GetLegalWeapons(
            target,
            disguise,
            conditions.weapons,
            conditionsSpun,
            largeWeaponSpun,
        );
        // If no weopons available. only allow picking from unique kills
        // This mainly will happen when a disguise forces remote kills,
        // and the previous target(s) picked an explosive condition
        if (conditionOptions.length === 0) {
            conditionType = "unique_kills";
            conditionOptions = GetLegalUniqueKills(
                target,
                disguise,
                conditions.unique_kills,
                conditionsSpun,
            );
        }
    } else {
        // Filter previously spun melees
        conditionOptions = conditions.melees.filter((melee) => {
            return !conditionsSpun.includes(melee);
        });
    }

    let condition =
        conditionOptions[Math.floor(Math.random() * conditionOptions.length)];

    // Add "silenced_" , "loud_", or no prefix if condition is a firearm
    if (conditionType === "weapons" && condition !== "explosive") {
        const modifierPrefix =
            weaponModifierPrefix[
                Math.floor(Math.random() * weaponModifierPrefix.length)
            ];

        condition = modifierPrefix + condition;
    }
    // Add "remote_" , "impact_", or "loud_" prefix if condition is explosive
    else if (condition === "explosive") {
        if (noMeleesOrRemoteForced) {
            condition = "remote_explosive";
        } else {
            const modifierPrefix =
                explosiveModifierPrefix[
                    Math.floor(Math.random() * explosiveModifierPrefix.length)
                ];

            condition = modifierPrefix + condition;
        }
    }

    // Log info if somehow no condition is found
    if (!condition) {
        console.log("TARGET:", target);
        console.log("TARGET CONDITION:", condition);
        console.log("CONDITIONS TYPE:", conditionType);
        console.log("CONDITIONS LIST:", conditionOptions);
        console.log("CONDITIONS SPUN:", conditionsSpun);
        console.log("CUSTOM CONDITIONS:", conditions);
    }

    // 1/4 chance to add NTKO if possible, some rule checks done in CanBeNTKO
    let isNoKO = false;
    if (conditionType !== "unique_kills") {
        isNoKO =
            CanBeNTKO(target, condition).ntkoLegal && Math.random() <= 0.25;
    }

    return { condition, isNoKO };
}

function GetLegalUniqueKills(
    target: SpinTarget,
    disguise: string,
    uniqueKillsArr: string[],
    conditionsSpun: string[],
) {
    // Handle Soders uniquely, by only checking if "explosion" kills repeat
    if (target === "erich_soders") {
        const legalUniqueKills = TargetUniqueKillsList[target];
        return legalUniqueKills.filter((uniqueKill) => {
            if (uniqueKill === "explosion") {
                if (conditionsSpun.includes("explosion_accident")) {
                    return false;
                }
                for (const condition of conditionsSpun) {
                    if (explosiveConditionList.includes(condition)) {
                        return false;
                    }
                }
            }
            return true;
        });
    }

    const trapKills = [
        "explosion_accident",
        "consumed_poison",
        "fire",
        "electrocution",
    ];

    const legalUniqueKills = [
        ...uniqueKillsArr,
        ...TargetUniqueKillsList[target],
    ];

    // Filter out banned kills, and previously spun kills
    return legalUniqueKills.filter((uniqueKill) => {
        if (TargetBannedConditionsList[target].includes(uniqueKill)) {
            return false;
        }

        if (conditionsSpun.includes(uniqueKill)) {
            if (uniqueKill === "electrocution" && target === "yuki_yamazaki") {
                return true;
            }
            return false;
        }

        if (
            target === "yuki_yamazaki" &&
            conditionsSpun.includes("explosion") &&
            uniqueKill === "explosion_accident"
        ) {
            return false;
        }

        // Check for trap kill restricted disguises
        if (disguise === "prisoner" && target === "claus_strandberg") {
            if (!trapKills.includes(uniqueKill)) {
                return false;
            }
        }
        if (disguise === "stalker") {
            if (!trapKills.includes(uniqueKill)) {
                return false;
            }
        }
        if (disguise === "knights_armor") {
            if (!trapKills.includes(uniqueKill)) {
                return false;
            }
        }

        // Specific condition+disguise checks
        if (disguise === "moses_lee" && uniqueKill === "shoot_the_car") {
            return false;
        }
        if (disguise === "skydiving_suit" && uniqueKill === "drowning") {
            return false;
        }

        return true;
    });
}

function GetLegalWeapons(
    target: SpinTarget,
    disguise: string,
    weaponsArr: string[],
    conditionsSpun: string[],
    largeWeaponSpun: boolean,
) {
    return weaponsArr.filter((weapon) => {
        if (largeWeaponsList.includes(weapon) && largeWeaponSpun) {
            return false;
        }

        // Check for trap kill restricted disguises
        if (weapon !== "explosive") {
            if (disguise === "prisoner" && target === "claus_strandberg") {
                return false;
            }
            if (disguise === "stalker") {
                return false;
            }
            if (disguise === "knights_armor") {
                return false;
            }
        }

        // Filter out explosive for Soders in weapon kills
        if (target === "erich_soders" && weapon === "explosive") {
            return false;
        }

        for (const pastCondition of conditionsSpun) {
            const pastConditionModifierSplitIndex = pastCondition.indexOf("_");
            const pastConditionModfierRemoved = pastCondition.slice(
                pastConditionModifierSplitIndex + 1,
            );
            if (pastConditionModfierRemoved === weapon) {
                return false;
            }
        }
        if (
            target === "yuki_yamazaki" &&
            conditionsSpun.includes("explosion") &&
            weapon === "explosive"
        ) {
            return false;
        }

        return true;
    });
}

export function RegenerateCondition(spin: Spin, target: SpinTarget): Spin {
    const spinInfoOptions = MissionSpinInfoList[spin.mission];
    const updatedSpin = structuredClone(spin);

    const conditionsSpun: string[] = [];
    let largeWeaponSpun = false;
    const targets = Object.keys(updatedSpin.info) as SpinTarget[];
    for (const currTarget of targets) {
        if (currTarget === target || !updatedSpin.info[currTarget]) {
            continue;
        }
        conditionsSpun.push(updatedSpin.info[currTarget].condition);
        if (largeWeaponsList.includes(updatedSpin.info[currTarget].condition)) {
            largeWeaponSpun = true;
        }
    }

    do {
        if (!updatedSpin.info[target]) {
            return spin;
        }

        const { condition, isNoKO } = GetRandomCondition(
            spinInfoOptions.conditions,
            target,
            conditionsSpun,
            largeWeaponSpun,
            updatedSpin.info[target].disguise,
        );

        updatedSpin.info[target].condition = condition;
        updatedSpin.info[target].ntko = isNoKO;
    } while (
        updatedSpin.info[target].condition === spin.info[target]?.condition
    );

    return updatedSpin;
}

export function RegenerateDisguise(spin: Spin, target: SpinTarget): Spin {
    const spinInfoOptions = MissionSpinInfoList[spin.mission];

    const updatedSpin = structuredClone(spin);

    do {
        if (!updatedSpin.info[target]) {
            return spin;
        }

        const disguise = GetRandomDisguise(spinInfoOptions.disguises, []);

        updatedSpin.info[target].disguise = disguise;
    } while (
        !SpinIsLegal(updatedSpin).legal ||
        updatedSpin.info[target].disguise === spin.info[target]?.disguise
    );

    return updatedSpin;
}

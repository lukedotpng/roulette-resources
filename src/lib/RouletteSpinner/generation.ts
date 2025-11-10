import { CanBeNTKO } from "./check";
import {
    EXPLOSIVE_KILL_METHOD_LIST,
    EXPLOSIVE_MODIFIER_PREFIX,
    LARGE_WEAPON_LIST,
    MISSION_CONDITIONS_MAP,
    MISSION_TARGETS_LIST,
    TARGET_BANNED_KILL_METHODS_LIST,
    TARGET_UNIQUE_KILLS_LIST,
} from "./globals";

import {
    KillMethodType,
    Mission,
    Spin,
    SpinInfo,
    SpinTarget,
    TargetKillMethods,
} from "./types";

export function GenerateSpin(mission: Mission): Spin {
    const targets = MISSION_TARGETS_LIST[mission];
    const spinInfoOptions = MISSION_CONDITIONS_MAP[mission];

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
        spinInfo[targets[i]] = {
            killMethod: "",
            disguise: "",
            ntko: false,
        };
        reorderedTargets[i] = targets[indexList[i]];
        // reorderedTargets[i] = targets[i];
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

        const { killMethod, isNoKO } = GetRandomCondition(
            spinInfoOptions.killMethods,
            target,
            conditionsSpun,
            largeWeaponSpun,
            spinInfo[target].disguise,
        );
        spinInfo[target].killMethod = killMethod;
        conditionsSpun.push(killMethod);
        if (LARGE_WEAPON_LIST.includes(killMethod)) {
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
    killMethods: TargetKillMethods,
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

    const conditionTypeList: KillMethodType[] = [
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
    let conditionType: KillMethodType =
        conditionTypeList[Math.floor(Math.random() * conditionTypeSize)];
    let conditionOptions: string[];

    // Condition type check cut ~550ms per 100,000 spins for Paris
    if (conditionType === "unique_kills") {
        conditionOptions = GetLegalUniqueKills(
            target,
            disguise,
            killMethods.unique_kills,
            conditionsSpun,
        );
    } else if (conditionType === "weapons") {
        // Filter previously spun weapons, counting modfied weapons as equal to regual weapons (i.e "silenced_pistol" === "pistol")
        conditionOptions = GetLegalWeapons(
            target,
            disguise,
            killMethods.weapons,
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
                killMethods.unique_kills,
                conditionsSpun,
            );
        }
    } else {
        // Filter previously spun melees
        conditionOptions = killMethods.melees.filter((melee) => {
            if (conditionsSpun.includes(melee)) {
                return false;
            }

            if (melee === "sacrificial_knife") {
                return false;
            }

            return true;
        });
    }

    let killMethod =
        conditionOptions[Math.floor(Math.random() * conditionOptions.length)];

    // 50% chance to add "silenced_" or "loud_" prefix if condition is a firearm
    if (conditionType === "weapons" && killMethod !== "explosive") {
        const addPrefix = Math.random() < 0.5;
        if (addPrefix) {
            if (Math.random() < 0.5) {
                killMethod = "loud_" + killMethod;
            } else {
                killMethod = "silenced_" + killMethod;
            }
        }
    }
    // Add "remote_" , "impact_", or "loud_" prefix if condition is explosive
    else if (killMethod === "explosive") {
        if (noMeleesOrRemoteForced) {
            killMethod = "remote_explosive";
        } else {
            let modifierPrefix = "";
            if (
                target === "vanya_shah" ||
                target === "dawood_rangan" ||
                target === "hush"
            ) {
                modifierPrefix = Math.random() > 0.5 ? "remote_" : "loud_";
            } else {
                modifierPrefix =
                    EXPLOSIVE_MODIFIER_PREFIX[
                        Math.floor(
                            Math.random() * EXPLOSIVE_MODIFIER_PREFIX.length,
                        )
                    ];
            }

            killMethod = modifierPrefix + killMethod;
        }
    }

    // Log info if somehow no condition is found
    if (!killMethod) {
        console.log("TARGET:", target);
        console.log("TARGET CONDITION:", killMethod);
        console.log("CONDITIONS TYPE:", conditionType);
        console.log("CONDITIONS LIST:", conditionOptions);
        console.log("CONDITIONS SPUN:", conditionsSpun);
        console.log("CUSTOM CONDITIONS:", killMethods);
    }

    // 1/4 chance to add NTKO if possible, some rule checks done in CanBeNTKO
    let isNoKO = false;
    if (conditionType !== "unique_kills") {
        isNoKO =
            CanBeNTKO(target, killMethod, disguise).ntkoLegal &&
            Math.random() <= 0.25;
    }

    return { killMethod, isNoKO };
}

function GetLegalUniqueKills(
    target: SpinTarget,
    disguise: string,
    uniqueKillsArr: string[],
    conditionsSpun: string[],
) {
    // Handle Soders uniquely, by only checking if "explosion" kills repeat
    if (target === "erich_soders") {
        const legalUniqueKills = TARGET_UNIQUE_KILLS_LIST[target];
        return legalUniqueKills.filter((uniqueKill: string) => {
            if (uniqueKill === "explosion") {
                if (conditionsSpun.includes("explosion_accident")) {
                    return false;
                }
                for (const condition of conditionsSpun) {
                    if (EXPLOSIVE_KILL_METHOD_LIST.includes(condition)) {
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
        ...TARGET_UNIQUE_KILLS_LIST[target],
    ];

    // Filter out banned kills, and previously spun kills
    return legalUniqueKills.filter((uniqueKill) => {
        if (TARGET_BANNED_KILL_METHODS_LIST[target].includes(uniqueKill)) {
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
        if (
            target === "sierra_knox" &&
            disguise === "moses_lee" &&
            uniqueKill === "shoot_the_car"
        ) {
            return false;
        }
        if (
            target === "marcus_stuyvesant" &&
            disguise === "skydiving_suit" &&
            uniqueKill === "drowning"
        ) {
            return false;
        }
        if (
            target === "vanya_shah" &&
            disguise === "tailor" &&
            uniqueKill === "drowning"
        ) {
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
        if (LARGE_WEAPON_LIST.includes(weapon) && largeWeaponSpun) {
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

export function RegenerateKillMethod(spin: Spin, target: SpinTarget): Spin {
    const spinInfoOptions = MISSION_CONDITIONS_MAP[spin.mission];
    const updatedSpin = structuredClone(spin);

    const conditionsSpun: string[] = [];
    let largeWeaponSpun = false;
    const targets = Object.keys(updatedSpin.info) as SpinTarget[];
    for (const currTarget of targets) {
        if (currTarget === target || !updatedSpin.info[currTarget]) {
            continue;
        }
        conditionsSpun.push(updatedSpin.info[currTarget].killMethod);
        if (
            LARGE_WEAPON_LIST.includes(updatedSpin.info[currTarget].killMethod)
        ) {
            largeWeaponSpun = true;
        }
    }

    do {
        if (!updatedSpin.info[target]) {
            return spin;
        }

        const { killMethod, isNoKO } = GetRandomCondition(
            spinInfoOptions.killMethods,
            target,
            conditionsSpun,
            largeWeaponSpun,
            updatedSpin.info[target].disguise,
        );

        updatedSpin.info[target].killMethod = killMethod;
        updatedSpin.info[target].ntko = isNoKO;
    } while (
        updatedSpin.info[target].killMethod === spin.info[target]?.killMethod
    );

    return updatedSpin;
}

export function RegenerateDisguise(spin: Spin, target: SpinTarget): Spin {
    const spinInfoOptions = MISSION_CONDITIONS_MAP[spin.mission];

    const updatedSpin = structuredClone(spin);

    const disguisesSpun = [];
    const targets = Object.keys(updatedSpin.info) as SpinTarget[];
    for (const currTarget of targets) {
        if (spin.info[currTarget]) {
            disguisesSpun.push(spin.info[currTarget].disguise);
        }
    }

    do {
        if (!updatedSpin.info[target]) {
            return spin;
        }

        const disguise = GetRandomDisguise(
            spinInfoOptions.disguises,
            disguisesSpun,
        );

        updatedSpin.info[target].disguise = disguise;
    } while (updatedSpin.info[target].disguise === spin.info[target]?.disguise);

    return updatedSpin;
}

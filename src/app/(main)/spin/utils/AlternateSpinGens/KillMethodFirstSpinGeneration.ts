import {
    KillMethodType,
    Mission,
    Spin,
    SpinInfo,
    SpinTarget,
    TargetKillMethods,
} from "@/types";
import {
    SpinMissionTargetsList,
    MissionSpinInfoList,
    TargetUniqueKillsList,
    weaponModifierPrefix,
    explosiveModifierPrefix,
    TargetBannedKillMethodsList,
    largeWeaponsList,
    explosiveKillMethodList,
} from "../SpinGlobals";
import { CanBeNTKO } from "../SpinCheck";

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
        spinInfo[targets[i]] = { killMethod: "", disguise: "", ntko: false };
        reorderedTargets[i] = targets[indexList[i]];
        // reorderedTargets[i] = targets[i];
    }

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
        );
        spinInfo[target].killMethod = killMethod;
        spinInfo[target].ntko = isNoKO;

        conditionsSpun.push(killMethod);
        if (largeWeaponsList.includes(killMethod)) {
            largeWeaponSpun = true;
        }
    });

    const disguisesSpun: string[] = [];
    reorderedTargets.forEach((target) => {
        if (!spinInfo[target]) {
            return;
        }

        const targetDisguise = GetRandomDisguise(
            spinInfoOptions.disguises,
            disguisesSpun,
            target,
            spinInfo[target].killMethod,
        );

        spinInfo[target].disguise = targetDisguise;
        disguisesSpun.push(targetDisguise);
    });

    return { mission: mission, info: spinInfo };
}

function GetRandomDisguise(
    disguiseList: string[],
    disguisesSpun: string[],
    target: SpinTarget,
    condition: string,
): string {
    const legalDisguiseList = disguiseList.filter((disguise) => {
        if (disguisesSpun.includes(disguise)) {
            return false;
        }

        const noMeleesOrRemoteForced =
            (disguise === "prisoner" && target === "claus_strandberg") ||
            disguise === "stalker" ||
            disguise === "knights_armor";

        const trapKills = [
            "explosion_accident",
            "consumed_poison",
            "fire",
            "electrocution",
            "remote_explosive",
        ];

        // Check for trap kill restricted disguises
        if (noMeleesOrRemoteForced) {
            if (!trapKills.includes(condition)) {
                return false;
            }
        }

        // Specific condition+disguise checks
        if (
            disguise === "moses_lee" &&
            condition === "shoot_the_car" &&
            target === "sierra_knox"
        ) {
            return false;
        }
        if (
            disguise === "skydiving_suit" &&
            condition === "drowning" &&
            target === "marcus_stuyvesant"
        ) {
            return false;
        }

        return true;
    });

    const disguise =
        legalDisguiseList[Math.floor(Math.random() * legalDisguiseList.length)];

    return disguise;
}

function GetRandomCondition(
    killMethods: TargetKillMethods,
    target: SpinTarget,
    conditionsSpun: string[],
    largeWeaponSpun: boolean,
) {
    const conditionTypeList: KillMethodType[] = [
        "unique_kills",
        "weapons",
        "melees",
    ];

    // Get which condition type to choose from
    const conditionType: KillMethodType =
        conditionTypeList[Math.floor(Math.random() * 3)];
    let conditionOptions: string[];

    // Condition type check cut ~550ms per 100,000 spins for Paris
    if (conditionType === "unique_kills") {
        conditionOptions = GetLegalUniqueKills(
            target,
            killMethods.unique_kills,
            conditionsSpun,
        );
    } else if (conditionType === "weapons") {
        // Filter previously spun weapons, counting modfied weapons as equal to regual weapons (i.e "silenced_pistol" === "pistol")
        conditionOptions = GetLegalWeapons(
            target,
            killMethods.weapons,
            conditionsSpun,
            largeWeaponSpun,
        );
    } else {
        // Filter previously spun melees
        conditionOptions = killMethods.melees.filter((melee) => {
            return !conditionsSpun.includes(melee);
        });
    }

    let killMethod =
        conditionOptions[Math.floor(Math.random() * conditionOptions.length)];

    // Add "silenced_" , "loud_", or no prefix if condition is a firearm
    if (conditionType === "weapons" && killMethod !== "explosive") {
        const modifierPrefix =
            weaponModifierPrefix[
                Math.floor(Math.random() * weaponModifierPrefix.length)
            ];

        killMethod = modifierPrefix + killMethod;
    }
    // Add "remote_" , "impact_", or "loud_" prefix if condition is explosive
    else if (killMethod === "explosive") {
        const modifierPrefix =
            explosiveModifierPrefix[
                Math.floor(Math.random() * explosiveModifierPrefix.length)
            ];

        killMethod = modifierPrefix + killMethod;
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
        // dont pass disguise, file will probably be deleted soon anyway
        isNoKO =
            CanBeNTKO(target, killMethod, "").ntkoLegal &&
            Math.random() <= 0.25;
    }

    return { killMethod, isNoKO };
}

function GetLegalUniqueKills(
    target: SpinTarget,
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
                    if (explosiveKillMethodList.includes(condition)) {
                        return false;
                    }
                }
            }
            return true;
        });
    }

    const legalUniqueKills = [
        ...uniqueKillsArr,
        ...TargetUniqueKillsList[target],
    ];

    // Filter out banned kills, and previously spun kills
    return legalUniqueKills.filter((uniqueKill) => {
        if (TargetBannedKillMethodsList[target].includes(uniqueKill)) {
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

        return true;
    });
}

function GetLegalWeapons(
    target: SpinTarget,
    weaponsArr: string[],
    conditionsSpun: string[],
    largeWeaponSpun: boolean,
) {
    return weaponsArr.filter((weapon) => {
        if (largeWeaponsList.includes(weapon) && largeWeaponSpun) {
            return false;
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

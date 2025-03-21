import { Mission, Spin, SpinCheckResult, SpinTarget } from "@/types";
import {
    assaultRifleConditionList,
    pistolConditionList,
    shotgunConditionList,
    smgConditionList,
    sniperConditionList,
    SpinMissionTargetsList,
    TargetBannedConditionsList,
    TargetUniqueKillsList,
    uniqueKills,
} from "./SpinGlobals";

export function SpinIsLegal(spin: Spin): SpinCheckResult {
    const spinTargets = SpinMissionTargetsList[spin.mission];

    const disguisesSpun: string[] = [];
    const conditionsSpun: string[] = [];

    for (const target of spinTargets) {
        const targetSpinInfo = spin.info[target];
        if (!targetSpinInfo) {
            return {
                legal: false,
                reason: "error_checking_legality",
            };
        }

        if (disguisesSpun.includes(targetSpinInfo.disguise)) {
            return {
                legal: false,
                reason: "repeat_disguise",
            };
        }

        if (TargetConditionIsBanned(target, targetSpinInfo.condition)) {
            return {
                legal: false,
                reason: "condition_banned",
            };
        }

        if (
            ConditionIsBannedWithDisguise(
                spin.mission,
                target,
                targetSpinInfo.condition,
                targetSpinInfo.disguise,
            )
        ) {
            return {
                legal: false,
                reason: "condition_banned_with_disguise",
            };
        }

        if (ConditionRepeats(targetSpinInfo.condition, conditionsSpun)) {
            if (
                targetSpinInfo.condition !== "electrocution" ||
                spin.mission !== "hokkaido"
            ) {
                return {
                    legal: false,
                    reason: "repeat_condition",
                };
            }
        }

        if (
            spin.mission === "hokkaido" &&
            ExplosionConditionRepeatsOnHokkaido(
                targetSpinInfo.condition,
                conditionsSpun,
            )
        ) {
            return {
                legal: false,
                reason: "repeat_condition",
            };
        }

        if (
            targetSpinInfo.ntko &&
            !CanBeNTKO(target, targetSpinInfo.condition)
        ) {
            return {
                legal: false,
                reason: "illegal_ntko",
            };
        }

        conditionsSpun.push(targetSpinInfo.condition);
        disguisesSpun.push(targetSpinInfo.disguise);
    }

    return {
        legal: true,
    };
}

// Check for basic target specific bans
export function TargetConditionIsBanned(target: SpinTarget, condition: string) {
    if (TargetBannedConditionsList[target].includes(condition)) {
        return true;
    }

    return false;
}

export function ConditionIsBannedWithDisguise(
    mission: Mission,
    target: SpinTarget,
    condition: string,
    disguise: string,
) {
    const trapKills = [
        "explosion_accident",
        "remote_explosive",
        "consumed_poison",
        "fire",
        "electrocution",
    ];

    // Marrakesh Claus Prisoner trap kills check
    if (
        mission === "marrakesh" &&
        disguise === "prisoner" &&
        target === "claus_strandberg" &&
        !trapKills.includes(condition)
    ) {
        return true;
    }
    // Bangkok Stalker trap kills check
    if (
        mission === "bangkok" &&
        disguise === "stalker" &&
        !trapKills.includes(condition)
    ) {
        return true;
    }
    // Miami Sierra shoot the car as Moses Lee
    if (
        mission === "miami" &&
        disguise === "moses_lee" &&
        condition === "shoot_the_car"
    ) {
        return true;
    }
    // Dubai Marcus drowning in skydiving suit
    if (
        mission === "dubai" &&
        disguise === "skydiving_suit" &&
        condition === "drowning"
    ) {
        return true;
    }
    // Isle of Sgail Knights Armor trap kills check
    if (
        mission === "isle_of_sgail" &&
        disguise === "knights_armor" &&
        !trapKills.includes(condition)
    ) {
        return true;
    }
}

export function ExplosionConditionRepeatsOnHokkaido(
    targetCondition: string,
    conditionsSpun: string[],
) {
    const hokkadioExplosiveKillTypes = [
        "remote_explosive",
        "loud_explosive",
        "impact_explosive",
        "explosion_accident",
        "explosion",
    ];

    let anotherConditionIsExplosionType = false;
    for (const pastCondition of conditionsSpun) {
        if (hokkadioExplosiveKillTypes.includes(pastCondition)) {
            anotherConditionIsExplosionType = true;
            break;
        }
    }

    // Both target conditions are of "explosion" type
    if (
        hokkadioExplosiveKillTypes.includes(targetCondition) &&
        anotherConditionIsExplosionType
    ) {
        return true;
    }

    return false;
}

export function ConditionRepeats(
    targetCondition: string,
    conditionsSpun: string[],
) {
    // Basic repeat check
    if (conditionsSpun.includes(targetCondition)) {
        return true;
    }

    // Check conditions for weapon repeats
    for (const pastCondition of conditionsSpun) {
        if (
            // PISTOL CHECKS
            pistolConditionList.includes(pastCondition) &&
            pistolConditionList.includes(targetCondition)
        ) {
            return true;
        } else if (
            // SMG CHECKS
            smgConditionList.includes(pastCondition) &&
            smgConditionList.includes(targetCondition)
        ) {
            return true;
        } else if (
            // ASSAULT RIFLE CHECKS
            assaultRifleConditionList.includes(pastCondition) &&
            assaultRifleConditionList.includes(targetCondition)
        ) {
            return true;
        } else if (
            // SHOTGUN CHECKS
            shotgunConditionList.includes(pastCondition) &&
            shotgunConditionList.includes(targetCondition)
        ) {
            return true;
        } else if (
            // SNIPER CHECKS
            sniperConditionList.includes(pastCondition) &&
            sniperConditionList.includes(targetCondition)
        ) {
            return true;
        }
    }

    const bigWeaponsConditionList = [
        ...assaultRifleConditionList,
        ...shotgunConditionList,
        ...sniperConditionList,
    ];
    const conditionIsBigWeapon =
        bigWeaponsConditionList.includes(targetCondition);

    if (conditionIsBigWeapon) {
        for (const pastCondition of conditionsSpun) {
            const pastConditionIsBigWeapon =
                bigWeaponsConditionList.includes(pastCondition);
            if (pastConditionIsBigWeapon && conditionIsBigWeapon) {
                return true;
            }
        }
    }

    return false;
}

export function CanBeNTKO(target: SpinTarget, condition: string) {
    // Condition check for general unique kills
    if (uniqueKills.includes(condition)) {
        return false;
    }

    // Condition check for target specific unique kills
    const targetSpecificUniqueKills = TargetUniqueKillsList[target];
    if (targetSpecificUniqueKills.includes(condition)) {
        return false;
    }

    if (condition.endsWith("explosive")) {
        return false;
    }

    // Soders can never have NTKO
    if (target === "erich_soders") {
        return false;
    }

    // Penelope no loud NTKO
    if (target === "penelope_graves" && condition.includes("loud")) {
        return false;
    }

    // Dawood no loud NTKO
    if (target === "dawood_rangan" && condition.includes("loud")) {
        return false;
    }

    return true;
}

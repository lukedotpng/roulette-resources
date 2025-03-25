import { Mission, Spin, SpinCheckResult, SpinTarget } from "@/types";
import {
    assaultRifleConditionList,
    explosiveConditionList,
    pistolConditionList,
    shotgunConditionList,
    smgConditionList,
    sniperConditionList,
    SpinMissionTargetsList,
    TargetBannedConditionsList,
    TargetUniqueKillsList,
    uniqueKills,
} from "./SpinGlobals";
import {
    DisguiseIDToDisplayText,
    MethodIDToDisplayText,
    TargetIDToDisplayText,
} from "@/utils/FormattingUtils";

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

        if (targetSpinInfo.condition === "" || targetSpinInfo.disguise === "") {
            continue;
        }

        if (disguisesSpun.includes(targetSpinInfo.disguise)) {
            return {
                legal: false,
                reason: "repeat_disguise",
                reason_info: `The "${DisguiseIDToDisplayText(targetSpinInfo.disguise)}" disguise repeats somewhere in the spin`,
            };
        }

        if (TargetConditionIsBanned(target, targetSpinInfo.condition)) {
            return {
                legal: false,
                reason: "condition_banned",
                reason_info: `${MethodIDToDisplayText(targetSpinInfo.condition)} is banned for ${TargetIDToDisplayText(target)}`,
            };
        }

        const conditionBannedWithDisguise = ConditionIsBannedWithDisguise(
            spin.mission,
            target,
            targetSpinInfo.condition,
            targetSpinInfo.disguise,
        );
        if (conditionBannedWithDisguise.isBanned) {
            return {
                legal: false,
                reason: "condition_banned_with_disguise",
                reason_info: conditionBannedWithDisguise.reason,
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
                    reason_info: `The "${MethodIDToDisplayText(targetSpinInfo.condition)}" kill repeats somewhere in the spin`,
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
                reason_info:
                    "Yuki and Soders cannot both have Explosion/Explosive kills",
            };
        }

        if (targetSpinInfo.ntko) {
            const canBeNTKO = CanBeNTKO(target, targetSpinInfo.condition);
            if (!canBeNTKO.ntkoLegal) {
                return {
                    legal: false,
                    reason: "illegal_ntko",
                    reason_info: canBeNTKO.reason,
                };
            }
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
): { isBanned: boolean; reason: string } {
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
        return {
            isBanned: true,
            reason: `Claus cannot have "${MethodIDToDisplayText(condition)}" with the "Prisoner" disguise. Must be a remote kill`,
        };
    }
    // Bangkok Stalker trap kills check
    if (
        mission === "bangkok" &&
        disguise === "stalker" &&
        !trapKills.includes(condition)
    ) {
        return {
            isBanned: true,
            reason: `"${MethodIDToDisplayText(condition)}" is not allowed with the "Stalker" disguise. Must be a remote kill`,
        };
    }
    // Miami Sierra shoot the car as Moses Lee
    if (
        mission === "miami" &&
        disguise === "moses_lee" &&
        condition === "shoot_the_car"
    ) {
        return {
            isBanned: true,
            reason: `Sierra cannot have the "Shoot The Car" kill with "Moses Lee" disguise`,
        };
    }
    // Dubai Marcus drowning in skydiving suit
    if (
        mission === "dubai" &&
        disguise === "skydiving_suit" &&
        condition === "drowning"
    ) {
        return {
            isBanned: true,
            reason: `Marcus cannot have a "Drowning" kill with the Skydiving Suit disguise`,
        };
    }
    // Isle of Sgail Knights Armor trap kills check
    if (
        mission === "isle_of_sgail" &&
        disguise === "knights_armor" &&
        !trapKills.includes(condition)
    ) {
        return {
            isBanned: true,
            reason: `"${MethodIDToDisplayText(condition)}" is not allowed with the "Knight's Armor" disguise. Must be a remote kill`,
        };
    }

    return {
        isBanned: false,
        reason: "",
    };
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
        } else if (
            explosiveConditionList.includes(pastCondition) &&
            explosiveConditionList.includes(targetCondition)
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

export function CanBeNTKO(
    target: SpinTarget,
    condition: string,
    // Condition check for general unique kills
): { ntkoLegal: boolean; reason: string } {
    if (
        condition === "explosive" ||
        condition === "remote_explosive" ||
        condition === "loud_explosive" ||
        condition === "impact_explosive"
    ) {
        return {
            ntkoLegal: false,
            reason: "Explosive kills cannot have the NTKO complication",
        };
    }

    // Soders can never have NTKO
    if (target === "erich_soders") {
        return {
            ntkoLegal: false,
            reason: "Soders cannot have the NTKO complication",
        };
    }

    // Penelope no loud NTKO
    if (target === "penelope_graves" && condition.includes("loud")) {
        return {
            ntkoLegal: false,
            reason: "Penelope cannot have loud kills with the NTKO complication",
        };
    }

    // Dawood no loud NTKO
    if (target === "dawood_rangan" && condition.includes("loud")) {
        return {
            ntkoLegal: false,
            reason: "Dawood cannot have loud kills with the NTKO complication",
        };
    }

    const allUniqueKills = [...uniqueKills, ...TargetUniqueKillsList[target]];

    if (allUniqueKills.includes(condition)) {
        return {
            ntkoLegal: false,
            reason: "Unique kills can't have the NTKO complication",
        };
    }

    return {
        ntkoLegal: false,
        reason: "",
    };
}

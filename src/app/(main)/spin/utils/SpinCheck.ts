import { Mission } from "@/types";
import {
    DisguiseIDToDisplayText,
    MethodIDToDisplayText,
    TargetIDToDisplayText,
} from "@/utils/FormattingUtils";
import {
    ASSAULT_RIFLE_KILL_METHOD_LIST,
    EXPLOSIVE_KILL_METHOD_LIST,
    LARGE_WEAPON_LIST,
    PISTOL_KILL_METHOD_LIST,
    SHOTGUN_KILL_METHOD_LIST,
    SMG_KILL_METHOD_LIST,
    SNIPER_KILL_METHOD_LIST,
    SPIN_MISSION_TARGETS_LIST,
    TARGET_BANNED_KILL_METHODS_LIST,
    TARGET_UNIQUE_KILLS_LIST,
    UNIQUE_KILLS,
} from "./SpinGlobals";
import { Spin, SpinCheckResult, SpinTarget } from "../types";

export function SpinIsLegal(spin: Spin): SpinCheckResult {
    const spinTargets = SPIN_MISSION_TARGETS_LIST[spin.mission];

    const disguisesSpun: string[] = [];
    const conditionsSpun: string[] = [];

    for (const target of spinTargets) {
        const targetSpinInfo = spin.info[target as SpinTarget];

        if (!targetSpinInfo) {
            return {
                legal: false,
                reason: "error_checking_legality",
            };
        }

        if (
            targetSpinInfo.killMethod === "" ||
            targetSpinInfo.disguise === ""
        ) {
            continue;
        }

        if (disguisesSpun.includes(targetSpinInfo.disguise)) {
            return {
                legal: false,
                reason: "repeat_disguise",
                reason_info: `The "${DisguiseIDToDisplayText(targetSpinInfo.disguise)}" disguise repeats somewhere in the spin`,
            };
        }

        if (TargetKillMethodIsBanned(target, targetSpinInfo.killMethod)) {
            return {
                legal: false,
                reason: "condition_banned",
                reason_info: `${MethodIDToDisplayText(targetSpinInfo.killMethod)} is banned for ${TargetIDToDisplayText(target)}`,
            };
        }

        const conditionBannedWithDisguise = ConditionIsBannedWithDisguise(
            spin.mission,
            target,
            targetSpinInfo.killMethod,
            targetSpinInfo.disguise,
        );
        if (conditionBannedWithDisguise.isBanned) {
            return {
                legal: false,
                reason: "kill_method_banned_with_disguise",
                reason_info: conditionBannedWithDisguise.reason,
            };
        }

        const conditionIsBigWeapon = LARGE_WEAPON_LIST.includes(
            targetSpinInfo.killMethod,
        );

        if (conditionIsBigWeapon) {
            for (const pastKillMethod of conditionsSpun) {
                const pastKillMethodIsBigWeapon =
                    LARGE_WEAPON_LIST.includes(pastKillMethod);
                if (pastKillMethodIsBigWeapon && conditionIsBigWeapon) {
                    return {
                        legal: false,
                        reason: "repeat_kill_method",
                        reason_info: `Cannot have two large firearms in a spin`,
                    };
                }
            }
        }

        if (KillMethodRepeats(targetSpinInfo.killMethod, conditionsSpun)) {
            if (
                targetSpinInfo.killMethod !== "electrocution" ||
                spin.mission !== "hokkaido"
            ) {
                return {
                    legal: false,
                    reason: "repeat_kill_method",
                    reason_info: `The "${MethodIDToDisplayText(targetSpinInfo.killMethod)}" kill repeats somewhere in the spin`,
                };
            }
        }

        if (
            spin.mission === "hokkaido" &&
            ExplosionConditionRepeatsOnHokkaido(
                targetSpinInfo.killMethod,
                conditionsSpun,
            )
        ) {
            return {
                legal: false,
                reason: "repeat_kill_method",
                reason_info:
                    "Yuki and Soders cannot both have Explosion/Explosive kills",
            };
        }

        if (targetSpinInfo.ntko) {
            const canBeNTKO = CanBeNTKO(
                target,
                targetSpinInfo.killMethod,
                targetSpinInfo.disguise,
            );
            if (!canBeNTKO.ntkoLegal) {
                return {
                    legal: false,
                    reason: "illegal_ntko",
                    reason_info: canBeNTKO.reason,
                };
            }
        }

        conditionsSpun.push(targetSpinInfo.killMethod);
        disguisesSpun.push(targetSpinInfo.disguise);
    }

    return {
        legal: true,
    };
}

// Check for basic target specific bans
export function TargetKillMethodIsBanned(
    target: SpinTarget,
    condition: string,
) {
    if (TARGET_BANNED_KILL_METHODS_LIST[target].includes(condition)) {
        return true;
    }

    if (condition === "sacrificial_knife") {
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
        target === "marcus_stuyvesant" &&
        disguise === "skydiving_suit" &&
        condition === "drowning"
    ) {
        return {
            isBanned: true,
            reason: `Marcus cannot have a "Drowning" kill with the Skydiving Suit disguise`,
        };
    }
    // Mumbai Vanya drowning in tailor disguise
    if (
        target === "vanya_shah" &&
        disguise === "tailor" &&
        condition === "drowning"
    ) {
        return {
            isBanned: true,
            reason: `Vanya cannot have a "Drowning" kill with the Tailor disguise`,
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

export function KillMethodRepeats(
    targetKillMethod: string,
    killMethodsSpun: string[],
) {
    // Basic repeat check
    if (killMethodsSpun.includes(targetKillMethod)) {
        return true;
    }

    // Check conditions for weapon repeats
    for (const pastKillMethod of killMethodsSpun) {
        if (
            // PISTOL CHECKS
            PISTOL_KILL_METHOD_LIST.includes(pastKillMethod) &&
            PISTOL_KILL_METHOD_LIST.includes(targetKillMethod)
        ) {
            return true;
        } else if (
            // SMG CHECKS
            SMG_KILL_METHOD_LIST.includes(pastKillMethod) &&
            SMG_KILL_METHOD_LIST.includes(targetKillMethod)
        ) {
            return true;
        } else if (
            // ASSAULT RIFLE CHECKS
            ASSAULT_RIFLE_KILL_METHOD_LIST.includes(pastKillMethod) &&
            ASSAULT_RIFLE_KILL_METHOD_LIST.includes(targetKillMethod)
        ) {
            return true;
        } else if (
            // SHOTGUN CHECKS
            SHOTGUN_KILL_METHOD_LIST.includes(pastKillMethod) &&
            SHOTGUN_KILL_METHOD_LIST.includes(targetKillMethod)
        ) {
            return true;
        } else if (
            // SNIPER CHECKS
            SNIPER_KILL_METHOD_LIST.includes(pastKillMethod) &&
            SNIPER_KILL_METHOD_LIST.includes(targetKillMethod)
        ) {
            return true;
        } else if (
            EXPLOSIVE_KILL_METHOD_LIST.includes(pastKillMethod) &&
            EXPLOSIVE_KILL_METHOD_LIST.includes(targetKillMethod)
        ) {
            return true;
        }
    }

    const conditionIsBigWeapon = LARGE_WEAPON_LIST.includes(targetKillMethod);

    if (conditionIsBigWeapon) {
        for (const pastKillMethod of killMethodsSpun) {
            const pastKillMethodIsBigWeapon =
                LARGE_WEAPON_LIST.includes(pastKillMethod);
            if (pastKillMethodIsBigWeapon && conditionIsBigWeapon) {
                return true;
            }
        }
    }

    return false;
}

export function CanBeNTKO(
    target: SpinTarget,
    killMethod: string,
    disguise: string,
    // Condition check for general unique kills
): { ntkoLegal: boolean; reason: string } {
    if (
        killMethod === "explosive" ||
        killMethod === "remote_explosive" ||
        killMethod === "loud_explosive" ||
        killMethod === "impact_explosive"
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
    if (target === "penelope_graves" && killMethod.includes("loud")) {
        return {
            ntkoLegal: false,
            reason: "Penelope cannot have loud kills with the NTKO complication",
        };
    }

    // Dawood no loud NTKO
    if (target === "dawood_rangan" && killMethod.includes("loud")) {
        return {
            ntkoLegal: false,
            reason: "Dawood cannot have loud kills with the NTKO complication",
        };
    }

    // Marcus no loud NTKO as skydiving suit
    if (
        target === "marcus_stuyvesant" &&
        killMethod.includes("loud") &&
        disguise === "skydiving_suit"
    ) {
        return {
            ntkoLegal: false,
            reason: 'Marcus cannot have loud kills with the NTKO complication in the "Skydiving Suit"',
        };
    }

    // Hush no loud NTKO
    if (target === "hush" && killMethod.includes("loud")) {
        return {
            ntkoLegal: false,
            reason: "Hush cannot have loud kills with the NTKO complication",
        };
    }

    const allUniqueKills = [
        ...UNIQUE_KILLS,
        ...TARGET_UNIQUE_KILLS_LIST[target],
    ];

    if (allUniqueKills.includes(killMethod)) {
        return {
            ntkoLegal: false,
            reason: "Unique kills can't have the NTKO complication",
        };
    }

    return {
        ntkoLegal: true,
        reason: "",
    };
}

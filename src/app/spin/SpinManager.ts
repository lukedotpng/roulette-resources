import {
    ConditionType,
    Mission,
    MissionSpin,
    Spin,
    SpinTarget,
    TargetConditions,
} from "@/types";
import {
    SpinMissionTargetsList,
    MissionSpinInfoList,
    weapons,
    weaponModifierPrefix,
    explosiveModifierPrefix,
    TargetBannedConditionsList,
    pistolConditionList,
    smgConditionList,
    assaultRifleConditionList,
    shotgunConditionList,
    sniperConditionList,
    TargetUniqueKillsList,
} from "./SpinGlobals";

export function GenerateMissionSpin(mission: Mission): MissionSpin {
    const targets = SpinMissionTargetsList[mission];
    const missionSpinInfo = MissionSpinInfoList[mission];

    const disguisesSpun: string[] = [];
    const conditionsSpun: string[] = [];

    const spin: Spin = {};

    targets.forEach((target) => {
        spin[target] = { disguise: "", condition: "", ntko: false };

        const targetDisguise = GenerateDisguise(
            missionSpinInfo.disguises,
            disguisesSpun,
        );
        spin[target].disguise = targetDisguise;
        disguisesSpun.push(targetDisguise);

        const { condition, isNoKO } = GenerateCondition(
            mission,
            missionSpinInfo.conditions,
            target,
            targetDisguise,
            conditionsSpun,
        );
        spin[target].condition = condition;
        spin[target].ntko = isNoKO;
        conditionsSpun.push(condition);
    });

    return { mission: mission, spin: spin };
}

function GenerateCondition(
    mission: Mission,
    conditions: TargetConditions,
    target: SpinTarget,
    disguise: string,
    conditionsSpun: string[],
) {
    let { condition, isNoKO } = GetRandomCondition(target, conditions);

    while (
        !CheckValidCondition(
            condition,
            conditionsSpun,
            mission,
            target,
            disguise,
        )
    ) {
        const res = GetRandomCondition(target, conditions);
        condition = res.condition;
        isNoKO = res.isNoKO;
    }

    return { condition, isNoKO };
}

function GetRandomCondition(target: SpinTarget, conditions: TargetConditions) {
    const conditionTypeList: ConditionType[] = [
        "weapon",
        "unique_kill",
        "melee",
    ];
    let conditionTypeSize = 3;
    // Remove melees if Soders
    if (target === "erich_soders") {
        conditionTypeSize = 2;
    }
    const conditionType: ConditionType =
        conditionTypeList[Math.floor(Math.random() * conditionTypeSize)];

    const customConditions = structuredClone(conditions);

    // Modfiy possible conditions for Soders
    if (target === "erich_soders") {
        customConditions.unique_kill = TargetUniqueKillsList[target];
        // Remove explosive on weapon kill :P
        customConditions.weapon.pop();
    } else {
        customConditions.unique_kill = [
            ...TargetUniqueKillsList[target],
            ...conditions.unique_kill,
        ];
    }

    const conditionsList: string[] = customConditions[conditionType];

    let condition =
        conditionsList[Math.floor(Math.random() * conditionsList.length)];

    if (weapons.includes(condition) && condition !== "explosive") {
        const modifierPrefix =
            weaponModifierPrefix[
                Math.floor(Math.random() * weaponModifierPrefix.length)
            ];

        condition = modifierPrefix + condition;
    } else if (condition === "explosive") {
        const modifierPrefix =
            explosiveModifierPrefix[
                Math.floor(Math.random() * explosiveModifierPrefix.length)
            ];

        condition = modifierPrefix + condition;
    }

    const isNoKO =
        CanAddNTKO(target, condition, conditionType) && Math.random() <= 0.25;

    if (!condition) {
        console.log("TARGET CONDITION:", condition);
        console.log("CONDITIONS LIST:", conditionsList);
        console.log("CONDITIONS TYPE:", conditionType);
        console.log("CUSTOM CONDITIONS:", customConditions);
    }

    return { condition, isNoKO };
}

function CheckValidCondition(
    condition: string,
    conditionsSpun: string[],
    mission: Mission,
    target: SpinTarget,
    disguise: string,
) {
    // Check for basic target specific bans
    if (TargetBannedConditionsList[target].includes(condition)) {
        return false;
    }

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
        return false;
    }
    // Bangkok Stalker trap kills check
    if (
        mission === "bangkok" &&
        disguise === "stalker" &&
        !trapKills.includes(condition)
    ) {
        return false;
    }
    // Miami Sierra shoot the car as Moses Lee
    if (
        mission === "miami" &&
        disguise === "moses_lee" &&
        condition === "shoot_the_car"
    ) {
        return false;
    }
    // Dubai Marcus drowning in skydiving suit
    if (
        mission === "dubai" &&
        disguise === "skydiving_suit" &&
        condition === "drowning"
    ) {
        return false;
    }
    // Isle of Sgail Knights Armor trap kills check
    if (
        mission === "isle_of_sgail" &&
        disguise === "knights_armor" &&
        !trapKills.includes(condition)
    ) {
        return false;
    }

    if (mission === "hokkaido") {
        const hokkadioExplosiveKillTypes = [
            "remote_explosive",
            "loud_remote_explosive",
            "impact_explosive",
            "explosion_accident",
            "explosion",
        ];

        for (let i = 0; i < conditionsSpun.length; i++) {
            if (
                hokkadioExplosiveKillTypes.includes(conditionsSpun[i]) &&
                hokkadioExplosiveKillTypes.includes(condition)
            ) {
                return false;
            }
        }
    }

    // Basic repeat check
    if (conditionsSpun.includes(condition)) {
        return false;
    }

    // Check conditions for weapon repeats
    for (let i = 0; i < conditionsSpun.length; i++) {
        if (
            pistolConditionList.includes(conditionsSpun[i]) &&
            pistolConditionList.includes(condition)
        ) {
            return false;
        }
        if (
            smgConditionList.includes(conditionsSpun[i]) &&
            smgConditionList.includes(condition)
        ) {
            return false;
        }
        if (
            assaultRifleConditionList.includes(conditionsSpun[i]) &&
            assaultRifleConditionList.includes(condition)
        ) {
            return false;
        }
        if (
            shotgunConditionList.includes(conditionsSpun[i]) &&
            shotgunConditionList.includes(condition)
        ) {
            return false;
        }
        if (
            sniperConditionList.includes(conditionsSpun[i]) &&
            sniperConditionList.includes(condition)
        ) {
            return false;
        }
    }

    const bigWeaponsConditionList = [
        ...assaultRifleConditionList,
        ...shotgunConditionList,
        ...sniperConditionList,
    ];
    const conditionIsBigWeapon = bigWeaponsConditionList.includes(condition);
    if (conditionIsBigWeapon) {
        for (let i = 0; i < conditionsSpun.length; i++) {
            const pastConditionIsBigWeapon = bigWeaponsConditionList.includes(
                conditionsSpun[i],
            );
            if (pastConditionIsBigWeapon && conditionIsBigWeapon) {
                return false;
            }
        }
    }

    return true;
}

function CanAddNTKO(
    target: SpinTarget,
    condition: string,
    conditionType: ConditionType,
) {
    // Basic condition check
    if (conditionType !== "melee" && conditionType !== "weapon") {
        return false;
    }
    if (condition.endsWith("explosive")) {
        return false;
    }

    // Soders
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

function GenerateDisguise(
    disguiseList: string[],
    disguisesSpun: string[],
): string {
    let targetDisguise =
        disguiseList[Math.floor(Math.random() * disguiseList.length)];
    while (disguisesSpun.includes(targetDisguise)) {
        targetDisguise =
            disguiseList[Math.floor(Math.random() * disguiseList.length)];
    }

    return targetDisguise;
}

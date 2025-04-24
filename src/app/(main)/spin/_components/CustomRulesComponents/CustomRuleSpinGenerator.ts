import {
    KillMethodType,
    Mission,
    Spin,
    SpinInfo,
    SpinTarget,
    TargetKillMethods,
} from "@/types";
import {
    explosiveModifierPrefix,
    MissionSpinInfoList,
    SpinMissionTargetsList,
    TargetUniqueKillsList,
    weaponModifierPrefix,
    weapons,
} from "../../utils/SpinGlobals";

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
    }

    reorderedTargets.forEach((target) => {
        if (!spinInfo[target]) {
            return;
        }

        const targetDisguise = GetRandomDisguise(spinInfoOptions.disguises);
        spinInfo[target].disguise = targetDisguise;
    });

    reorderedTargets.forEach((target) => {
        if (!spinInfo[target]) {
            return;
        }

        const { killMethod, isNoKO } = GetRandomCondition(
            spinInfoOptions.killMethods,
            target,
        );
        spinInfo[target].killMethod = killMethod;

        spinInfo[target].ntko = isNoKO;
    });

    return { mission: mission, info: spinInfo };
}

function GetRandomDisguise(disguiseList: string[]): string {
    let disguise =
        disguiseList[Math.floor(Math.random() * disguiseList.length)];

    return disguise;
}

function GetRandomCondition(
    killMethods: TargetKillMethods,
    target: SpinTarget,
) {
    // const conditionTypeList: KillMethodType[] = [
    //     "unique_kills",
    //     "weapons",
    //     "melees",
    // ];

    const killMethodOptions = [
        ...killMethods.melees,
        ...killMethods.unique_kills,
        ...killMethods.weapons,
        ...TargetUniqueKillsList[target],
    ];
    // raw = no modifier yet
    let rawKillMethod =
        killMethodOptions[Math.floor(Math.random() * killMethodOptions.length)];
    let killMethod = rawKillMethod;

    // Add "silenced_" , "loud_", or no prefix if condition is a firearm
    if (weapons.includes(killMethod) && killMethod !== "explosive") {
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

    // 1/4 chance to add NTKO if possible, doesnt make sense for Soders
    let isNoKO = false;
    if (target !== "erich_soders") {
        isNoKO = Math.random() <= 0.25;
    }

    return { killMethod, isNoKO };
}

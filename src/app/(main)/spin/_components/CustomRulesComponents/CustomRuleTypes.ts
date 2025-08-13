import { Mission } from "@/types";
import { SpinTarget } from "../../types";

export type CustomKills = {
    melees?: string[];
    weapons?: string[];
    unique_kills?: string[];
};

export type KillsBannedWithDisguise = {
    kills: string[];
    disguise: string;
};
export type TargetRule = {
    bannedKills?: string[];
    bannedKillsWithDisguise?: KillsBannedWithDisguise[];
    remoteForcedDisguises?: string[];
    ntkoBannedKills?: string[];
    customKills?: CustomKills;
};

export type TargetRules = {
    [key in SpinTarget]: TargetRule;
};

export type ConditionCombo = {
    disguises: string[];
    killMethods: string[];
};

export type ConditionComboGroup = {
    combos: ConditionCombo[];
};

export type ConditionRules = {
    global: {
        killMethodsCantRepeat: boolean;
        disguisesCantRepeat: boolean;
        conditionCombosGroupsCantRepeat: ConditionComboGroup[];
    };
    missions: {
        [key in Mission]: {
            conditionCombosGroupsCantRepeat: ConditionComboGroup[];
        };
    };
};

export type GlobalCustomKills = CustomKills;

export type CustomOdds = { NTKO: number };

export type NtkoValidKills = string[];

export type Ruleset = {
    targets: TargetRules;
    conditions: ConditionRules;
    customKills: GlobalCustomKills;
    odds: CustomOdds;
    ntkoValidKills: NtkoValidKills;
    remoteKillMethods: string[];
};

import { Mission } from "@/types";
import { ConditionComboGroup, Ruleset } from "../CustomRuleTypes";
import EditMissionComboGroup from "./EditMissionComboGroup";

export default function MissionScopeRules({
    mission,
    ruleset,
    SetRuleset,
}: {
    mission: Mission;
    ruleset: Ruleset;
    SetRuleset: (updatedRuleset: Ruleset) => void;
}) {
    return (
        <div className="flex flex-col gap-2">
            <EditMissionComboGroup
                mission={mission}
                comboGroups={
                    ruleset.conditions.missions[mission]
                        .conditionCombosGroupsCantRepeat
                }
                UpdateComboGroups={(
                    updatedComboGroups: ConditionComboGroup[],
                ) => {
                    const updatedRuleset = structuredClone(ruleset);

                    updatedRuleset.conditions.missions[
                        mission
                    ].conditionCombosGroupsCantRepeat = updatedComboGroups;

                    SetRuleset(updatedRuleset);
                }}
            />
        </div>
    );
}

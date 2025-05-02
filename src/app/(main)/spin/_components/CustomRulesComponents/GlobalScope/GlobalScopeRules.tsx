import { ConditionComboGroup, Ruleset } from "../CustomRuleTypes";
import EditGlobalComboGroup from "./EditGlobalComboGroup";

export default function GlobalScopeRules({
    ruleset,
    SetRuleset,
}: {
    ruleset: Ruleset;
    SetRuleset: (updatedRuleset: Ruleset) => void;
}) {
    return (
        <div className="flex flex-col gap-2">
            <RuleToggle
                label="Kill Methods Can Repeat"
                isActive={!ruleset.conditions.global.killMethodsCantRepeat}
                ToggleRule={() => {
                    const updatedRuleset = structuredClone(ruleset);
                    updatedRuleset.conditions.global.killMethodsCantRepeat =
                        !updatedRuleset.conditions.global.killMethodsCantRepeat;

                    SetRuleset(updatedRuleset);
                }}
            />
            <RuleToggle
                label="Disguises Can Repeat"
                isActive={!ruleset.conditions.global.disguisesCantRepeat}
                ToggleRule={() => {
                    const updatedRuleset = structuredClone(ruleset);
                    updatedRuleset.conditions.global.disguisesCantRepeat =
                        !updatedRuleset.conditions.global.disguisesCantRepeat;

                    SetRuleset(updatedRuleset);
                }}
            />
            <EditGlobalComboGroup
                comboGroups={
                    ruleset.conditions.global.conditionCombosGroupsCantRepeat
                }
                UpdateComboGroups={(
                    updatedComboGroups: ConditionComboGroup[],
                ) => {
                    const updatedRuleset = structuredClone(ruleset);

                    updatedRuleset.conditions.global.conditionCombosGroupsCantRepeat =
                        updatedComboGroups;

                    SetRuleset(updatedRuleset);
                }}
            />
        </div>
    );
}

function RuleToggle({
    label,
    isActive,
    ToggleRule,
}: {
    label: string;
    isActive: boolean;
    ToggleRule: () => void;
}) {
    return (
        <button
            className="group flex w-fit items-center border-zinc-900 bg-white text-zinc-900"
            onClick={ToggleRule}
            data-active={isActive}
        >
            <div className="mr-1 border-1 border-zinc-900 bg-white p-1 group-data-[active=true]:bg-red-500 sm:border-2 sm:p-2"></div>
            <span className="text-nowrap decoration-red-500 decoration-2 group-hover:underline">
                {label}
            </span>
        </button>
    );
}

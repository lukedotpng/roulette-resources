import { MethodIDToDisplayText } from "@/utils/FormattingUtils";
import { ConditionCombo } from "../CustomRuleTypes";

import { ChangeEvent } from "react";
import { Mission } from "@/types";
import {
    MISSION_DISGUISES_LIST,
    UNIQUE_KILLS,
    WEAPONS_WITH_MODIFIERS,
} from "../../../utils/SpinGlobals";

export default function EditMissionCombo({
    mission,
    comboIndex,
    combo,
    AddKillMethodToCombo,
    RemoveKillMethodFromCombo,
    AddDisguiseToCombo,
    RemoveDisguiseFromCombo,
    DeleteCombo,
}: {
    mission: Mission;
    comboIndex: number;
    combo: ConditionCombo;
    AddKillMethodToCombo: (killMethod: string) => void;
    RemoveKillMethodFromCombo: (killMethod: string) => void;
    AddDisguiseToCombo: (killMethod: string) => void;
    RemoveDisguiseFromCombo: (killMethod: string) => void;
    DeleteCombo: () => void;
}) {
    const missionDisguises = MISSION_DISGUISES_LIST[mission];

    return (
        <div className="flex w-full flex-col items-center">
            <div className="flex w-full items-end">
                <div className="flex-1 border-t-2 border-red-500"></div>
                <p className="group w-20 border-2 border-b-0 border-red-500 px-2 text-center font-bold sm:w-28">
                    {"Combo #" + (comboIndex + 1)}
                </p>
                <div className="flex-1 border-t-2 border-red-500"></div>
            </div>
            <div className="flex w-full flex-col gap-2 p-1">
                {/* KILL METHODS */}
                <div>
                    <select
                        name="killMethod"
                        className="w-fit border-2 border-b-0 border-zinc-900 px-1"
                        defaultValue={"default"}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                            AddKillMethodToCombo(e.currentTarget.value);
                        }}
                    >
                        <option disabled value={"default"} hidden>
                            {"Add Kill..."}
                        </option>
                        <OptionGroup
                            label="Weapons"
                            options={WEAPONS_WITH_MODIFIERS}
                            chosenOptions={combo.killMethods}
                        />
                        <OptionGroup
                            label="Unique Kills"
                            options={UNIQUE_KILLS}
                            chosenOptions={combo.killMethods}
                        />
                    </select>
                    <p className="flex-1 border-2 border-zinc-900 px-1 select-none">
                        {combo.killMethods.length > 0 ? (
                            combo.killMethods.map((killMethod, index) => {
                                return (
                                    <span
                                        key={index}
                                        className="group relative cursor-pointer decoration-red-500 decoration-2 hover:underline"
                                        onClick={() => {
                                            RemoveKillMethodFromCombo(
                                                killMethod,
                                            );
                                        }}
                                    >
                                        {MethodIDToDisplayText(killMethod)}
                                        <span className="group-last:hidden">
                                            {", "}
                                        </span>
                                        <span className="pointer-events-none absolute -top-[50%] -right-0 translate-x-[80%] bg-zinc-900 px-1 text-[.7em] text-white opacity-0 transition-all delay-500 group-hover:opacity-100">
                                            {"Remove"}
                                        </span>
                                    </span>
                                );
                            })
                        ) : (
                            <span>{"..."}</span>
                        )}
                    </p>
                </div>
                {/* DISGUISES */}
                <div>
                    <select
                        name="killMethod"
                        className="w-fit border-2 border-b-0 border-zinc-900 px-1"
                        defaultValue={"default"}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                            AddDisguiseToCombo(e.currentTarget.value);
                        }}
                    >
                        <option disabled value={"default"} hidden>
                            {"Add Disguise..."}
                        </option>
                        <OptionGroup
                            label="Disguises"
                            options={missionDisguises}
                            chosenOptions={combo.disguises}
                        />
                    </select>
                    <p className="flex-1 border-2 border-zinc-900 px-1 select-none">
                        {combo.disguises.length > 0 ? (
                            combo.disguises.map((disguise, index) => {
                                return (
                                    <span
                                        key={index}
                                        className="group relative cursor-pointer decoration-red-500 decoration-2 hover:underline"
                                        onClick={() => {
                                            RemoveDisguiseFromCombo(disguise);
                                        }}
                                    >
                                        {MethodIDToDisplayText(disguise)}
                                        <span className="group-last:hidden">
                                            {", "}
                                        </span>
                                        <span className="pointer-events-none absolute -top-[50%] -right-0 translate-x-[80%] bg-zinc-900 px-1 text-[.7em] text-white opacity-0 transition-all delay-500 group-hover:opacity-100">
                                            {"Remove"}
                                        </span>
                                    </span>
                                );
                            })
                        ) : (
                            <span>{"..."}</span>
                        )}
                    </p>
                </div>
                <button
                    className="group w-fit self-center border-2 border-zinc-900 px-2"
                    aria-label="Delete Combination"
                    onClick={DeleteCombo}
                >
                    <p className="decoration-red-500 decoration-2 group-hover:underline">
                        {"Delete Combo"}
                    </p>
                </button>
            </div>
        </div>
    );
}

function OptionGroup({
    label,
    options,
    chosenOptions,
}: {
    label: string;
    options: string[];
    chosenOptions: string[];
}) {
    return (
        <optgroup label={label}>
            {options.map((option) => {
                return (
                    <option
                        key={option}
                        value={option}
                        disabled={chosenOptions.includes(option)}
                    >
                        {MethodIDToDisplayText(option)}
                    </option>
                );
            })}
        </optgroup>
    );
}

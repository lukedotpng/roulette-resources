import { MethodIDToDisplayText } from "@/utils/FormattingUtils";
import { ConditionCombo } from "../CustomRuleTypes";
import { uniqueKills, weaponsWithModifiers } from "../../../utils/SpinGlobals";
import { ChangeEvent } from "react";

export default function EditGlobalCombo({
    comboIndex,
    combo,
    AddKillMethodToCombo,
    RemoveKillMethodFromCombo,
    DeleteCombo,
}: {
    comboIndex: number;
    combo: ConditionCombo;
    AddKillMethodToCombo: (killMethod: string) => void;
    RemoveKillMethodFromCombo: (killMethod: string) => void;
    DeleteCombo: () => void;
}) {
    return (
        <div className="flex w-full flex-col">
            <div className="flex w-full items-end">
                <div className="flex-1 border-t-2 border-red-500"></div>
                <p className="group w-20 border-2 border-b-0 border-red-500 px-2 text-center font-bold sm:w-28">
                    {"Combo #" + (comboIndex + 1)}
                </p>
                <div className="flex-1 border-t-2 border-red-500"></div>
            </div>
            <div className="flex w-full flex-col gap-2 p-1">
                <div>
                    <select
                        name="killMethod"
                        className="border-2 border-b-0 border-zinc-900 px-1"
                        defaultValue={"default"}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                            AddKillMethodToCombo(e.currentTarget.value);
                        }}
                    >
                        <option disabled value={"default"} hidden>
                            {"Add Kill..."}
                        </option>
                        <KillMethodOptionGroup
                            label="Weapons"
                            killMethods={[
                                "ALL_WEAPONS",
                                ...weaponsWithModifiers,
                            ]}
                            combo={combo}
                        />
                        <KillMethodOptionGroup
                            label="Unique Kills"
                            killMethods={["ALL_UNIQUE_KILLS", ...uniqueKills]}
                            combo={combo}
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
                                        <span className="pointer-events-none absolute -top-[50%] -right-0 translate-x-[80%] bg-zinc-900 px-1 text-[.7em] text-white opacity-0 transition-all delay-100 group-hover:opacity-100">
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

function KillMethodOptionGroup({
    label,
    killMethods,
    combo,
}: {
    label: string;
    killMethods: string[];
    combo: ConditionCombo;
}) {
    return (
        <optgroup label={label}>
            {killMethods.map((killMethod) => {
                return (
                    <option
                        key={killMethod}
                        value={killMethod}
                        disabled={combo.killMethods.includes(killMethod)}
                    >
                        {MethodIDToDisplayText(killMethod)}
                    </option>
                );
            })}
        </optgroup>
    );
}

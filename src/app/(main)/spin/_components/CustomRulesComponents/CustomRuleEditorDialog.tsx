import {
    Dialog,
    DialogContent,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
    DialogTrigger,
} from "@radix-ui/react-dialog";
import { ChangeEvent, useState } from "react";
import { ImprovRuleset, RouletteRivalsRuleset } from "./CustomRuleManager";
import { MISSIONS } from "@/utils/globals";
import { MissionIDToDisplayText } from "@/utils/FormattingUtils";
import GlobalScopeRules from "./GlobalScope/GlobalScopeRules";
import { Ruleset } from "./CustomRuleTypes";
import MissionScopeRules from "./MissionScope/MissionScopeRules";
import { Mission } from "@/types";

export default function CustomRuleEditorDialog({
    ruleset,
    SetRuleset,
}: {
    ruleset: Ruleset;
    SetRuleset: (updatedRuleset: Ruleset) => void;
}) {
    const [currentScope, setCurrentScope] = useState("global");

    return (
        <Dialog>
            <DialogTrigger
                aria-label="Edit Rules"
                className="group aspect-square h-full bg-white text-zinc-900 hover:bg-red-500"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                    className="h-[.875rem] w-full fill-zinc-900 group-hover:fill-white sm:h-[1.5rem]"
                >
                    {/* Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2024 Fonticons, Inc. */}
                    <path d="M0 96C0 43 43 0 96 0L384 0l32 0c17.7 0 32 14.3 32 32l0 320c0 17.7-14.3 32-32 32l0 64c17.7 0 32 14.3 32 32s-14.3 32-32 32l-32 0L96 512c-53 0-96-43-96-96L0 96zM64 416c0 17.7 14.3 32 32 32l256 0 0-64L96 384c-17.7 0-32 14.3-32 32zM320 112c0-35.3-35.8-64-80-64s-80 28.7-80 64c0 20.9 12.6 39.5 32 51.2l0 12.8c0 8.8 7.2 16 16 16l64 0c8.8 0 16-7.2 16-16l0-12.8c19.4-11.7 32-30.3 32-51.2zM208 96a16 16 0 1 1 0 32 16 16 0 1 1 0-32zm48 16a16 16 0 1 1 32 0 16 16 0 1 1 -32 0zM134.3 209.3c-8.1-3.5-17.5 .3-21 8.4s.3 17.5 8.4 21L199.4 272l-77.7 33.3c-8.1 3.5-11.9 12.9-8.4 21s12.9 11.9 21 8.4L240 289.4l105.7 45.3c8.1 3.5 17.5-.3 21-8.4s-.3-17.5-8.4-21L280.6 272l77.7-33.3c8.1-3.5 11.9-12.9 8.4-21s-12.9-11.9-21-8.4L240 254.6 134.3 209.3z" />
                </svg>
            </DialogTrigger>
            <DialogPortal>
                <DialogOverlay className="fixed inset-0 bg-zinc-900 opacity-80" />
                <DialogContent className="fixed top-1/2 left-1/2 h-[30rem] max-h-[70%] w-[45rem] max-w-[90%] -translate-x-1/2 -translate-y-1/2 overflow-scroll rounded-lg bg-white text-zinc-900 sm:max-h-[90%]">
                    <div className="flex items-center justify-between p-4">
                        <DialogTitle className="w-28 text-left text-base font-bold sm:w-36 sm:text-xl">
                            {`Edit Rules`}
                        </DialogTitle>
                        <select
                            className="border-2 border-zinc-900 px-1 decoration-red-500 decoration-2 hover:underline"
                            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                setCurrentScope(e.currentTarget.value);
                            }}
                        >
                            <option value={"global"}>{"Global"}</option>
                            <optgroup label="Missions">
                                {MISSIONS.map((scope) => {
                                    return (
                                        <option key={scope} value={scope}>
                                            {MissionIDToDisplayText(scope)}
                                        </option>
                                    );
                                })}
                            </optgroup>
                        </select>
                        <select
                            className="border-2 border-zinc-900 px-1 decoration-red-500 decoration-2 hover:underline"
                            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                switch (e.currentTarget.value) {
                                    case "rouletterivals":
                                        SetRuleset(
                                            structuredClone(
                                                RouletteRivalsRuleset,
                                            ),
                                        );
                                        break;
                                    case "improv":
                                        SetRuleset(
                                            structuredClone(ImprovRuleset),
                                        );
                                        break;
                                    default:
                                        break;
                                }
                                e.currentTarget.value = "default";
                            }}
                            defaultValue={"default"}
                        >
                            <option value={"default"} disabled hidden>
                                {"Load Preset"}
                            </option>
                            <option value={"rouletterivals"}>
                                {"Current RR Rules"}
                            </option>
                            <option value={"improv"}>{"Improv Rules"}</option>
                        </select>
                    </div>
                    <section className="flex w-full pb-2">
                        <main className="flex flex-1 flex-col px-3 sm:px-10">
                            {currentScope === "global" ? (
                                <GlobalScopeRules
                                    ruleset={ruleset}
                                    SetRuleset={SetRuleset}
                                />
                            ) : (
                                <MissionScopeRules
                                    mission={currentScope as Mission}
                                    ruleset={ruleset}
                                    SetRuleset={SetRuleset}
                                />
                            )}
                        </main>
                    </section>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}

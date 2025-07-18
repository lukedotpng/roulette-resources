import { Mission } from "@/types";
import { ConditionComboGroup } from "../CustomRuleTypes";
import EditMissionCombo from "./EditMissionCombo";
import {
    MISSION_SPIN_INFO_LIST,
    UNIQUE_KILLS,
    WEAPONS_WITH_MODIFIERS,
} from "../../../utils/SpinGlobals";

export default function EditMissionComboGroup({
    mission,
    comboGroups,
    UpdateComboGroups,
}: {
    mission: Mission;
    comboGroups: ConditionComboGroup[];
    UpdateComboGroups: (updatedComboGroups: ConditionComboGroup[]) => void;
}) {
    function AddKillMethodToCombo(
        killMethod: string,
        groupIndex: number,
        comboIndex: number,
    ) {
        const updatedComboGroups = [...comboGroups];

        if (
            killMethod === "ALL_UNIQUE_KILLS" ||
            killMethod === "ALL_MELEES" ||
            killMethod === "ALL_WEAPONS"
        ) {
            let batchKills = [];
            switch (killMethod) {
                case "ALL_UNIQUE_KILLS":
                    batchKills = UNIQUE_KILLS;
                case "ALL_MELEES":
                    batchKills =
                        MISSION_SPIN_INFO_LIST[mission].killMethods.melees;
                case "ALL_WEAPONS":
                    batchKills = WEAPONS_WITH_MODIFIERS;
            }
            const filteredBatchKills = [];
            for (const kill of batchKills) {
                if (
                    !comboGroups[groupIndex].combos[
                        comboIndex
                    ].killMethods.includes(kill)
                ) {
                    filteredBatchKills.push(kill);
                }
            }

            updatedComboGroups[groupIndex].combos[comboIndex].killMethods = [
                ...updatedComboGroups[groupIndex].combos[comboIndex]
                    .killMethods,
                ...filteredBatchKills,
            ];
        } else {
            if (
                comboGroups[groupIndex].combos[comboIndex].killMethods.includes(
                    killMethod,
                )
            ) {
                return;
            }

            updatedComboGroups[groupIndex].combos[comboIndex].killMethods.push(
                killMethod,
            );
        }

        UpdateComboGroups(updatedComboGroups);
    }
    function RemoveKillMethodFromCombo(
        killMethod: string,
        groupIndex: number,
        comboIndex: number,
    ) {
        const updatedComboGroups = [...comboGroups];

        updatedComboGroups[groupIndex].combos[comboIndex].killMethods =
            updatedComboGroups[groupIndex].combos[
                comboIndex
            ].killMethods.filter((currKillMethod) => {
                return currKillMethod !== killMethod;
            });

        UpdateComboGroups(updatedComboGroups);
    }

    function AddDisguiseToCombo(
        disguise: string,
        groupIndex: number,
        comboIndex: number,
    ) {
        if (
            comboGroups[groupIndex].combos[comboIndex].disguises.includes(
                disguise,
            )
        ) {
            return;
        }

        const updatedComboGroups = [...comboGroups];
        updatedComboGroups[groupIndex].combos[comboIndex].disguises.push(
            disguise,
        );

        UpdateComboGroups(updatedComboGroups);
    }
    function RemoveDisguiseFromCombo(
        disguise: string,
        groupIndex: number,
        comboIndex: number,
    ) {
        const updatedComboGroups = [...comboGroups];

        updatedComboGroups[groupIndex].combos[comboIndex].disguises =
            updatedComboGroups[groupIndex].combos[comboIndex].disguises.filter(
                (currDisguise) => {
                    return currDisguise !== disguise;
                },
            );

        UpdateComboGroups(updatedComboGroups);
    }

    return (
        <div className="flex w-full flex-col items-start gap-3">
            {comboGroups.map((comboGroup, groupIndex) => {
                return (
                    <div
                        key={groupIndex}
                        className="flex w-full flex-col items-start gap-4 border-2 border-zinc-900 p-2"
                    >
                        <div className="flex w-full items-center gap-2">
                            <h2 className="flex-1 font-bold">
                                {"Group #" + (groupIndex + 1)}
                            </h2>
                            <button
                                className="group"
                                aria-label="Delete Group"
                                onClick={() => {
                                    const updatedComboGroups =
                                        comboGroups.filter((_, index) => {
                                            return groupIndex !== index;
                                        });

                                    UpdateComboGroups(updatedComboGroups);
                                }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 448 512"
                                    className="h-3 w-3 fill-zinc-900 group-hover:fill-red-500 sm:h-4 sm:w-4"
                                >
                                    {/* Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2024 Fonticons, Inc. */}
                                    <path d="M170.5 51.6L151.5 80l145 0-19-28.4c-1.5-2.2-4-3.6-6.7-3.6l-93.7 0c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80 368 80l48 0 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-8 0 0 304c0 44.2-35.8 80-80 80l-224 0c-44.2 0-80-35.8-80-80l0-304-8 0c-13.3 0-24-10.7-24-24S10.7 80 24 80l8 0 48 0 13.8 0 36.7-55.1C140.9 9.4 158.4 0 177.1 0l93.7 0c18.7 0 36.2 9.4 46.6 24.9zM80 128l0 304c0 17.7 14.3 32 32 32l224 0c17.7 0 32-14.3 32-32l0-304L80 128zm80 64l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16z" />
                                </svg>
                            </button>
                        </div>
                        {comboGroup.combos.map((combo, comboIndex) => {
                            return (
                                <EditMissionCombo
                                    key={comboIndex}
                                    comboIndex={comboIndex}
                                    mission={mission}
                                    combo={combo}
                                    AddKillMethodToCombo={(
                                        killMethod: string,
                                    ) => {
                                        AddKillMethodToCombo(
                                            killMethod,
                                            groupIndex,
                                            comboIndex,
                                        );
                                    }}
                                    RemoveKillMethodFromCombo={(
                                        killMethod: string,
                                    ) => {
                                        RemoveKillMethodFromCombo(
                                            killMethod,
                                            groupIndex,
                                            comboIndex,
                                        );
                                    }}
                                    AddDisguiseToCombo={(disguise: string) => {
                                        AddDisguiseToCombo(
                                            disguise,
                                            groupIndex,
                                            comboIndex,
                                        );
                                    }}
                                    RemoveDisguiseFromCombo={(
                                        disguise: string,
                                    ) => {
                                        RemoveDisguiseFromCombo(
                                            disguise,
                                            groupIndex,
                                            comboIndex,
                                        );
                                    }}
                                    DeleteCombo={() => {
                                        const updatedComboGroups = [
                                            ...comboGroups,
                                        ];

                                        updatedComboGroups[groupIndex].combos =
                                            updatedComboGroups[
                                                groupIndex
                                            ].combos.filter((_, index) => {
                                                return comboIndex !== index;
                                            });

                                        UpdateComboGroups(updatedComboGroups);
                                    }}
                                />
                            );
                        })}
                        <button
                            className="border-2 border-zinc-900 px-1 decoration-red-500 decoration-2 hover:underline"
                            onClick={() => {
                                const updatedComboGroups = [...comboGroups];
                                updatedComboGroups[groupIndex].combos.push({
                                    disguises: [],
                                    killMethods: [],
                                });
                                UpdateComboGroups(updatedComboGroups);
                            }}
                        >
                            {"Add New Combination"}
                        </button>
                    </div>
                );
            })}
            <button
                className="m-auto border-2 border-zinc-900 px-1 decoration-red-500 decoration-2 hover:underline"
                onClick={() => {
                    const updatedComboGroups = [...comboGroups];
                    updatedComboGroups.push({
                        combos: [{ disguises: [], killMethods: [] }],
                    });
                    UpdateComboGroups(updatedComboGroups);
                }}
            >
                {"Add New Combination Group"}
            </button>
        </div>
    );
}

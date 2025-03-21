"use client";

import {
    Mission,
    Spin,
    SpinIllegalReason,
    SpinStats,
    SpinTarget,
} from "@/types";
import { useState } from "react";
import { GenerateSpin } from "../utils/SpinGenerationUtils";
import { TargetIDToDisplayText } from "@/utils/FormattingUtils";
import {
    largeWeaponsList,
    MissionSpinInfoList,
    SpinMissionTargetsList,
    TargetUniqueKillsList,
    uniqueKills,
    weaponsWithModifiers,
} from "../utils/SpinGlobals";
import { SpinIsLegal } from "../utils/SpinCheckUtils";
import MissionSwitcher from "../_components/MissionSwitcher";

export default function Page() {
    const spinCount = 100000;
    const [mission, setMission] = useState<Mission>("paris");
    const [spinStats, setSpinStats] = useState<SpinStats>();
    const [legalSpinCount, setLegalSpinCount] = useState(0);
    const [illegalSpinReasons, setIllegalSpinReasons] = useState<
        SpinIllegalReason[]
    >([]);

    function HandleMissionSwitch(newMission: Mission) {
        setMission(newMission);
    }

    function GenerateStats() {
        const spinList: Spin[] = [];
        const targets = SpinMissionTargetsList[mission];
        const currSpinStats: SpinStats = {};
        let currLegalSpinCount = 0;
        const currIllegalSpinReasons: SpinIllegalReason[] = [];

        for (const target of targets) {
            currSpinStats[target] = {
                meleesCount: 0,
                uniqueKillsCount: 0,
                weaponsCount: 0,
                largeWeaponCount: 0,
                ntkoCount: 0,
            };
        }

        console.time("STATS GEN");
        for (let i = 0; i < spinCount; i++) {
            const spin = GenerateSpin(mission);

            for (const target of targets) {
                const targetSpinInfo = spin.info[target];
                if (!targetSpinInfo || !currSpinStats[target]) {
                    break;
                }

                if (largeWeaponsList.includes(targetSpinInfo.condition)) {
                    currSpinStats[target].largeWeaponCount++;
                }

                if (targetSpinInfo.ntko) {
                    currSpinStats[target].ntkoCount++;
                }

                const missionMelees = [
                    ...MissionSpinInfoList[mission].conditions.melees,
                ];
                const targetUniqueKills = [...TargetUniqueKillsList[target]];

                if (missionMelees.includes(targetSpinInfo.condition)) {
                    currSpinStats[target].meleesCount++;
                }
                if (
                    uniqueKills.includes(targetSpinInfo.condition) ||
                    targetUniqueKills.includes(targetSpinInfo.condition)
                ) {
                    currSpinStats[target].uniqueKillsCount++;
                }
                if (weaponsWithModifiers.includes(targetSpinInfo.condition)) {
                    currSpinStats[target].weaponsCount++;
                }
            }

            const res = SpinIsLegal(spin);

            if (!res.legal) {
                if (res.reason) {
                    console.log(res.reason);
                    console.log(spin.info);
                    console.log("================");
                    currIllegalSpinReasons.push(res.reason);
                }
                currLegalSpinCount++;
            }
            spinList.push(spin);
        }
        console.timeEnd("STATS GEN");

        setLegalSpinCount(currLegalSpinCount);
        setIllegalSpinReasons(currIllegalSpinReasons);
        setSpinStats(currSpinStats);
    }

    function GetPercent(count: number): string {
        return ((count / spinCount) * 100).toFixed(3);
    }

    return (
        <main className="my-4 flex w-full flex-col items-center gap-4 text-sm text-white">
            <MissionSwitcher
                currentMission={mission}
                HandleMissionSwitch={HandleMissionSwitch}
            />
            <button
                onClick={() => {
                    GenerateStats();
                }}
                className="bg-white px-4 py-2 text-zinc-900 hover:bg-red-500 hover:text-white"
            >
                {"Generate Stats"}
            </button>
            {spinStats !== undefined && (
                <table className="border-collapse border-2 border-white">
                    <thead>
                        <tr className="border-collapse border-2 border-white">
                            <th className="border-collapse border-2 border-white px-4">
                                {"Target"}
                            </th>
                            <th className="border-collapse border-2 border-white px-4">
                                {"Melee %"}
                            </th>
                            <th className="border-collapse border-2 border-white px-4">
                                {"Unique Kill %"}
                            </th>
                            <th className="border-collapse border-2 border-white px-4">
                                {"Weapon %"}
                            </th>
                            <th className="border-collapse border-2 border-white px-4">
                                {"Large Weapon %"}
                            </th>
                            <th className="border-collapse border-2 border-white px-4">
                                {"NTKO %"}
                            </th>
                        </tr>
                    </thead>
                    {(Object.keys(spinStats) as SpinTarget[]).map((target) => {
                        const targetSpinStats = spinStats[target];
                        if (!targetSpinStats) {
                            return;
                        }

                        return (
                            <tbody key={target}>
                                <tr className="border-collapse border-2 border-white">
                                    <th className="border-collapse border-2 border-white font-normal">
                                        {TargetIDToDisplayText(target)}
                                    </th>
                                    <th className="border-collapse border-2 border-white font-normal">
                                        {GetPercent(
                                            targetSpinStats.meleesCount,
                                        )}
                                    </th>
                                    <th className="border-collapse border-2 border-white font-normal">
                                        {GetPercent(
                                            targetSpinStats.uniqueKillsCount,
                                        )}
                                    </th>
                                    <th className="border-collapse border-2 border-white font-normal">
                                        {GetPercent(
                                            targetSpinStats.weaponsCount,
                                        )}
                                    </th>
                                    <th className="border-collapse border-2 border-white font-normal">
                                        {GetPercent(
                                            targetSpinStats.largeWeaponCount,
                                        )}
                                    </th>
                                    <th className="border-collapse border-2 border-white font-normal">
                                        {GetPercent(targetSpinStats.ntkoCount)}
                                    </th>
                                </tr>
                            </tbody>
                        );
                    })}
                </table>
            )}
            {legalSpinCount > 0 && (
                <>
                    <h1>
                        <span>{"Illegal Spin % "}</span>
                        {GetPercent(legalSpinCount)}
                    </h1>
                    <h1>
                        <span>{"Repeated Condition: "}</span>
                        <span>
                            {GetPercent(
                                FilteredIllegalSpinReasons(
                                    illegalSpinReasons,
                                    "repeat_condition",
                                ).length,
                            )}
                        </span>
                    </h1>
                    <h1>
                        <span>{"Repeat Disguise: "}</span>
                        <span>
                            {GetPercent(
                                FilteredIllegalSpinReasons(
                                    illegalSpinReasons,
                                    "repeat_disguise",
                                ).length,
                            )}
                        </span>
                    </h1>
                    <h1>
                        <span>{"Condition Banned: "}</span>
                        <span>
                            {GetPercent(
                                FilteredIllegalSpinReasons(
                                    illegalSpinReasons,
                                    "condition_banned",
                                ).length,
                            )}
                        </span>
                    </h1>
                    <h1>
                        <span>{"Condition Banned With Disguise: "}</span>
                        <span>
                            {GetPercent(
                                FilteredIllegalSpinReasons(
                                    illegalSpinReasons,
                                    "condition_banned_with_disguise",
                                ).length,
                            )}
                        </span>
                    </h1>
                    <h1>
                        <span>{"Illegal NTKO: "}</span>
                        <span>
                            {GetPercent(
                                FilteredIllegalSpinReasons(
                                    illegalSpinReasons,
                                    "illegal_ntko",
                                ).length,
                            )}
                        </span>
                    </h1>
                </>
            )}
        </main>
    );
}

function FilteredIllegalSpinReasons(
    illegalSpinReasons: SpinIllegalReason[],
    reasonToFilter: SpinIllegalReason,
) {
    return illegalSpinReasons.filter((reason) => {
        return reason === reasonToFilter;
    });
}

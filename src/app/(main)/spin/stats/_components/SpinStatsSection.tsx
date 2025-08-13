import { Mission } from "@/types";
import { useEffect, useState } from "react";
import { SpinIsLegal } from "../../utils/SpinCheck";
import SpinStatsTable from "./SpinStatsTable";
import {
    LARGE_WEAPON_LIST,
    MISSION_SPIN_INFO_LIST,
    SPIN_MISSION_TARGETS_LIST,
    TARGET_UNIQUE_KILLS_LIST,
    UNIQUE_KILLS,
    WEAPONS_WITH_MODIFIERS,
} from "../../utils/SpinGlobals";
import { Spin, SpinStats } from "../../types";

export default function SpinStatsSection({
    mission,
    title,
    GenerateSpin,
}: {
    mission: Mission;
    title: string;
    GenerateSpin: (mission: Mission) => Spin;
}) {
    const [genTime, setGenTime] = useState(0);
    const [totalGenTime, setTotalGenTime] = useState(0);
    const [totalSpins, setTotalSpins] = useState(0);
    const [spinStats, setSpinStats] = useState<SpinStats>();

    useEffect(() => {
        setGenTime(0);
        setTotalSpins(0);
        setTotalGenTime(0);
        setSpinStats(undefined);
    }, [mission]);

    function GenerateStats() {
        const spinList: Spin[] = [];
        const targets = SPIN_MISSION_TARGETS_LIST[mission];
        const currSpinStats: SpinStats = {
            count: 100000,
            illegalSpinCount: 0,
            targets: {},
        };
        let currIllegalSpinCount = 0;

        for (const target of targets) {
            currSpinStats.targets[target] = {
                meleesCount: 0,
                uniqueKillsCount: 0,
                weaponsCount: 0,
                largeWeaponCount: 0,
                trapKillCount: 0,
                ntkoCount: 0,
                disguises: {},
                killMethods: {},
            };
        }

        const startTime = window.performance.now();
        for (let i = 0; i < currSpinStats.count; i++) {
            const spin = GenerateSpin(mission);

            spinList.push(spin);
        }
        const endTime = window.performance.now();

        for (const spin of spinList) {
            for (const target of targets) {
                const targetSpinInfo = spin.info[target];
                if (!targetSpinInfo || !currSpinStats.targets[target]) {
                    break;
                }

                const trapKills = [
                    "explosion_accident",
                    "consumed_poison",
                    "fire",
                    "electrocution",
                    "remote_explosive",
                ];
                if (
                    trapKills.includes(targetSpinInfo.killMethod) &&
                    target !== "erich_soders"
                ) {
                    currSpinStats.targets[target].trapKillCount++;
                }

                if (LARGE_WEAPON_LIST.includes(targetSpinInfo.killMethod)) {
                    currSpinStats.targets[target].largeWeaponCount++;
                }

                if (targetSpinInfo.ntko) {
                    currSpinStats.targets[target].ntkoCount++;
                }

                const missionMelees = [
                    ...MISSION_SPIN_INFO_LIST[mission].killMethods.melees,
                ];
                const targetUniqueKills = [...TARGET_UNIQUE_KILLS_LIST[target]];

                if (missionMelees.includes(targetSpinInfo.killMethod)) {
                    currSpinStats.targets[target].meleesCount++;
                }
                if (
                    UNIQUE_KILLS.includes(targetSpinInfo.killMethod) ||
                    targetUniqueKills.includes(targetSpinInfo.killMethod)
                ) {
                    currSpinStats.targets[target].uniqueKillsCount++;
                }
                if (
                    WEAPONS_WITH_MODIFIERS.includes(targetSpinInfo.killMethod)
                ) {
                    currSpinStats.targets[target].weaponsCount++;
                }

                if (
                    currSpinStats.targets[target].disguises[
                        targetSpinInfo.disguise
                    ]
                ) {
                    currSpinStats.targets[target].disguises[
                        targetSpinInfo.disguise
                    ].count++;
                } else {
                    currSpinStats.targets[target].disguises[
                        targetSpinInfo.disguise
                    ] = { disguise: targetSpinInfo.disguise, count: 0 };
                }

                if (
                    currSpinStats.targets[target].killMethods[
                        targetSpinInfo.killMethod
                    ]
                ) {
                    currSpinStats.targets[target].killMethods[
                        targetSpinInfo.killMethod
                    ].count++;
                } else {
                    currSpinStats.targets[target].killMethods[
                        targetSpinInfo.killMethod
                    ] = { method: targetSpinInfo.killMethod, count: 0 };
                }
            }

            const res = SpinIsLegal(spin);

            if (!res.legal) {
                console.log(res.reason_info);
                currIllegalSpinCount++;
            }
        }

        setGenTime(endTime - startTime);
        setTotalGenTime(totalGenTime + endTime - startTime);
        setTotalSpins(totalSpins + 1);
        currSpinStats.illegalSpinCount = currIllegalSpinCount;
        setSpinStats(currSpinStats);
    }

    return (
        <section className="flex w-full flex-col items-center gap-4 border-2 py-2">
            <h2 className="font-bold">{title}</h2>
            <button
                onClick={() => {
                    GenerateStats();
                }}
                className="bg-white px-4 py-2 text-zinc-900 hover:bg-red-500 hover:text-white"
            >
                {"Generate Stats"}
            </button>
            {spinStats !== undefined && (
                <div className="flex w-full max-w-[35rem] flex-col items-center gap-4">
                    <SpinStatsTable stats={spinStats} mission={mission} />
                    <div className="flex flex-col items-center gap-2">
                        <h2>{`${spinStats.illegalSpinCount} / ${spinStats.count.toLocaleString()} spins were illegal`}</h2>
                        <h2>{`${genTime}ms to generate ${spinStats.count.toLocaleString()} spins`}</h2>
                        <h2>{`Average of ${(totalGenTime / totalSpins).toFixed(2)}ms over ${(totalSpins * spinStats.count).toLocaleString()} spins`}</h2>
                    </div>
                </div>
            )}
        </section>
    );
}

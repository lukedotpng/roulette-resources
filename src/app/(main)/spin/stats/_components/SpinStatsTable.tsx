import { Mission, SpinStats, SpinTarget, TargetSpinStats } from "@/types";
import {
    DisguiseIDToDisplayText,
    MethodIDToDisplayText,
    TargetIDToDisplayText,
} from "@/utils/FormattingUtils";
import { useState } from "react";
import {
    MISSION_SPIN_INFO_LIST,
    SPIN_MISSION_TARGETS_LIST,
    TARGET_UNIQUE_KILLS_LIST,
    WEAPONS_WITH_MODIFIERS,
} from "../../utils/SpinGlobals";

export default function SpinStatsTable({
    stats,
    mission,
}: {
    stats: SpinStats;
    mission: Mission;
}) {
    const [disguisesActive, setDisguisesActive] = useState(false);
    const [uniqueKillsActive, setUniqueKillsActive] = useState(false);
    const [weaponsActive, setWeaponsActive] = useState(false);
    const [meleesActive, setMeleesActive] = useState(false);

    const disguises = MISSION_SPIN_INFO_LIST[mission].disguises;
    const melees = MISSION_SPIN_INFO_LIST[mission].killMethods.melees;
    let uniqueKills = MISSION_SPIN_INFO_LIST[mission].killMethods.unique_kills;
    const targets = SPIN_MISSION_TARGETS_LIST[mission];
    for (const target of targets) {
        uniqueKills = [...uniqueKills, ...TARGET_UNIQUE_KILLS_LIST[target]];
    }
    const weapons = [...WEAPONS_WITH_MODIFIERS];

    return (
        <table className="max-h-96 w-full overflow-y-scroll text-inherit">
            <thead>
                <tr className="w-full border-collapse border-2 border-white">
                    <th className="w-48 border-collapse border-2 border-t-transparent border-l-transparent"></th>
                    {Object.keys(stats.targets as SpinTarget[]).map(
                        (target) => {
                            return (
                                <th
                                    key={target}
                                    className="border-collapse border-2 border-white bg-zinc-900 px-2 py-1"
                                >
                                    {TargetIDToDisplayText(target)}
                                </th>
                            );
                        },
                    )}
                </tr>
            </thead>
            <tbody className="bg-zinc-900">
                <TargetStatsRow category="meleesCount" stats={stats} />
                <TargetStatsRow category="uniqueKillsCount" stats={stats} />
                <TargetStatsRow category="weaponsCount" stats={stats} />
                <TargetStatsRow category="largeWeaponCount" stats={stats} />
                <TargetStatsRow category="trapKillCount" stats={stats} />
                <TargetStatsRow category="ntkoCount" stats={stats} />
                <tr
                    className="cursor-pointer"
                    onClick={() => setDisguisesActive(!disguisesActive)}
                >
                    <th
                        data-open={disguisesActive}
                        className="border-collapse border-2 py-1 data-[open=false]:after:content-['...']"
                        colSpan={targets.length + 1}
                    >
                        {"Disguises"}
                    </th>
                </tr>
                {disguisesActive && (
                    <DisguisesStatsRow stats={stats} disguises={disguises} />
                )}
                <tr
                    className="cursor-pointer"
                    onClick={() => setUniqueKillsActive(!uniqueKillsActive)}
                >
                    <th
                        data-open={uniqueKillsActive}
                        className="border-collapse border-2 py-1 data-[open=false]:after:content-['...']"
                        colSpan={targets.length + 1}
                    >
                        {"Unique Kills"}
                    </th>
                </tr>
                {uniqueKillsActive && (
                    <KillMethodStatsRow
                        stats={stats}
                        killMethods={uniqueKills}
                    />
                )}
                <tr
                    className="cursor-pointer"
                    onClick={() => setWeaponsActive(!weaponsActive)}
                >
                    <th
                        data-open={weaponsActive}
                        className="border-collapse border-2 py-1 data-[open=false]:after:content-['...']"
                        colSpan={targets.length + 1}
                    >
                        {"Weapons"}
                    </th>
                </tr>
                {weaponsActive && (
                    <KillMethodStatsRow stats={stats} killMethods={weapons} />
                )}
                <tr
                    className="cursor-pointer"
                    onClick={() => setMeleesActive(!meleesActive)}
                >
                    <th
                        data-open={meleesActive}
                        className="border-collapse border-2 py-1 data-[open=false]:after:content-['...']"
                        colSpan={targets.length + 1}
                    >
                        {"Melees"}
                    </th>
                </tr>
                {meleesActive && (
                    <KillMethodStatsRow stats={stats} killMethods={melees} />
                )}
            </tbody>
        </table>
    );
}

function TargetStatsRow({
    category,
    stats,
}: {
    category: keyof TargetSpinStats;
    stats: SpinStats;
}) {
    const rowTitleMap = new Map([
        ["meleesCount", "Melee %"],
        ["uniqueKillsCount", "Unique Kills %"],
        ["weaponsCount", "Weapons %"],
        ["largeWeaponCount", "Large Weapon %"],
        ["trapKillCount", "Trap Kills %"],
        ["ntkoCount", "NTKO %"],
    ]);

    const rowTitle = rowTitleMap.get(category);

    return (
        <tr className="border-collapse border-2 border-white">
            <th className="border-collapse border-2 border-white px-2 py-1 text-left">
                {rowTitle}
            </th>
            {(Object.keys(stats.targets) as SpinTarget[]).map((target) => {
                const targetStats = stats.targets[target];
                if (
                    !targetStats ||
                    category === "disguises" ||
                    category === "killMethods"
                ) {
                    return;
                }

                return (
                    <td
                        key={target}
                        className="border-collapse border-2 border-white text-center font-normal"
                    >
                        {`${((targetStats[category] / stats.count) * 100).toFixed(2)}%`}
                    </td>
                );
            })}
        </tr>
    );
}

function DisguisesStatsRow({
    stats,
    disguises,
}: {
    stats: SpinStats;
    disguises: string[];
}) {
    return disguises.map((disguise) => {
        return (
            <tr
                key={disguise}
                className="border-collapse border-2 border-white"
            >
                <th className="border-collapse border-2 border-white px-2 py-1 text-left">
                    {DisguiseIDToDisplayText(disguise)}
                </th>
                {(Object.keys(stats.targets) as SpinTarget[]).map((target) => {
                    const targetStats = stats.targets[target];
                    if (!targetStats || !targetStats.disguises) {
                        return;
                    }

                    const targetDisguiseCount =
                        targetStats.disguises[disguise].count ?? 0;

                    return (
                        <td
                            key={target}
                            className="border-collapse border-2 border-white text-center font-normal"
                        >
                            {`${((targetDisguiseCount / stats.count) * 100).toFixed(2)}%`}
                        </td>
                    );
                })}
            </tr>
        );
    });
}

function KillMethodStatsRow({
    stats,
    killMethods,
}: {
    stats: SpinStats;
    killMethods: string[];
}) {
    return killMethods.map((killMethod) => {
        return (
            <tr
                key={killMethod}
                className="border-collapse border-2 border-white"
            >
                <th className="border-collapse border-2 border-white px-2 py-1 text-left">
                    {MethodIDToDisplayText(killMethod)}
                </th>
                {(Object.keys(stats.targets) as SpinTarget[]).map((target) => {
                    const targetStats = stats.targets[target];
                    if (!targetStats) {
                        return;
                    }

                    const targetKillMethodCount =
                        targetStats.killMethods[killMethod]?.count ?? 0;

                    return (
                        <td
                            key={target}
                            className="border-collapse border-2 border-white text-center font-normal"
                        >
                            {`${((targetKillMethodCount / stats.count) * 100).toFixed(2)}%`}
                        </td>
                    );
                })}
            </tr>
        );
    });
}

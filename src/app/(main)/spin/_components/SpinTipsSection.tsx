import { MethodIDToDisplayText, TargetIDToDisplayText } from "@/lib/SpinUtils";
import { Mission, SpinResources, TargetSpinResources } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function SpinTipsSection({
    query,
    mission,
}: {
    query: string;
    mission: Mission;
}) {
    const { data, error, isLoading } = useSWR<TargetSpinResources>(
        "/api/spin/info?s=" + query,
        fetcher,
    );

    const [targetSpinInfo, setTargetSpinInfo] = useState<TargetSpinResources>();

    useEffect(() => {
        setTargetSpinInfo(data);
    }, [data]);

    if (isLoading || targetSpinInfo === undefined) {
        return (
            <section className="flex w-full flex-wrap justify-center gap-3 text-xs text-white sm:text-base">
                <h2>{"Finding you help..."}</h2>
            </section>
        );
    }

    if (error) {
        return (
            <section className="flex w-full flex-wrap justify-center gap-3 text-xs text-white sm:text-base">
                <h2>{"Error fetching data, this feels like your fault :/"}</h2>
            </section>
        );
    }

    return (
        <section className="flex w-full flex-wrap justify-center gap-3 text-[.6rem] text-zinc-900 sm:text-[.9rem]">
            {(Object.keys(targetSpinInfo) as (keyof TargetSpinResources)[]).map(
                (target) => {
                    if (
                        !targetSpinInfo[target]?.items &&
                        !targetSpinInfo[target]?.disguises &&
                        !targetSpinInfo[target]?.uniqueKills
                    ) {
                        return null;
                    }

                    if (
                        targetSpinInfo[target]?.items.length === 0 &&
                        targetSpinInfo[target]?.disguises.length === 0 &&
                        targetSpinInfo[target]?.uniqueKills.length === 0
                    ) {
                        return null;
                    }

                    let lastMethodShown = "";

                    return (
                        <div
                            key={target}
                            className="h-fit w-[25rem] bg-white px-4 py-2"
                        >
                            <h2 className="text-center text-[1.1em] font-bold">
                                {TargetIDToDisplayText(target)}
                            </h2>
                            {(targetSpinInfo[target] as SpinResources).items
                                .length > 0 &&
                                (
                                    targetSpinInfo[target] as SpinResources
                                ).items.map((item) => {
                                    return (
                                        <div
                                            key={item.name}
                                            className="flex flex-col py-1"
                                        >
                                            <h2 className="text-[1.05em] font-bold underline decoration-red-500 decoration-2">
                                                {"Item"}
                                            </h2>
                                            <div className="px-2 sm:px-4">
                                                {item.hitmaps_link ? (
                                                    <a
                                                        href={item.hitmaps_link}
                                                        target="_blank"
                                                        className="font-bold underline"
                                                    >
                                                        {item.name}
                                                    </a>
                                                ) : (
                                                    <p className="inline font-bold">
                                                        {item.name}
                                                    </p>
                                                )}
                                                <span>{`: ${item.quick_look}`}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            {/* Disguises */}
                            {(targetSpinInfo[target] as SpinResources).disguises
                                .length > 0 &&
                                (
                                    targetSpinInfo[target] as SpinResources
                                ).disguises.map((disguise) => {
                                    const firstSeperatorIndex =
                                        disguise.quick_look.indexOf("|");

                                    let disguiseQuickLookName = "";
                                    if (firstSeperatorIndex === -1) {
                                        disguiseQuickLookName =
                                            disguise.quick_look;
                                    } else {
                                        disguiseQuickLookName = `${disguise.quick_look.slice(0, firstSeperatorIndex - 1)}`;
                                    }

                                    return (
                                        <div
                                            key={disguise.id}
                                            className="flex flex-col py-1"
                                        >
                                            <Link
                                                href={`/${mission}/disguises?disguise=${disguise.id}`}
                                                target="_blank"
                                                className="text-[1.05em] font-bold underline decoration-red-500 decoration-2"
                                            >
                                                {"Disguise"}
                                            </Link>
                                            <div className="px-2 sm:px-4">
                                                {disguise.hitmaps_link ? (
                                                    <a
                                                        href={
                                                            disguise.hitmaps_link
                                                        }
                                                        target="_blank"
                                                        className="font-bold underline"
                                                    >
                                                        {disguiseQuickLookName}
                                                    </a>
                                                ) : (
                                                    <p className="inline font-bold">
                                                        {disguiseQuickLookName}
                                                    </p>
                                                )}
                                                {firstSeperatorIndex !== -1 && (
                                                    <span>{`: ${disguise.quick_look.slice(disguise.quick_look.indexOf("|") + 1)}`}</span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            {/* Unique Kills */}
                            {(targetSpinInfo[target] as SpinResources)
                                .uniqueKills.length > 0 &&
                                (
                                    targetSpinInfo[target] as SpinResources
                                ).uniqueKills.map((method) => {
                                    if (!method) {
                                        return null;
                                    }

                                    const printMethodTitle =
                                        lastMethodShown !==
                                        method.kill_method + method.target;

                                    lastMethodShown =
                                        method.kill_method + method.target;

                                    return (
                                        <div key={method.id} className="py-1">
                                            <div
                                                key={method.id}
                                                className="flex flex-col"
                                            >
                                                {printMethodTitle && (
                                                    <Link
                                                        href={
                                                            mission === "berlin"
                                                                ? `/${mission}/unique_kills?kill=${method.kill_method}`
                                                                : `/${mission}/unique_kills?target=${target}`
                                                        }
                                                        target="_blank"
                                                        className="text-[1.05em] font-bold underline decoration-red-500 decoration-2"
                                                    >
                                                        {`${MethodIDToDisplayText(
                                                            method.kill_method,
                                                        )}`}
                                                    </Link>
                                                )}
                                                <div className="px-2 sm:px-4">
                                                    <p className="font-bold">
                                                        {`${method.name || `Method`}:`}
                                                    </p>
                                                    <ul className="list-disc px-5">
                                                        {method.starts && (
                                                            <li>
                                                                <strong>
                                                                    Starts:{" "}
                                                                </strong>
                                                                {method.starts}
                                                            </li>
                                                        )}
                                                        {method.requires && (
                                                            <li>
                                                                <strong>
                                                                    Requires:{" "}
                                                                </strong>
                                                                {
                                                                    method.requires
                                                                }
                                                            </li>
                                                        )}
                                                        {method.timings && (
                                                            <li>
                                                                <strong>
                                                                    Timings:{" "}
                                                                </strong>
                                                                {method.timings}
                                                            </li>
                                                        )}
                                                        {method.notes && (
                                                            <li>
                                                                <strong>
                                                                    Notes:{" "}
                                                                </strong>
                                                                {method.notes}
                                                            </li>
                                                        )}
                                                        {method.video_link && (
                                                            <a
                                                                className="w-fit font-bold underline"
                                                                href={
                                                                    method.video_link
                                                                }
                                                                target="_blank"
                                                            >
                                                                Watch video here
                                                            </a>
                                                        )}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    );
                },
            )}
        </section>
    );
}

// function GetSpinInfo(
//     spin: Spin,
//     itemData: Item[],
//     disguiseData: Disguise[],
//     uniqueKillData: UniqueKill[],
// ): TargetSpinResources {
//     const targetSpinResources = {} as TargetSpinResources;

//     const filteredItemData = itemData.filter(
//         (item) => item.map == spin.mission,
//     );
//     const filteredDisguiseData = disguiseData.filter(
//         (disguise) => disguise.map == spin.mission,
//     );
//     const filteredUniqueKillData = uniqueKillData.filter(
//         (uniqueKill) => uniqueKill.map == spin.mission,
//     );

//     (Object.keys(spin.info) as (keyof SpinInfo)[]).map((target) => {
//         const itemsInSpin: Item[] = [];
//         const disguisesInSpin: Disguise[] = [];
//         const uniqueKillsInSpin: UniqueKill[] = [];

//         const currentCondition = spin.info[target]?.condition || "";
//         const currentDisguise = spin.info[target]?.disguise || "";
//         const isNtko = spin.info[target]?.ntko || false;

//         filteredItemData.forEach((item) => {
//             const itemId = item.name.toLowerCase().replaceAll(" ", "_");
//             if (itemId.toLowerCase() === currentCondition.toLowerCase()) {
//                 itemsInSpin.push(item);
//             }
//         });

//         filteredUniqueKillData.forEach((uniqueKill) => {
//             if (uniqueKill.target !== target && spin.mission !== "berlin") {
//                 return;
//             }

//             if (uniqueKill.kill_method === currentCondition) {
//                 uniqueKillsInSpin.push(uniqueKill);
//             } else if (
//                 currentCondition.includes("loud") &&
//                 uniqueKill.kill_method === "loud_kills"
//             ) {
//                 uniqueKillsInSpin.push(uniqueKill);
//             } else if (
//                 uniqueKill.kill_method === "consumed" &&
//                 currentCondition === "consumed_poison"
//             ) {
//                 uniqueKillsInSpin.push(uniqueKill);
//             } else if (isNtko && uniqueKill.kill_method === "live_kills") {
//                 uniqueKillsInSpin.push(uniqueKill);
//             }
//         });

//         filteredDisguiseData.forEach((disguise) => {
//             const disguiseIdNoMission = disguise.id.split("-")[1] || "";
//             if (disguiseIdNoMission === currentDisguise) {
//                 disguisesInSpin.push(disguise);
//             }
//         });

//         targetSpinResources[target] = {
//             items: itemsInSpin,
//             disguises: disguisesInSpin,
//             uniqueKills: uniqueKillsInSpin,
//         };
//     });

//     return targetSpinResources;
// }

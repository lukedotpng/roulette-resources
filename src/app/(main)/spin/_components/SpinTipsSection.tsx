import {
    MethodIDToDisplayText,
    TargetIDToDisplayText,
} from "@/utils/FormattingUtils";
import { Mission } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { MatchModeManager, SpinTips, TargetSpinTips } from "../types";
import Markdown from "react-markdown";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function SpinTipsSection({
    query,
    mission,
    matchModeManager,
}: {
    query: string;
    mission: Mission;
    matchModeManager: MatchModeManager;
}) {
    const { data, error, isLoading } = useSWR<SpinTips>(
        "/api/spin/info?s=" + query,
        fetcher,
    );

    const [targetSpinInfo, setTargetSpinInfo] = useState<SpinTips>();

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

    if (matchModeManager.enabled && !matchModeManager.matchActive) {
        return (
            <section className="flex w-full flex-wrap justify-center gap-3 text-xs text-white sm:text-base">
                <h2>{"Tips will show once the match starts"}</h2>
            </section>
        );
    }

    return (
        <section className="flex w-full flex-wrap justify-center gap-3 text-[.6rem] text-zinc-900 sm:text-[.9rem]">
            {(Object.keys(targetSpinInfo) as (keyof SpinTips)[]).map(
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
                            {(targetSpinInfo[target] as TargetSpinTips).items
                                .length > 0 &&
                                (
                                    targetSpinInfo[target] as TargetSpinTips
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
                            {(targetSpinInfo[target] as TargetSpinTips)
                                .disguises.length > 0 &&
                                (
                                    targetSpinInfo[target] as TargetSpinTips
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
                                                href={`/${mission}`}
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
                            {(targetSpinInfo[target] as TargetSpinTips)
                                .uniqueKills.length > 0 &&
                                (
                                    targetSpinInfo[target] as TargetSpinTips
                                ).uniqueKills.map((method, index) => {
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
                                                                ? `/${mission}`
                                                                : `/${mission}`
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
                                                        {`${method.name || `Method #${index + 1}`}:`}
                                                    </p>
                                                    <div className="markdown pl-2 sm:pl-4">
                                                        <Markdown
                                                            components={{
                                                                a(props) {
                                                                    return (
                                                                        <a
                                                                            target="_blank"
                                                                            {...props}
                                                                        ></a>
                                                                    );
                                                                },
                                                            }}
                                                        >
                                                            {method.info}
                                                        </Markdown>
                                                    </div>
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

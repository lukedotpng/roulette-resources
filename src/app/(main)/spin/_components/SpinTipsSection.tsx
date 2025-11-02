import {
    MethodIDToDisplayText,
    TargetIDToDisplayText,
} from "@/utils/FormattingUtils";
import { Mission } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import useSWR from "swr";
import {
    FocusedSpinTip,
    MatchModeManager,
    SpinTips,
    TargetSpinTips,
} from "../types";
import Markdown from "react-markdown";
import React from "react";
import SpinTipsModal from "./SpinTipsModal";

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

    const [infoModalOpen, setInfoModelOpen] = useState(false);
    const [focusedSpinTip, setFocusedSpinTip] = useState<FocusedSpinTip>(null);

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
                    let methodCount = 0;

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
                                            <h2 className="text-[1.05em] font-bold underline decoration-red-500 decoration-1 sm:decoration-2">
                                                {"Item"}
                                            </h2>
                                            <div className="px-2 py-0.5 shadow-[inset_0px_0px_3px] shadow-black sm:px-4">
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
                                                className="w-fit text-[1.05em] font-bold underline decoration-red-500 decoration-1 sm:decoration-2"
                                            >
                                                {"Disguise"}
                                            </Link>
                                            <div
                                                className="group relative px-2 py-0.5 shadow-[inset_0px_0px_3px] shadow-black hover:cursor-pointer sm:px-4"
                                                onClick={(
                                                    event: React.MouseEvent,
                                                ) => {
                                                    if (
                                                        (
                                                            event.target as HTMLAnchorElement
                                                        ).id === "hitmaps-link"
                                                    ) {
                                                        return;
                                                    }
                                                    setFocusedSpinTip({
                                                        type: "disguise",
                                                        data: disguise,
                                                    });
                                                    setInfoModelOpen(true);
                                                }}
                                            >
                                                {disguise.hitmaps_link ? (
                                                    <a
                                                        href={
                                                            disguise.hitmaps_link
                                                        }
                                                        target="_blank"
                                                        className="font-bold hover:underline"
                                                        id="hitmaps-link"
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
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 512 512"
                                                    className="absolute top-1 right-1 w-2 fill-zinc-900 opacity-50 group-hover:opacity-100 sm:w-3"
                                                >
                                                    {/*Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2024 Fonticons, Inc.*/}
                                                    <path d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z" />
                                                </svg>
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
                                        lastMethodShown !== method.kill_method;

                                    lastMethodShown = method.kill_method;

                                    if (printMethodTitle) {
                                        methodCount = 0;
                                    } else {
                                        methodCount++;
                                    }

                                    return (
                                        <div key={method.id} className="pt-0.5">
                                            {printMethodTitle && (
                                                <Link
                                                    href={
                                                        mission === "berlin"
                                                            ? `/${mission}`
                                                            : `/${mission}`
                                                    }
                                                    target="_blank"
                                                    className="text-[1.05em] font-bold underline decoration-red-500 decoration-1 sm:decoration-2"
                                                >
                                                    {`${MethodIDToDisplayText(
                                                        method.kill_method,
                                                    )}`}
                                                </Link>
                                            )}
                                            <div
                                                key={method.id}
                                                className="group relative flex flex-col py-0.5 shadow-[inset_0px_0px_3px] shadow-black hover:cursor-pointer"
                                                onClick={() => {
                                                    setFocusedSpinTip({
                                                        type: "killMethod",
                                                        data: method,
                                                    });
                                                    setInfoModelOpen(true);
                                                }}
                                            >
                                                <div className="px-2 sm:px-4">
                                                    <p className="font-bold">
                                                        {`${method.name || `Method #${methodCount + 1}`}:`}
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
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 512 512"
                                                    className="absolute top-1 right-1 w-2 fill-zinc-900 opacity-50 group-hover:opacity-100 sm:w-3"
                                                >
                                                    {/*Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2024 Fonticons, Inc.*/}
                                                    <path d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z" />
                                                </svg>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    );
                },
            )}
            {focusedSpinTip && (
                <SpinTipsModal
                    open={infoModalOpen}
                    setOpen={(open: boolean) => setInfoModelOpen(open)}
                    spinTip={focusedSpinTip}
                />
            )}
        </section>
    );
}

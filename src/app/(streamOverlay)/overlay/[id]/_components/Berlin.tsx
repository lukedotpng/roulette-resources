import {
    DisguiseIDToDisplayText,
    DisguiseImagePathFormatter,
    MethodIDToDisplayText,
    MethodImagePathFormatter,
    TargetIDToDisplayText,
} from "@/utils/FormattingUtils";
import Image from "next/image";
import DefaultThemeTimer from "./DefaultThemeTimer";
import { Spin, SpinInfo } from "@/app/(main)/spin/types";

export default function Berlin({
    spin,
    startTime,
    matchActive,
}: {
    spin: Spin;
    startTime: number;
    matchActive: boolean;
}) {
    return (
        <main
            id="container"
            className="relative flex h-[600px] w-[1300px] flex-wrap justify-end text-sm"
        >
            {(Object.keys(spin.info) as (keyof SpinInfo)[]).map((target) => {
                const targetSpinInfo = spin.info[target];

                if (!targetSpinInfo) {
                    return;
                }
                return (
                    <div
                        key={target}
                        className="h-[300px] w-[433px] text-white"
                    >
                        <div className="flex h-full w-full flex-col">
                            <h1 className="w-full bg-white py-1 text-center text-[2em] font-bold text-zinc-900">
                                {TargetIDToDisplayText(target)}
                            </h1>
                            {targetSpinInfo.ntko && (
                                <div className="w-full bg-red-500 py-0.5 text-center text-[1.75em] font-bold">
                                    <span className="decoration-2">
                                        No Target Pacification
                                    </span>
                                </div>
                            )}
                            <div className="flex flex-1 items-center justify-between bg-zinc-900">
                                <div className="flex h-full w-full flex-col items-start justify-center p-2">
                                    <div className="px-1">
                                        <p className="text-[1.5em] font-bold underline decoration-red-500 decoration-2">
                                            {"Method"}
                                        </p>
                                        <h1 className="flex-1 text-[2em] font-bold">
                                            {MethodIDToDisplayText(
                                                targetSpinInfo.killMethod,
                                            ) ?? "No Method"}
                                        </h1>
                                    </div>
                                </div>
                                <Image
                                    src={MethodImagePathFormatter(
                                        targetSpinInfo.killMethod ||
                                            "No Method",
                                        target,
                                    )}
                                    alt={
                                        MethodIDToDisplayText(
                                            targetSpinInfo.killMethod,
                                        ) ?? "No Method"
                                    }
                                    width={693}
                                    height={517}
                                    quality={50}
                                    className="h-full w-[30%] border-l-2 border-white object-cover object-center"
                                />
                            </div>
                            <div className="flex flex-1 items-center justify-between border-t-[1px] border-white bg-zinc-900">
                                <div className="flex h-full w-full flex-col items-start justify-center p-2">
                                    <div className="px-1">
                                        <p className="text-[1.5em] font-bold underline decoration-red-500 decoration-2">
                                            {"Disguise"}
                                        </p>
                                        <h1 className="flex-1 text-[2em] font-bold">
                                            {DisguiseIDToDisplayText(
                                                targetSpinInfo.disguise,
                                            ) ?? "No Disguise"}
                                        </h1>
                                    </div>
                                </div>
                                <Image
                                    src={DisguiseImagePathFormatter(
                                        targetSpinInfo.disguise || "No Method",
                                        spin.mission,
                                    )}
                                    alt={
                                        DisguiseIDToDisplayText(
                                            targetSpinInfo.killMethod,
                                        ) ?? "No Method"
                                    }
                                    width={693}
                                    height={517}
                                    quality={10}
                                    className="h-full w-[30%] border-l-2 border-white object-cover object-center"
                                />
                            </div>
                        </div>
                    </div>
                );
            })}
            <DefaultThemeTimer
                startTime={startTime}
                matchActive={matchActive}
            />
        </main>
    );
}

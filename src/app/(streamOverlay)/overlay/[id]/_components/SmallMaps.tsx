import {
    DisguiseIDToDisplayText,
    DisguiseImagePathFormatter,
    MethodIDToDisplayText,
    MethodImagePathFormatter,
    TargetIDToDisplayText,
    TargetImagePathFormatter,
} from "@/utils/FormattingUtils";

import Image from "next/image";
import DefaultThemeTimer from "./DefaultThemeTimer";
import { Spin, SpinInfo } from "@/lib/RouletteSpinner/types";

export default function SmallMaps({
    spin,
    startTime,
    showSpinTimer,
}: {
    spin: Spin;
    startTime: number;
    showSpinTimer: boolean;
}) {
    return (
        <main
            id="container"
            data-singletarget={Object.keys(spin.info).length === 1}
            className="relative flex h-[600px] w-[1300px] data-[singletarget=true]:flex-row-reverse"
        >
            {(Object.keys(spin.info) as (keyof SpinInfo)[]).map((target) => {
                const targetSpinInfo = spin.info[target];

                if (!targetSpinInfo) {
                    return;
                }
                return (
                    <div
                        key={target}
                        className="h-[600px] w-[650px] text-white"
                    >
                        <div className="flex h-full flex-col text-white">
                            <div className="relative h-[300px] w-full">
                                <Image
                                    src={TargetImagePathFormatter(target)}
                                    alt={target}
                                    width={693}
                                    height={517}
                                    className="h-full object-cover object-center"
                                />
                                {targetSpinInfo.ntko && (
                                    <div className="absolute top-0 w-full bg-red-500/75 py-1 text-center text-[1.75em] font-bold">
                                        <span className="decoration-2">
                                            No Target Pacification
                                        </span>
                                    </div>
                                )}
                                <h1 className="absolute bottom-0 w-full bg-zinc-900/75 py-1 text-center text-[1.75em] font-bold">
                                    {TargetIDToDisplayText(target)}
                                </h1>
                            </div>
                            <div className="flex h-[300px] flex-col">
                                <div className="flex flex-1 items-center justify-between border-t-[1px] border-white bg-zinc-900">
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
                                        quality={10}
                                        className="h-full w-[150px] border-l-2 border-white object-cover"
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
                                            targetSpinInfo.disguise ||
                                                "No Method",
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
                                        className="h-full w-[150px] border-l-2 border-white object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
            <DefaultThemeTimer
                startTime={startTime}
                showSpinTimer={showSpinTimer}
            />
        </main>
    );
}

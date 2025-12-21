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

export default function LargeMaps({
    spin,
    startTime,
    showSpinTimer,
}: {
    spin: Spin;
    startTime: number;
    showSpinTimer: boolean;
}) {
    return (
        <main id="container" className="h-[600px] w-[1300px]">
            <div
                // timerbelowcontent means the only space for the timer is below, meaning content height must be shrunk
                data-timerbelowcontent={
                    showSpinTimer && Object.keys(spin.info).length % 2 === 0
                }
                className="relative flex w-full flex-wrap items-start justify-end data-[timerbelowcontent=false]:h-full data-[timerbelowcontent=true]:h-[560px]"
            >
                {(Object.keys(spin.info) as (keyof SpinInfo)[]).map(
                    (target) => {
                        const targetSpinInfo = spin.info[target];

                        if (!targetSpinInfo) {
                            return;
                        }
                        return (
                            <div
                                key={target}
                                className="h-1/2 w-1/2 text-white"
                            >
                                <div className="flex h-full w-full text-white">
                                    <div className="relative h-full w-[150px]">
                                        <Image
                                            src={TargetImagePathFormatter(
                                                target,
                                            )}
                                            alt={target}
                                            width={693}
                                            height={517}
                                            className="h-full object-cover object-center"
                                        />
                                        <h1 className="absolute bottom-0 w-full bg-zinc-900/75 text-center text-[1.5em] font-bold">
                                            {TargetIDToDisplayText(target)}
                                        </h1>
                                    </div>
                                    <div className="h-full w-[500px]">
                                        <LargeMapConditionRow
                                            conditionType={"Method"}
                                            conditionDisplayText={MethodIDToDisplayText(
                                                targetSpinInfo.killMethod,
                                            )}
                                            imageUrl={MethodImagePathFormatter(
                                                targetSpinInfo.killMethod,
                                                target,
                                            )}
                                            ntkoBannerShown={
                                                targetSpinInfo.ntko
                                            }
                                        />
                                        {targetSpinInfo.ntko && (
                                            <p className="h-[12%] w-full bg-red-500 text-center text-[1.5em] leading-[1.2em] font-bold">
                                                No Target Pacification
                                            </p>
                                        )}
                                        <LargeMapConditionRow
                                            conditionType={"Disguise"}
                                            conditionDisplayText={DisguiseIDToDisplayText(
                                                targetSpinInfo.disguise,
                                            )}
                                            imageUrl={DisguiseImagePathFormatter(
                                                targetSpinInfo.disguise,
                                                spin.mission,
                                            )}
                                            ntkoBannerShown={
                                                targetSpinInfo.ntko
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    },
                )}
            </div>
            {Object.keys(spin.info).length % 2 === 0 && (
                <div className="w-full">
                    <DefaultThemeTimer
                        startTime={startTime}
                        showSpinTimer={showSpinTimer}
                    />
                </div>
            )}
            {Object.keys(spin.info).length % 2 !== 0 && (
                <div className="absolute top-[300px] left-0 w-[650px]">
                    <DefaultThemeTimer
                        startTime={startTime}
                        showSpinTimer={showSpinTimer}
                    />
                </div>
            )}
        </main>
    );
}

function LargeMapConditionRow({
    conditionType,
    conditionDisplayText,
    imageUrl,
    ntkoBannerShown,
}: {
    conditionType: "Method" | "Disguise";
    conditionDisplayText: string;
    imageUrl: string;
    ntkoBannerShown: boolean;
}) {
    return (
        <div
            data-ntkoshown={ntkoBannerShown}
            data-toprow={conditionType === "Method"}
            className="group flex w-full items-center justify-between bg-zinc-900 data-[ntkoshown=false]:h-1/2 data-[ntkoshown=true]:h-[44%]"
        >
            <div className="flex h-full w-[375px] flex-col items-start justify-center px-2 group-data-[ntkoshown=false]:group-data-[toprow=false]:border-t group-data-[ntkoshown=false]:group-data-[toprow=true]:border-b">
                <p className="text-[1.3em] font-bold underline decoration-red-500 decoration-2">
                    {conditionType}
                </p>
                <h1 className="text-[1.6em] font-bold">
                    {conditionDisplayText}
                </h1>
            </div>
            <Image
                src={imageUrl}
                alt={conditionDisplayText}
                width={693}
                height={517}
                quality={10}
                className="h-full w-[125px] border-white object-cover"
            />
        </div>
    );
}

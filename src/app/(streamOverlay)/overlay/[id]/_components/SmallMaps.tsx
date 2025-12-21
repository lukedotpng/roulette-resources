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
        <main id="container" className="h-[600px] w-[1300px]">
            <div
                data-timervisible={showSpinTimer}
                data-singletarget={Object.keys(spin.info).length === 1}
                className="relative flex w-full data-[singletarget=true]:flex-row-reverse data-[timervisible=false]:h-full data-[timervisible=true]:h-[560px]"
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
                                className="h-full w-[650px] text-white"
                            >
                                <div className="relative h-1/2 w-full">
                                    <Image
                                        src={TargetImagePathFormatter(target)}
                                        alt={target}
                                        width={693}
                                        height={517}
                                        className="h-full w-full object-cover object-center"
                                    />
                                    {targetSpinInfo.ntko && (
                                        <div className="absolute top-0 w-full bg-red-500/75 text-center text-[1.9em] font-bold">
                                            No Target Pacification
                                        </div>
                                    )}
                                    <h1 className="absolute bottom-0 w-full bg-zinc-900/75 text-center text-[1.75em] font-bold">
                                        {TargetIDToDisplayText(target)}
                                    </h1>
                                </div>
                                <SmallMapConditionRow
                                    conditionType="Method"
                                    conditionDisplayText={
                                        MethodIDToDisplayText(
                                            targetSpinInfo.killMethod,
                                        ) ?? "Any"
                                    }
                                    imageUrl={MethodImagePathFormatter(
                                        targetSpinInfo.killMethod ||
                                            "No Method",
                                        target,
                                    )}
                                />
                                <SmallMapConditionRow
                                    conditionType="Disguise"
                                    conditionDisplayText={
                                        DisguiseIDToDisplayText(
                                            targetSpinInfo.disguise,
                                        ) ?? "Any"
                                    }
                                    imageUrl={DisguiseImagePathFormatter(
                                        targetSpinInfo.disguise || "Any",
                                        spin.mission,
                                    )}
                                />
                            </div>
                        );
                    },
                )}
            </div>
            <div
                data-showhalfwidth={Object.keys(spin.info).length === 1}
                className="w-full data-[showhalfwidth=true]:w-1/2 data-[showhalfwidth=true]:translate-x-full"
            >
                <DefaultThemeTimer
                    startTime={startTime}
                    showSpinTimer={showSpinTimer}
                />
            </div>
        </main>
    );
}

function SmallMapConditionRow({
    conditionType,
    conditionDisplayText,
    imageUrl,
}: {
    conditionType: "Method" | "Disguise";
    conditionDisplayText: string;
    imageUrl: string;
}) {
    return (
        <div className="flex h-1/4 w-full items-center justify-between bg-zinc-900">
            <div
                data-toprow={conditionType === "Method"}
                className="flex h-full w-[475px] flex-col items-start justify-center border-white data-[toprow=false]:border-t data-[toprow=true]:border-b"
            >
                <div className="px-2">
                    <p className="text-[1.5em] font-bold underline decoration-red-500 decoration-2">
                        {conditionType}
                    </p>
                    <h1 className="text-[1.8em] font-bold">
                        {conditionDisplayText}
                    </h1>
                </div>
            </div>
            <Image
                src={imageUrl}
                alt={conditionDisplayText}
                width={693}
                height={517}
                quality={10}
                className="h-full w-[175px] border-white object-cover"
            />
        </div>
    );
}

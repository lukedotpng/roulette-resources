import {
    DisguiseIDToDisplayText,
    DisguiseImagePathFormatter,
    MethodIDToDisplayText,
    MethodImagePathFormatter,
    TargetIDToDisplayText,
} from "@/utils/FormattingUtils";
import Image from "next/image";
import DefaultThemeTimer from "./DefaultThemeTimer";
import { Spin, SpinInfo } from "@/lib/RouletteSpinner/types";

export default function Berlin({
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
            className="relative flex h-[600px] w-[1300px] flex-wrap justify-end"
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
                        <h1 className="h-[40px] w-full bg-white text-center text-[1.8em] leading-[40px] font-bold text-zinc-900">
                            {TargetIDToDisplayText(target)}
                        </h1>
                        <div className="flex h-[260px] w-full flex-col">
                            <BerlinConditionRow
                                conditionType={"Method"}
                                conditionDisplayText={MethodIDToDisplayText(
                                    targetSpinInfo.killMethod,
                                )}
                                imageUrl={MethodImagePathFormatter(
                                    targetSpinInfo.killMethod,
                                    target,
                                )}
                                ntkoBannerShown={targetSpinInfo.ntko}
                            />
                            {targetSpinInfo.ntko && (
                                <p className="h-[12%] w-full bg-red-500 text-center text-[1.5em] leading-[29px] font-bold">
                                    No Target Pacification
                                </p>
                            )}
                            <BerlinConditionRow
                                conditionType={"Disguise"}
                                conditionDisplayText={DisguiseIDToDisplayText(
                                    targetSpinInfo.disguise,
                                )}
                                imageUrl={DisguiseImagePathFormatter(
                                    targetSpinInfo.disguise,
                                    spin.mission,
                                )}
                                ntkoBannerShown={targetSpinInfo.ntko}
                            />
                        </div>
                    </div>
                );
            })}
            <div className="absolute top-[300px] left-0 w-[433px]">
                <DefaultThemeTimer
                    startTime={startTime}
                    showSpinTimer={showSpinTimer}
                />
            </div>
        </main>
    );
}

function BerlinConditionRow({
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
            className="group flex w-full items-center justify-between border-white bg-zinc-900 data-[ntkoshown=false]:h-1/2 data-[ntkoshown=true]:h-[44%]"
        >
            <div className="flex h-full w-[70%] flex-col items-start justify-center px-1 group-data-[ntkoshown=false]:group-data-[toprow=false]:border-t group-data-[ntkoshown=false]:group-data-[toprow=true]:border-b">
                <p className="text-[1.3em] font-bold underline decoration-red-500 decoration-2">
                    {conditionType + ":"}
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
                className="h-full w-[30%] object-cover object-center"
            />
        </div>
    );
}

import {
    DisguiseIDToDisplayText,
    DisguiseImagePathFormatter,
    MethodIDToDisplayText,
    MethodImagePathFormatter,
    TargetIDToDisplayText,
    TargetImagePathFormatter,
} from "@/utils/FormattingUtils";
import { Spin, SpinInfo } from "@/types";
import Image from "next/image";

export default function LargeMaps({ spin }: { spin: Spin }) {
    return (
        <main
            id="container"
            className="flex h-[600px] w-[1300px] flex-wrap justify-end text-sm"
        >
            {(Object.keys(spin.info) as (keyof SpinInfo)[]).map((target) => {
                const targetSpinInfo = spin.info[target];

                if (!targetSpinInfo) {
                    return;
                }
                return (
                    <div
                        key={target}
                        className="h-[300px] w-[650px] text-white"
                    >
                        <div className="flex h-full w-full text-white">
                            <div className="relative h-full w-[200px]">
                                <Image
                                    src={TargetImagePathFormatter(target)}
                                    alt={target}
                                    width={693}
                                    height={517}
                                    className="h-full object-cover object-center"
                                />
                                <h1 className="absolute bottom-0 w-full bg-zinc-900/75 py-1 text-center text-[1.75em] font-bold">
                                    {TargetIDToDisplayText(target)}
                                </h1>
                            </div>
                            <div className="flex h-full w-[450px] flex-col">
                                <div className="flex flex-1 items-center justify-between bg-zinc-900">
                                    <div className="flex h-full w-full flex-col items-start justify-center p-2">
                                        <div className="px-1">
                                            <p className="text-[1.5em] font-bold underline decoration-red-500 decoration-2">
                                                {"Method"}
                                            </p>
                                            <h1 className="flex-1 text-[2em] font-bold">
                                                {MethodIDToDisplayText(
                                                    targetSpinInfo.condition,
                                                ) ?? "No Method"}
                                            </h1>
                                        </div>
                                    </div>
                                    <Image
                                        src={MethodImagePathFormatter(
                                            targetSpinInfo.condition ||
                                                "No Method",
                                            target,
                                        )}
                                        alt={
                                            MethodIDToDisplayText(
                                                targetSpinInfo.condition,
                                            ) ?? "No Method"
                                        }
                                        width={693}
                                        height={517}
                                        quality={10}
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
                                            targetSpinInfo.disguise ||
                                                "No Method",
                                            spin.mission,
                                        )}
                                        alt={
                                            DisguiseIDToDisplayText(
                                                targetSpinInfo.condition,
                                            ) ?? "No Method"
                                        }
                                        width={693}
                                        height={517}
                                        quality={10}
                                        className="h-full w-[30%] border-l-2 border-white object-cover object-center"
                                    />
                                </div>
                                {targetSpinInfo.ntko && (
                                    <div className="w-full bg-red-500 py-1 text-center text-[1.75em] font-bold">
                                        <span className="decoration-2">
                                            No Target Pacification
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </main>
    );
}

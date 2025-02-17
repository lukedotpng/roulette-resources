import { Mission, SpinInfo, SpinTarget, SpinUpdateAction } from "@/types";
import Image from "next/image";
import { useRef, useState } from "react";

export default function TargetSpinCard({
    spin,
    target,
    mission,
    HandleSpinUpdate,
}: {
    spin: SpinInfo;
    target: SpinTarget;
    mission: Mission;
    HandleSpinUpdate: (target: SpinTarget, action: SpinUpdateAction) => void;
}) {
    const [conditionSpinAnimationActive, setConditionSpinAnimationActive] =
        useState(false);
    const [disguiseSpinAnimationActive, setDisguiseSpinAnimationActive] =
        useState(false);

    const conditionTimeout = useRef<NodeJS.Timeout>(undefined);
    const disguiseTimeout = useRef<NodeJS.Timeout>(undefined);

    function HandleDisguiseSpinAnmition() {
        setDisguiseSpinAnimationActive(true);

        clearTimeout(disguiseTimeout.current);
        disguiseTimeout.current = setTimeout(() => {
            setDisguiseSpinAnimationActive(false);
        }, 300);
    }

    function HandleConditionSpinAnmiation() {
        setConditionSpinAnimationActive(true);

        clearTimeout(conditionTimeout.current);
        conditionTimeout.current = setTimeout(() => {
            setConditionSpinAnimationActive(false);
        }, 300);
    }

    return (
        <div className="flex w-full flex-col border-2 border-white text-white sm:border-4 md:w-[40rem]">
            <div className="flex h-20 w-full text-white sm:h-32">
                <div className="relative w-28 border-r-[1px] border-white sm:w-48 sm:border-r-2">
                    <Image
                        src={TargetImagePathFormatter(target)}
                        alt={target}
                        width={693}
                        height={517}
                        className="h-full object-cover object-center"
                    />
                    <h1 className="bg-opacity-85 absolute bottom-0 w-full bg-zinc-900 text-center text-[.90em] font-bold sm:text-[1em]">
                        {TargetIDToDisplayText(target)}
                    </h1>
                </div>
                <div className="flex h-full flex-1 flex-col">
                    {/* Condition */}
                    <div className="flex h-[50%] flex-1 items-center justify-between border-b-[1px] border-white bg-zinc-900">
                        <div className="mr-2 flex w-full items-center justify-between">
                            <div className="px-1">
                                <p className="text-[.75em] font-bold underline decoration-red-500 decoration-1 sm:decoration-2">
                                    Method
                                </p>
                                <h1 className="text-[0.90em] font-bold sm:text-[1.1em]">
                                    {ItemIDToDisplayText(
                                        spin[target]?.condition,
                                    )}
                                </h1>
                            </div>
                            <button
                                className="aspect-square h-full"
                                onClick={() => {
                                    HandleSpinUpdate(
                                        target,
                                        "respin_condition",
                                    );
                                    HandleConditionSpinAnmiation();
                                }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 512 512"
                                    data-animationactive={
                                        conditionSpinAnimationActive
                                    }
                                    className="w-4 fill-white data-[animationactive=true]:animate-[spin_300ms_linear_infinite] sm:w-6"
                                >
                                    {/* Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2024 Fonticons, Inc. */}
                                    <path d="M105.1 202.6c7.7-21.8 20.2-42.3 37.8-59.8c62.5-62.5 163.8-62.5 226.3 0L386.3 160 352 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l111.5 0c0 0 0 0 0 0l.4 0c17.7 0 32-14.3 32-32l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 35.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5zM39 289.3c-5 1.5-9.8 4.2-13.7 8.2c-4 4-6.7 8.8-8.1 14c-.3 1.2-.6 2.5-.8 3.8c-.3 1.7-.4 3.4-.4 5.1L16 432c0 17.7 14.3 32 32 32s32-14.3 32-32l0-35.1 17.6 17.5c0 0 0 0 0 0c87.5 87.4 229.3 87.4 316.7 0c24.4-24.4 42.1-53.1 52.9-83.8c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.5 62.5-163.8 62.5-226.3 0l-.1-.1L125.6 352l34.4 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L48.4 288c-1.6 0-3.2 .1-4.8 .3s-3.1 .5-4.6 1z" />
                                </svg>
                            </button>
                        </div>

                        <Image
                            src={MethodImagePathFormatter(
                                spin[target]?.condition,
                                target,
                            )}
                            alt={spin[target]?.condition ?? "No Condition"}
                            width={693}
                            height={517}
                            quality={10}
                            className="aspect-[693/517] h-full w-12 border-l-[1px] border-white object-cover sm:w-20 sm:border-l-2"
                        />
                    </div>
                    {/* Disguise */}
                    <div className="flex h-[50%] flex-1 items-center justify-between border-t-[1px] border-white bg-zinc-900">
                        <div className="mr-2 flex w-full items-center justify-between">
                            <div className="px-1">
                                <p className="text-[.75em] font-bold underline decoration-red-500 decoration-1 sm:decoration-2">
                                    Disguise
                                </p>
                                <h1 className="text-[0.95em] font-bold sm:text-[1.1em]">
                                    {DisguiseIDToDisplayText(
                                        spin[target]?.disguise,
                                    )}
                                </h1>
                            </div>
                            <button
                                className="aspect-square h-full"
                                onClick={() => {
                                    HandleSpinUpdate(target, "respin_disguise");
                                    HandleDisguiseSpinAnmition();
                                }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 512 512"
                                    data-animationactive={
                                        disguiseSpinAnimationActive
                                    }
                                    className="w-4 fill-white data-[animationactive=true]:animate-[spin_300ms_linear_infinite] sm:w-6"
                                >
                                    {/* Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2024 Fonticons, Inc. */}
                                    <path d="M105.1 202.6c7.7-21.8 20.2-42.3 37.8-59.8c62.5-62.5 163.8-62.5 226.3 0L386.3 160 352 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l111.5 0c0 0 0 0 0 0l.4 0c17.7 0 32-14.3 32-32l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 35.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5zM39 289.3c-5 1.5-9.8 4.2-13.7 8.2c-4 4-6.7 8.8-8.1 14c-.3 1.2-.6 2.5-.8 3.8c-.3 1.7-.4 3.4-.4 5.1L16 432c0 17.7 14.3 32 32 32s32-14.3 32-32l0-35.1 17.6 17.5c0 0 0 0 0 0c87.5 87.4 229.3 87.4 316.7 0c24.4-24.4 42.1-53.1 52.9-83.8c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.5 62.5-163.8 62.5-226.3 0l-.1-.1L125.6 352l34.4 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L48.4 288c-1.6 0-3.2 .1-4.8 .3s-3.1 .5-4.6 1z" />
                                </svg>
                            </button>
                        </div>

                        <Image
                            src={
                                "/disguises/" +
                                mission +
                                "-" +
                                spin[target]?.disguise +
                                ".webp"
                            }
                            alt={spin[target]?.disguise ?? "No Disguise"}
                            width={693}
                            height={517}
                            quality={10}
                            className="aspect-[693/517] h-full w-12 border-l-[1px] border-white object-cover sm:w-20 sm:border-l-2"
                        />
                    </div>
                </div>
            </div>
            {spin[target]?.ntko && (
                <h2 className="relative border-t-[1px] border-white bg-red-500 py-0.5 text-center text-[.9em] font-bold sm:border-t-2 sm:py-1 sm:text-[1em]">
                    <span>No Target Pacification</span>
                    <button
                        className="absolute top-0 right-2 h-full fill-white"
                        onClick={() => HandleSpinUpdate(target, "toggle_ntko")}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                            className="h-full w-4 fill-white sm:w-6"
                        >
                            {/* Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2024 Fonticons, Inc.  */}
                            <path d="M64 80c-8.8 0-16 7.2-16 16l0 320c0 8.8 7.2 16 16 16l384 0c8.8 0 16-7.2 16-16l0-320c0-8.8-7.2-16-16-16L64 80zM0 96C0 60.7 28.7 32 64 32l384 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zm175 79c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
                        </svg>
                    </button>
                </h2>
            )}
        </div>
    );
}

function ItemIDToDisplayText(item: string | undefined) {
    if (!item) {
        return "Err No Condition";
    }
    let itemDisplayText = "";
    // disguise ID example: paris-palace_staff
    const words = item.split("_"); // ["palace", "staff"]

    for (let word of words) {
        if (word.toLowerCase() === "smg") {
            word = "SMG";
        }
        itemDisplayText += word.charAt(0).toUpperCase() + word.slice(1) + " ";
    }

    return itemDisplayText.trim();
}

function DisguiseIDToDisplayText(disguise: string | undefined) {
    if (!disguise) {
        return "Err No Disguise";
    }
    let disguiseDisplayText = "";
    const words = disguise.split("_"); // ["palace", "staff"]

    for (const word of words) {
        if (word.toLowerCase() === "dj") {
            disguiseDisplayText += "DJ";
        } else {
            disguiseDisplayText +=
                word.charAt(0).toUpperCase() + word.slice(1) + " ";
        }
    }

    return disguiseDisplayText.trim();
}

function TargetIDToDisplayText(target: string) {
    let targetDisplayText = "";
    const words = target.split("_");

    for (let word of words) {
        if (word.toLowerCase() === "ica") {
            word = "ICA";
        }
        targetDisplayText += word.charAt(0).toUpperCase() + word.slice(1) + " ";
    }

    return targetDisplayText;
}

function TargetImagePathFormatter(target: string) {
    if (target.startsWith("ica_agent")) {
        target = "ica_agent";
    }
    return "/targets/" + target + ".webp";
}

function MethodImagePathFormatter(
    method: string | undefined,
    target: SpinTarget,
) {
    if (!method) {
        return "";
    }

    if (target === "erich_soders" && method === "electrocution") {
        return "/killmethods/" + "soders_electrocution" + ".webp";
    }

    if (method.startsWith("loud_")) {
        method = method.split("loud_")[1];
    } else if (method.startsWith("silenced_")) {
        method = method.split("silenced_")[1];
    }

    return "/killmethods/" + method + ".webp";
}

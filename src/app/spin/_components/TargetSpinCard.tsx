import { Mission, Spin, SpinTarget } from "@/types";
import Image from "next/image";

export default function TargetSpinCard({
    spin,
    target,
    mission,
}: {
    spin: Spin;
    target: SpinTarget;
    mission: Mission;
}) {
    return (
        <div className="flex w-full flex-col border-2 border-white text-white sm:border-4 md:w-[40rem]">
            <div className="flex h-20 w-full text-white sm:h-32">
                <div className="relative w-32 border-r-[1px] border-white sm:w-48 sm:border-r-2">
                    <Image
                        src={TargetImagePathFormatter(target)}
                        alt={target}
                        width={693}
                        height={517}
                        className="h-full object-cover object-center"
                    />
                    <h1 className="absolute bottom-0 w-full bg-zinc-900 bg-opacity-85 text-center font-bold">
                        {TargetIDToDisplayText(target)}
                    </h1>
                </div>
                <div className="flex flex-1 flex-col">
                    <div className="flex flex-1 items-center justify-between border-white bg-zinc-900">
                        <div className="px-1">
                            <p className="text-[.75em] font-bold underline decoration-red-500 decoration-1 sm:decoration-2">
                                Method
                            </p>
                            <h1 className="text-[1.1em] font-bold">
                                {ItemIDToDisplayText(spin[target]?.condition)}
                            </h1>
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
                            className="h-full w-12 border-l-[1px] border-white object-cover sm:w-16 sm:border-l-2"
                        />
                    </div>
                    <div className="flex flex-1 items-center justify-between border-t-[1px] border-white bg-zinc-900 sm:border-t-2">
                        <div className="px-1">
                            <p className="text-[.75em] font-bold underline decoration-red-500 decoration-1 sm:decoration-2">
                                Disguise
                            </p>
                            <h1 className="text-[1.1em] font-bold">
                                {DisguiseIDToDisplayText(
                                    spin[target]?.disguise,
                                )}
                            </h1>
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
                            className="h-full w-12 border-l-[1px] border-white object-cover sm:w-16 sm:border-l-2"
                        />
                    </div>
                </div>
            </div>
            {spin[target]?.ntko && (
                <h2 className="border-t-[1px] border-white bg-red-500 py-0.5 text-center font-bold sm:border-t-2 sm:py-1">
                    No Target Pacification
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
        disguiseDisplayText +=
            word.charAt(0).toUpperCase() + word.slice(1) + " ";
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

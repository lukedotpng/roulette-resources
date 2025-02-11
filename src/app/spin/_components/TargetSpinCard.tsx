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
        <div className="flex flex-col border-4 border-white text-white">
            <div className="flex h-32 min-w-[40rem] text-white">
                <div className="relative w-48 border-r-2 border-white">
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
                            <p className="w-fit text-[.75em] font-bold underline decoration-red-500 decoration-2">
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
                            className="h-full w-16 border-l-2 border-white object-cover"
                        />
                    </div>
                    <div className="flex flex-1 items-center justify-between border-t-2 border-white bg-zinc-900">
                        <div className="px-1">
                            <p className="w-fit text-[.75em] font-bold underline decoration-red-500 decoration-2">
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
                            className="h-full w-16 border-l-2 border-white object-cover"
                        />
                    </div>
                </div>
            </div>
            {spin[target]?.ntko && (
                <h2 className="border-t-2 border-white bg-red-500 py-1 text-center font-bold">
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

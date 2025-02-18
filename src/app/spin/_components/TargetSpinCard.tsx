import {
    TargetImagePathFormatter,
    DisguiseIDToDisplayText,
    TargetIDToDisplayText,
    MethodIDToDisplayText,
    MethodImagePathFormatter,
    DisguiseImagePathFormatter,
} from "@/lib/SpinUtils";
import { Mission, SpinInfo, SpinTarget, SpinUpdateAction } from "@/types";
import Image from "next/image";
import TargetSpinCardRow from "./TargetSpinCardRow";

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
    return (
        <div className="w-full max-w-[48rem] border-2 border-white text-white">
            <div className="flex h-24 w-full text-white sm:h-36">
                <div className="relative w-28 border-r-[1px] border-white sm:w-48 sm:border-r-2">
                    <Image
                        src={TargetImagePathFormatter(target)}
                        alt={target}
                        width={693}
                        height={517}
                        className="h-full object-cover object-center"
                    />
                    <h1 className="absolute bottom-0 w-full bg-zinc-900/75 text-center text-[.65rem] font-bold sm:text-[1em]">
                        {TargetIDToDisplayText(target)}
                    </h1>
                </div>
                <div className="flex h-full flex-1 flex-col">
                    <TargetSpinCardRow
                        title="Method"
                        info={
                            MethodIDToDisplayText(spin[target]?.condition) ??
                            "No Method"
                        }
                        target={target}
                        imageSrc={MethodImagePathFormatter(
                            spin[target]?.condition || "No Method",
                            target,
                        )}
                        HandleSpinUpdate={HandleSpinUpdate}
                        spinUpdateAction="respin_condition"
                    />
                    <TargetSpinCardRow
                        title="Disguise"
                        info={
                            DisguiseIDToDisplayText(spin[target]?.disguise) ??
                            "No Disguise"
                        }
                        target={target}
                        imageSrc={DisguiseImagePathFormatter(
                            spin[target]?.disguise || "No Disguise",
                            mission,
                        )}
                        HandleSpinUpdate={HandleSpinUpdate}
                        spinUpdateAction="respin_disguise"
                    />
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

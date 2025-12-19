import {
    DisguiseIDToDisplayText,
    MethodIDToDisplayText,
    TargetIDToDisplayText,
} from "@/utils/FormattingUtils";

import TextThemeTimer from "./TextThemeTimer";
import { Spin, SpinInfo } from "@/lib/RouletteSpinner/types";

export default function TextOnly({
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
            className="flex w-full flex-col text-[45px] text-white"
        >
            {(Object.keys(spin.info) as (keyof SpinInfo)[]).map((target) => {
                const targetSpinInfo = spin.info[target];

                return (
                    <div key={target} className="w-full pr-2">
                        <p className="text-right">
                            <span className="font-bold">{`${TargetIDToDisplayText(target)}: `}</span>
                            <span>
                                {MethodIDToDisplayText(
                                    targetSpinInfo?.killMethod,
                                )}
                            </span>
                            <span>{" / "}</span>
                            <span>
                                {DisguiseIDToDisplayText(
                                    targetSpinInfo?.disguise,
                                )}
                            </span>
                            {targetSpinInfo?.ntko && (
                                <>
                                    <span>{" / "}</span>
                                    <span className="font-bold text-red-500">
                                        {"NTKO"}
                                    </span>
                                </>
                            )}
                        </p>
                    </div>
                );
            })}
            <TextThemeTimer
                startTime={startTime}
                showSpinTimer={showSpinTimer}
            />
        </main>
    );
}

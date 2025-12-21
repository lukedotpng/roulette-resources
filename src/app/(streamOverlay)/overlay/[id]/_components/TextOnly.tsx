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
            className="h-[600px] w-[1300px] text-[30px] text-white"
        >
            <div className="flex flex-row-reverse px-2">
                <div>
                    {(Object.keys(spin.info) as (keyof SpinInfo)[]).map(
                        (target) => {
                            const targetSpinInfo = spin.info[target];

                            return (
                                <p key={target} className="text-nowrap">
                                    <span className="font-bold">{`${TargetIDToDisplayText(target)}: `}</span>
                                    <span>
                                        {MethodIDToDisplayText(
                                            targetSpinInfo?.killMethod,
                                        )}
                                    </span>
                                    <span className="text-[0.9em]">
                                        {" as "}
                                    </span>
                                    <span>
                                        {DisguiseIDToDisplayText(
                                            targetSpinInfo?.disguise,
                                        )}
                                    </span>
                                    {targetSpinInfo?.ntko && (
                                        <>
                                            <span>{" ("}</span>
                                            <span className="font-bold text-red-500">
                                                {"NTKO"}
                                            </span>
                                            <span>{") "}</span>
                                        </>
                                    )}
                                </p>
                            );
                        },
                    )}
                    <div className="text-[1.1em] font-bold">
                        <TextThemeTimer
                            startTime={startTime}
                            showSpinTimer={showSpinTimer}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}

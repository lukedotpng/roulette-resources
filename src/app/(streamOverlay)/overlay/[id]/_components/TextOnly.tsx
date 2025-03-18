import {
    DisguiseIDToDisplayText,
    MethodIDToDisplayText,
    TargetIDToDisplayText,
} from "@/utils/FormattingUtils";
import { Spin, SpinInfo } from "@/types";

export default function TextOnly({ spin }: { spin: Spin }) {
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
                                    targetSpinInfo?.condition,
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
        </main>
    );
}

import { SpinInfo } from "@/lib/RouletteSpinner/types";
import { SpinManager } from "../../types";
import TargetSpinCard from "./TargetSpinCard";

export default function SpinInfoSection({
    spinManager,
}: {
    spinManager: SpinManager;
}) {
    if (spinManager.currentSpin === null) {
        return;
    }

    const spinEditsDisabled =
        spinManager.matchModeManager.enabled ||
        spinManager.spinMode === "seeded_queue";

    return (
        <section
            data-row={spinManager.options.spinTheme.value === "row"}
            className="flex w-full gap-2 data-[row=false]:flex-col data-[row=false]:items-center data-[row=true]:flex-row data-[row=true]:flex-wrap data-[row=true]:items-start data-[row=true]:justify-center"
        >
            {(
                Object.keys(spinManager.currentSpin.info) as (keyof SpinInfo)[]
            ).map((target) => {
                if (spinManager.currentSpin === null) {
                    return;
                }

                return (
                    <TargetSpinCard
                        key={target}
                        target={target}
                        spin={spinManager.currentSpin}
                        RespinCondition={spinManager.RespinCondition}
                        EditSpin={spinManager.EditSpin}
                        lockedConditions={spinManager.lockedConditions}
                        SetLockedConditions={spinManager.SetLockedConditions}
                        manualMode={spinManager.manualMode}
                        canAlwaysEditNTKO={
                            spinManager.options.canAlwaysEditNTKO.value
                        }
                        spinEditsDisabled={spinEditsDisabled}
                    />
                );
            })}
            {spinManager.spinIsLegal &&
                !spinManager.spinIsLegal.legal &&
                spinManager.options.warnForIllegalSpins.value && (
                    <p className="flex h-6 items-center gap-1 rounded-sm bg-white px-3 text-center text-[.9em] font-bold text-zinc-900">
                        <span className="text-red-500">{"WARNING: "}</span>
                        <span>{spinManager.spinIsLegal.reason_info}</span>
                    </p>
                )}
        </section>
    );
}

import {
    Spin,
    SpinCheckResult,
    SpinInfo,
    SpinOptions,
    SpinTarget,
    SpinUpdateAction,
} from "@/types";
import TargetSpinCard from "./TargetSpinCard";

export default function SpinInfoSection({
    spin,
    spinLegal,
    RespinCondition,
    EditSpin,
    options,
}: {
    spin: Spin;
    spinLegal: SpinCheckResult;
    RespinCondition: (target: SpinTarget, action: SpinUpdateAction) => void;
    EditSpin: (
        target: SpinTarget,
        action: SpinUpdateAction,
        newValue: string,
    ) => void;
    options: SpinOptions;
}) {
    return (
        <section
            data-row={options.layoutMode.val === "row"}
            className="flex w-full gap-2 data-[row=false]:flex-col data-[row=false]:items-center data-[row=true]:flex-row data-[row=true]:flex-wrap data-[row=true]:items-start data-[row=true]:justify-center"
        >
            {(Object.keys(spin.info) as (keyof SpinInfo)[]).map((target) => {
                return (
                    <TargetSpinCard
                        key={target}
                        spin={spin.info}
                        target={target}
                        mission={spin.mission}
                        RespinCondition={RespinCondition}
                        EditSpin={EditSpin}
                        options={options}
                    />
                );
            })}
            {spinLegal &&
                !spinLegal.legal &&
                options.warnForIllegalSpins.val && (
                    <p className="flex h-6 items-center gap-1 rounded-sm bg-white px-3 text-center text-[.9em] font-bold text-zinc-900">
                        <span className="text-red-500">{"WARNING: "}</span>
                        <span>{spinLegal.reason_info}</span>
                    </p>
                )}
        </section>
    );
}

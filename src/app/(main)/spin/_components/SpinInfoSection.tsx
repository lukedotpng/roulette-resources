import {
    Spin,
    SpinInfo,
    SpinOptions,
    SpinTarget,
    SpinUpdateAction,
} from "@/types";
import TargetSpinCard from "./TargetSpinCard";

export default function SpinInfoSection({
    spin,
    RespinCondition,
    EditSpin,
    options,
}: {
    spin: Spin;
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
        </section>
    );
}

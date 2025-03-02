import {
    Spin,
    SpinInfo,
    SpinSettings,
    SpinTarget,
    SpinUpdateAction,
} from "@/types";
import TargetSpinCard from "./TargetSpinCard";

export default function SpinInfoSection({
    spin,
    HandleSpinUpdate,
    settings,
}: {
    spin: Spin;
    HandleSpinUpdate: (target: SpinTarget, action: SpinUpdateAction) => void;
    settings: SpinSettings;
}) {
    return (
        <section
            data-row={settings.layoutMode === "row"}
            className="flex w-full gap-2 data-[row=false]:flex-col data-[row=false]:items-center data-[row=true]:flex-row data-[row=true]:flex-wrap data-[row=true]:items-start data-[row=true]:justify-center"
        >
            {(Object.keys(spin.info) as (keyof SpinInfo)[]).map((target) => {
                return (
                    <TargetSpinCard
                        spin={spin.info}
                        target={target}
                        mission={spin.mission}
                        HandleSpinUpdate={HandleSpinUpdate}
                        key={target}
                    />
                );
            })}
        </section>
    );
}

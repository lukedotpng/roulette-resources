import { Spin, SpinInfo, SpinTarget, SpinUpdateAction } from "@/types";
import TargetSpinCard from "./TargetSpinCard";

export default function SpinInfoSection({
    spin,
    HandleSpinUpdate,
}: {
    spin: Spin;
    HandleSpinUpdate: (target: SpinTarget, action: SpinUpdateAction) => void;
}) {
    return (
        <section className="flex flex-wrap items-start justify-center gap-2">
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

import { Mission, Spin } from "@/types";
import TargetSpinCard from "./TargetSpinCard";

export default function SpinInfoSection({
    spin,
    mission,
}: {
    spin: Spin;
    mission: Mission;
}) {
    return (
        <section className="flex flex-col gap-2">
            {(Object.keys(spin) as (keyof Spin)[]).map((target) => {
                return (
                    <TargetSpinCard
                        spin={spin}
                        target={target}
                        mission={mission}
                        key={target}
                    />
                );
            })}
        </section>
    );
}

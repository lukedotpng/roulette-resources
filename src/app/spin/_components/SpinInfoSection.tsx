import { Spin, SpinInfo } from "@/types";
import TargetSpinCard from "./TargetSpinCard";

export default function SpinInfoSection({ spin }: { spin: Spin }) {
    return (
        <section className="flex w-full flex-col items-center gap-2">
            {(Object.keys(spin.info) as (keyof SpinInfo)[]).map((target) => {
                return (
                    <TargetSpinCard
                        spin={spin.info}
                        target={target}
                        mission={spin.mission}
                        key={target}
                    />
                );
            })}
        </section>
    );
}

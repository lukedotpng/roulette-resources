import { MissionSpin, Spin } from "@/types";
import TargetSpinCard from "./TargetSpinCard";

export default function SpinInfoSection({
    missionSpin,
}: {
    missionSpin: MissionSpin;
}) {
    return (
        <section className="flex flex-col gap-2">
            {(Object.keys(missionSpin.spin) as (keyof Spin)[]).map((target) => {
                return (
                    <TargetSpinCard
                        spin={missionSpin.spin}
                        target={target}
                        mission={missionSpin.mission}
                        key={target}
                    />
                );
            })}
        </section>
    );
}

import { MissionSpin, Spin } from "@/types";
import TargetSpinCard from "./TargetSpinCard";

export default function SpinInfoSection({
    missionSpin,
}: {
    missionSpin: MissionSpin;
}) {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
                height: "100%",
                backgroundColor: "#18181b",
                gap: "5px",
            }}
        >
            {(Object.keys(missionSpin.spin) as (keyof Spin)[]).map((target) => {
                return (
                    <TargetSpinCard
                        missionSpin={missionSpin}
                        target={target}
                        key={target}
                    />
                );
            })}
        </div>
    );
}

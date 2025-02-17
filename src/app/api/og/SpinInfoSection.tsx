import { Spin, SpinInfo } from "@/types";
import TargetSpinCard from "./TargetSpinCard";

export default function SpinInfoSection({ spin }: { spin: Spin }) {
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
            {(Object.keys(spin.info) as (keyof SpinInfo)[]).map((target) => {
                return (
                    <TargetSpinCard spin={spin} target={target} key={target} />
                );
            })}
        </div>
    );
}

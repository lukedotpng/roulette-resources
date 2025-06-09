import { Mission, SpinOptions } from "@/types";
import { SPIN_MISSION_TARGETS_LIST } from "../../utils/SpinGlobals";

export default function SpinInfoMatchPlaceholder({
    mission,
    options,
}: {
    mission: Mission;
    options: SpinOptions;
}) {
    const targets = SPIN_MISSION_TARGETS_LIST[mission];

    return (
        <section
            data-row={options.layoutMode.val === "row"}
            className="flex w-full gap-2 data-[row=false]:flex-col data-[row=false]:items-center data-[row=true]:flex-row data-[row=true]:flex-wrap data-[row=true]:items-start data-[row=true]:justify-center"
        >
            {targets.map((target) => {
                return (
                    <div
                        key={target}
                        className="relative w-full max-w-[48rem] border-2 border-white text-white"
                    >
                        <div className="absolute flex h-full w-full items-center justify-center bg-zinc-900 font-bold">
                            <h1 className="w-full text-center">
                                {
                                    "MAKE SURE ALL TARGET BOXES ARE VISIBLE BEFORE STARTING THE MATCH"
                                }
                            </h1>
                        </div>
                        <div className="flex h-24 w-full text-white sm:h-36"></div>
                        <div
                            data-active={false}
                            className="group border-t-[1px] border-white bg-zinc-900 py-0.5 text-center text-[.9em] font-bold data-[active=true]:bg-red-500 sm:border-t-2 sm:py-1 sm:text-[1em]"
                        >
                            <span className="decoration-2 group-data-[active=false]:line-through">
                                No Target Pacification
                            </span>
                        </div>
                    </div>
                );
            })}
        </section>
    );
}

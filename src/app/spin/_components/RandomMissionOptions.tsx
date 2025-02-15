import { Mission } from "@/types";
import { Dispatch, SetStateAction } from "react";
import MissionPoolSelection from "./MissionPoolSelection";

export default function RandomMissionOptions({
    setMissionPool,
    noRepeatForXSpins,
    setNoRepeatForXSpins,
}: {
    setMissionPool: Dispatch<SetStateAction<Mission[]>>;
    noRepeatForXSpins: number;
    setNoRepeatForXSpins: Dispatch<SetStateAction<number>>;
}) {
    return (
        <>
            <MissionPoolSelection setMissionPool={setMissionPool} />
            <form
                className="flex h-full items-center bg-white p-1 px-2 text-zinc-900 sm:p-2"
                onSubmit={(e) => e.preventDefault()}
            >
                <label htmlFor="noRepeatForXSpins">{"No repeats for "}</label>
                <input
                    className="mx-1 w-8 border-2 border-zinc-900 text-center focus:border-red-500 focus:outline-none sm:w-10"
                    value={noRepeatForXSpins}
                    onChange={(e) => {
                        let value = parseInt(e.target.value);
                        if (value.toString() === "NaN") {
                            setNoRepeatForXSpins(0);
                            return;
                        }
                        value = Math.max(value, 0);

                        setNoRepeatForXSpins(value);
                    }}
                    name="noRepeatForXSpins"
                    id="noRepeatForXSpins"
                />
                <span>spins</span>
            </form>
        </>
    );
}

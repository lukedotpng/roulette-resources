import { Mission } from "@/types";
import { Dispatch, SetStateAction } from "react";
import MissionPoolSelection from "./MissionPoolSelection";

export default function RandomMissionOptions({
    setMissionPool,
    dontRepeatMission,
    ToggleDontRepeatMission,
}: {
    setMissionPool: Dispatch<SetStateAction<Mission[]>>;
    dontRepeatMission: boolean;
    ToggleDontRepeatMission: () => void;
}) {
    return (
        <>
            <MissionPoolSelection setMissionPool={setMissionPool} />
            <button
                className="group flex w-fit items-center justify-start bg-white p-1 text-zinc-900"
                onClick={ToggleDontRepeatMission}
                data-active={dontRepeatMission}
            >
                <div className="mr-2 aspect-square h-4 border-2 border-zinc-900 bg-white group-data-[active=true]:bg-red-500"></div>
                <span className="text-nowrap underline decoration-transparent decoration-2 group-hover:decoration-red-500">
                    {"No Repeated Missions"}
                </span>
            </button>
        </>
    );
}

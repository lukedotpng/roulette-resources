import { SpinManager } from "../../types";
import MatchSimLog from "../MatchComponents/MatchSimLog";
import MissionPoolSelection from "../PoolComponents/MissionPoolSelection";
import MissionQueueSelection from "../QueueComponents/MissionQueueSelection";

export default function SpinToolbar({
    spinManager,
}: {
    spinManager: SpinManager;
}) {
    const MissionSelection = () => {
        switch (spinManager.spinMode) {
            case "pool":
                return (
                    <MissionPoolSelection
                        className="group aspect-square h-full bg-white text-zinc-900 hover:bg-red-500 hover:text-white"
                        missionPool={spinManager.missionPool}
                        SetMissionPool={spinManager.SetMissionPool}
                    />
                );
            case "queue":
                return (
                    <MissionQueueSelection
                        className="group aspect-square h-full bg-white text-zinc-900 hover:bg-red-500 hover:text-white"
                        missionQueue={spinManager.missionQueue}
                        SetMissionQueue={spinManager.SetMissionQueue}
                    />
                );
        }
    };

    return (
        <div className="flex h-5 w-full max-w-[48rem] flex-wrap justify-center gap-1 text-[.9em] sm:h-8 sm:gap-2 sm:text-[1em]">
            <div className="flex w-28 sm:w-40">
                <button
                    className="group flex-1 border-red-500 bg-white text-zinc-900 hover:bg-red-500 hover:text-white data-[active=true]:border-b-2 sm:data-[active=true]:border-b-4"
                    onClick={() => {
                        spinManager.SetSpinMode("pool");
                    }}
                    data-active={spinManager.spinMode === "pool"}
                >
                    {"Pool"}
                </button>
                <button
                    className="group flex-1 border-red-500 bg-white text-zinc-900 hover:bg-red-500 hover:text-white data-[active=true]:border-b-2 sm:data-[active=true]:border-b-4"
                    onClick={() => {
                        spinManager.SetSpinMode("queue");
                    }}
                    data-active={spinManager.spinMode === "queue"}
                >
                    {"Queue"}
                </button>
            </div>
            {MissionSelection()}
            <div className="flex-1"></div>
            <button
                className="group w-16 border-red-500 bg-white text-zinc-900 hover:bg-red-500 hover:text-white data-[active=true]:border-b-2 sm:w-24 sm:data-[active=true]:border-b-4"
                onClick={() => {
                    spinManager.matchModeManager.SetEnabled(
                        !spinManager.matchModeManager.enabled,
                    );
                }}
                data-active={spinManager.matchModeManager.enabled}
            >
                {"Match Sim"}
            </button>
            {spinManager.matchModeManager.enabled ? (
                <MatchSimLog spinManager={spinManager} />
            ) : (
                <button
                    className="group aspect-square h-full border-white bg-white text-zinc-900 hover:border-red-500 hover:bg-red-500 hover:text-white data-[active=true]:border-b-2 data-[active=true]:border-red-500 sm:data-[active=true]:border-b-4"
                    onClick={() =>
                        spinManager.SetManualMode(!spinManager.manualMode)
                    }
                    data-active={spinManager.manualMode}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        className="h-[.875rem] w-full fill-zinc-900 group-hover:fill-white sm:h-[1.4rem]"
                    >
                        {/* Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2024 Fonticons, Inc. */}
                        <path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152L0 424c0 48.6 39.4 88 88 88l272 0c48.6 0 88-39.4 88-88l0-112c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 112c0 22.1-17.9 40-40 40L88 464c-22.1 0-40-17.9-40-40l0-272c0-22.1 17.9-40 40-40l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24L88 64z" />
                    </svg>
                </button>
            )}
        </div>
    );
}

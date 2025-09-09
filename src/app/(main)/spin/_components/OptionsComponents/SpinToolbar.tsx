import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { HitmapsSpin, Spin, SpinManager } from "../../types";
import MatchSimLog from "../MatchComponents/MatchSimLog";
import MissionPoolSelection from "../PoolComponents/MissionPoolSelection";
import MissionQueueSelection from "../QueueComponents/MissionQueueSelection";
import SpinOptionsSection from "./SpinOptionsSection";
import { GenerateRandomSeed, HitmapsSpinParse } from "../../utils/SpinUtils";
import useSWR from "swr";
import Link from "next/link";

export default function SpinToolbar({
    spinManager,
}: {
    spinManager: SpinManager;
}) {
    const [queueSeedInput, setQueueSeedInput] = useState(spinManager.queueSeed);

    useEffect(() => {
        setQueueSeedInput(spinManager.queueSeed);
    }, [spinManager.queueSeed]);

    const fetcher = async (url: string) => fetch(url).then((res) => res.json());
    const dailySpinResponse = useSWR<{
        date: string;
        slug: string;
        spin: HitmapsSpin;
        spin_id: string;
    }>("https://daily.ohshitman.fun/api/spin_data", fetcher);

    const [dailySpinDate, setDailySpinDate] = useState("");
    const [dailySpin, setDailySpin] = useState<Spin | null>(null);

    useEffect(() => {
        if (dailySpinResponse.isLoading) {
            return;
        }

        if (dailySpinResponse.error) {
            console.log("ERROR LOADING DAILY SPIN");
            console.log(dailySpinResponse.error);
            return;
        }

        if (dailySpinResponse.data === undefined) {
            return;
        }

        console.log(dailySpinResponse.data);

        const parsedSpin = HitmapsSpinParse(dailySpinResponse.data.spin);
        if (parsedSpin === null) {
            return;
        }

        setDailySpin(parsedSpin);
        setDailySpinDate(dailySpinResponse.data.date);
    }, [
        dailySpinResponse.data,
        dailySpinResponse.error,
        dailySpinResponse.isLoading,
    ]);

    function LoadDailySpin() {
        if (dailySpin === null) {
            return;
        }
        spinManager.SetCurrentSpin(dailySpin);
    }

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
            case "seeded_queue":
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
        <div className="flex w-full max-w-[48rem] flex-col gap-2 sm:gap-3">
            <div className="flex h-5 w-full flex-wrap justify-center gap-1 text-[.9em] sm:h-8 sm:gap-2 sm:text-[1em]">
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
                        data-active={
                            spinManager.spinMode === "queue" ||
                            spinManager.spinMode === "seeded_queue"
                        }
                    >
                        {"Queue"}
                    </button>
                </div>
                {MissionSelection()}
                <div className="flex-1"></div>
                {spinManager.spinMode !== "seeded_queue" && (
                    <button
                        className="group w-16 border-red-500 bg-white text-zinc-900 hover:bg-red-500 hover:text-white data-[active=true]:border-b-2 sm:w-24 sm:data-[active=true]:border-b-4"
                        onClick={() => {
                            if (spinManager.matchModeManager.enabled) {
                                spinManager.matchModeManager.DisableMatchMode();
                            } else {
                                spinManager.matchModeManager.EnableMatchMode();
                            }
                        }}
                        data-active={spinManager.matchModeManager.enabled}
                    >
                        {"Match Sim"}
                    </button>
                )}
                {spinManager.matchModeManager.enabled && (
                    <MatchSimLog spinManager={spinManager} />
                )}
                {!spinManager.matchModeManager.enabled &&
                    spinManager.spinMode !== "seeded_queue" && (
                        <button
                            className="group aspect-square h-full border-white bg-white text-zinc-900 hover:border-red-500 hover:bg-red-500 hover:text-white data-[active=true]:border-b-2 data-[active=true]:border-red-500 sm:data-[active=true]:border-b-4"
                            onClick={() =>
                                spinManager.SetManualMode(
                                    !spinManager.manualMode,
                                )
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
                <SpinOptionsSection
                    options={spinManager.options}
                    currentSpin={spinManager.currentSpin}
                />
            </div>
            <div className="flex h-5 w-full flex-wrap gap-1 text-[.9em] sm:h-8 sm:gap-2 sm:text-[1em]">
                {spinManager.spinMode === "seeded_queue" && (
                    <form
                        className="flex h-full w-full max-w-[50%] gap-1"
                        onSubmit={(e: FormEvent<HTMLFormElement>) => {
                            e.preventDefault();
                            spinManager.SetQueueSeed(queueSeedInput);
                        }}
                    >
                        <label className="-mr-1 bg-white px-1 leading-5 text-zinc-900 sm:leading-8">
                            {"Seed:"}
                        </label>
                        <input
                            className="group flex-1 border-1 border-white bg-white px-1 text-zinc-900 inset-shadow-[0px_0px_5px] inset-shadow-zinc-900 outline-0 focus:inset-shadow-red-500"
                            value={queueSeedInput}
                            spellCheck={false}
                            onInput={(e: ChangeEvent<HTMLInputElement>) => {
                                setQueueSeedInput(e.currentTarget.value);
                            }}
                        />
                        <button
                            className="group aspect-square h-full border-white bg-white text-zinc-900 hover:border-red-500 hover:bg-red-500 hover:text-white data-[active=true]:border-b-2 data-[active=true]:border-red-500 sm:data-[active=true]:border-b-4"
                            type="button"
                            onClick={() => {
                                setQueueSeedInput(GenerateRandomSeed());
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512"
                                className="h-[.875rem] w-full fill-zinc-900 group-hover:fill-white sm:h-[1.4rem]"
                            >
                                {/*Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2024 Fonticons, Inc.*/}
                                <path d="M105.1 202.6c7.7-21.8 20.2-42.3 37.8-59.8c62.5-62.5 163.8-62.5 226.3 0L386.3 160 352 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l111.5 0c0 0 0 0 0 0l.4 0c17.7 0 32-14.3 32-32l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 35.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5zM39 289.3c-5 1.5-9.8 4.2-13.7 8.2c-4 4-6.7 8.8-8.1 14c-.3 1.2-.6 2.5-.8 3.8c-.3 1.7-.4 3.4-.4 5.1L16 432c0 17.7 14.3 32 32 32s32-14.3 32-32l0-35.1 17.6 17.5c0 0 0 0 0 0c87.5 87.4 229.3 87.4 316.7 0c24.4-24.4 42.1-53.1 52.9-83.8c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.5 62.5-163.8 62.5-226.3 0l-.1-.1L125.6 352l34.4 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L48.4 288c-1.6 0-3.2 .1-4.8 .3s-3.1 .5-4.6 1z" />
                            </svg>
                        </button>
                        <button
                            type="submit"
                            disabled={queueSeedInput === spinManager.queueSeed}
                            className="group h-full border-white bg-white px-2 text-zinc-900 hover:border-red-500 hover:bg-red-500 hover:text-white disabled:pointer-events-none disabled:opacity-15"
                        >
                            <p>{"Apply"}</p>
                        </button>
                    </form>
                )}
                <div className="flex-1"></div>
                {!spinManager.matchModeManager.enabled &&
                    dailySpin !== null && (
                        <div className="flex h-full gap-1 sm:gap-2">
                            <button
                                className="w-16 items-center border-red-500 bg-white text-zinc-900 hover:bg-red-500 hover:text-white sm:w-24"
                                onClick={LoadDailySpin}
                            >
                                {"Daily Spin"}
                            </button>
                            <Link
                                href={
                                    "https://daily.ohshitman.fun/" +
                                    dailySpinDate
                                }
                                className="group flex aspect-square h-full items-center justify-center bg-white hover:bg-red-500"
                                target="_blank"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 512 512"
                                    className="w-[70%] group-hover:fill-white"
                                >
                                    {/*Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2024 Fonticons, Inc.*/}
                                    <path d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z" />
                                </svg>
                            </Link>
                        </div>
                    )}
            </div>
        </div>
    );
}

import { Missions } from "@/globals";
import { Mission } from "@/types";
import {
    Dialog,
    DialogTrigger,
    DialogPortal,
    DialogOverlay,
    DialogContent,
    DialogTitle,
} from "@radix-ui/react-dialog";
import { Dispatch, SetStateAction } from "react";
import { MapIDToDisplayText } from "../../../lib/SpinUtils";
import {
    SeasonOneMissions,
    SeasonTwoMissions,
    SeasonThreeMissions,
} from "../SpinGlobals";

export default function MissionQueueSelection({
    missionQueue,
    setMissionQueue,
}: {
    missionQueue: Mission[];
    setMissionQueue: Dispatch<SetStateAction<Mission[]>>;
}) {
    return (
        <Dialog>
            <DialogTrigger className="w-fit bg-white p-1 text-zinc-900 hover:bg-red-500 hover:text-white sm:p-2">
                Edit Queue
            </DialogTrigger>
            <DialogPortal>
                <DialogOverlay className="fixed inset-0 bg-zinc-900 opacity-80" />
                <DialogContent className="fixed top-1/2 left-1/2 max-h-[30rem] w-[90%] -translate-x-1/2 -translate-y-1/2 overflow-scroll rounded-lg bg-white sm:w-[30rem]">
                    <DialogTitle className="w-full p-2 text-center text-sm font-bold sm:p-3 sm:text-base">
                        Create Queue
                    </DialogTitle>
                    <section className="flex justify-between p-4 pt-2 text-xs sm:pt-4 sm:text-base">
                        <div className="flex flex-1 flex-col items-center">
                            <button
                                className="group flex h-8 w-full items-center gap-2 border-r-2 border-zinc-900 bg-white p-2 text-left text-zinc-900 hover:border-2 hover:border-red-500 data-[selected=true]:bg-red-500 data-[selected=true]:text-white sm:h-10"
                                onClick={() => {
                                    setMissionQueue([...Missions]);
                                }}
                            >
                                {"Trilogy"}
                            </button>
                            <button
                                className="group flex h-8 w-full items-center gap-2 border-r-2 border-zinc-900 bg-white p-2 text-left text-zinc-900 hover:border-2 hover:border-red-500 data-[selected=true]:bg-red-500 data-[selected=true]:text-white sm:h-10"
                                onClick={() => {
                                    setMissionQueue([...SeasonOneMissions]);
                                }}
                            >
                                {"Season 1"}
                            </button>
                            <button
                                className="group flex h-8 w-full items-center gap-2 border-r-2 border-zinc-900 bg-white p-2 text-left text-zinc-900 hover:border-2 hover:border-red-500 data-[selected=true]:bg-red-500 data-[selected=true]:text-white sm:h-10"
                                onClick={() => {
                                    setMissionQueue([...SeasonTwoMissions]);
                                }}
                            >
                                {"Season 2"}
                            </button>
                            <button
                                className="group flex h-8 w-full items-center gap-2 border-r-2 border-zinc-900 bg-white p-2 text-left text-zinc-900 hover:border-2 hover:border-red-500 data-[selected=true]:bg-red-500 data-[selected=true]:text-white sm:h-10"
                                onClick={() => {
                                    setMissionQueue([...SeasonThreeMissions]);
                                }}
                            >
                                {"Season 3"}
                            </button>
                            {Missions.map((mission) => {
                                return (
                                    <button
                                        key={mission}
                                        className="group flex h-8 w-full items-center gap-2 border-r-2 border-zinc-900 bg-white p-2 text-left text-zinc-900 hover:border-2 hover:border-red-500 data-[selected=true]:bg-red-500 data-[selected=true]:text-white sm:h-10"
                                        onClick={() => {
                                            const updatedMissionQueue =
                                                missionQueue;
                                            updatedMissionQueue.push(mission);
                                            setMissionQueue([
                                                ...updatedMissionQueue,
                                            ]);
                                        }}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 448 512"
                                            className="h-4 group-hover:fill-red-500 sm:h-6"
                                        >
                                            {/* <!--! Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2024 Fonticons, Inc. --> */}
                                            <path d="M64 80c-8.8 0-16 7.2-16 16l0 320c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-320c0-8.8-7.2-16-16-16L64 80zM0 96C0 60.7 28.7 32 64 32l320 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zM200 344l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
                                        </svg>
                                        {MapIDToDisplayText(mission)}
                                    </button>
                                );
                            })}
                        </div>
                        <div className="flex flex-1 flex-col items-center">
                            {missionQueue.map((mission, index) => {
                                return (
                                    <div
                                        key={index}
                                        className="flex h-8 w-full items-center bg-white pl-2 text-zinc-900 sm:h-10"
                                    >
                                        <button
                                            className="group flex w-6 items-center sm:h-6"
                                            onClick={() => {
                                                if (index === 0) {
                                                    return;
                                                }

                                                const missionToMove = mission;
                                                const updatedMissionQueue =
                                                    missionQueue;

                                                updatedMissionQueue[index] =
                                                    updatedMissionQueue[
                                                        index - 1
                                                    ];

                                                updatedMissionQueue[index - 1] =
                                                    missionToMove;

                                                setMissionQueue([
                                                    ...updatedMissionQueue,
                                                ]);
                                            }}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 384 512"
                                                className="h-3.5 fill-zinc-900 group-hover:fill-red-500 sm:h-4"
                                            >
                                                {/* Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2024 Fonticons, Inc. */}
                                                <path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2 160 448c0 17.7 14.3 32 32 32s32-14.3 32-32l0-306.7L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z" />
                                            </svg>
                                        </button>
                                        <button
                                            className="group flex h-6 w-6 items-center"
                                            onClick={() => {
                                                if (
                                                    index ===
                                                    missionQueue.length - 1
                                                ) {
                                                    return;
                                                }

                                                const missionToMove = mission;
                                                const updatedMissionQueue =
                                                    missionQueue;

                                                updatedMissionQueue[index] =
                                                    updatedMissionQueue[
                                                        index + 1
                                                    ];

                                                updatedMissionQueue[index + 1] =
                                                    missionToMove;

                                                setMissionQueue([
                                                    ...updatedMissionQueue,
                                                ]);
                                            }}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 384 512"
                                                className="h-3.5 fill-zinc-900 group-hover:fill-red-500 sm:h-4"
                                            >
                                                {/* Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2024 Fonticons, Inc. */}
                                                <path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" />
                                            </svg>
                                        </button>
                                        <span className="flex-1">
                                            {MapIDToDisplayText(mission)}
                                        </span>
                                        <button
                                            className="group/delete flex h-10 w-10 items-center justify-center"
                                            onClick={() => {
                                                let updatedMissionQueue =
                                                    missionQueue;
                                                updatedMissionQueue =
                                                    updatedMissionQueue.filter(
                                                        (_, i) => i !== index,
                                                    );
                                                setMissionQueue([
                                                    ...updatedMissionQueue,
                                                ]);
                                            }}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 448 512"
                                                className="h-3.5 fill-zinc-900 group-hover/delete:fill-red-500 sm:h-4"
                                            >
                                                {/* Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2024 Fonticons, Inc. */}
                                                <path d="M170.5 51.6L151.5 80l145 0-19-28.4c-1.5-2.2-4-3.6-6.7-3.6l-93.7 0c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80 368 80l48 0 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-8 0 0 304c0 44.2-35.8 80-80 80l-224 0c-44.2 0-80-35.8-80-80l0-304-8 0c-13.3 0-24-10.7-24-24S10.7 80 24 80l8 0 48 0 13.8 0 36.7-55.1C140.9 9.4 158.4 0 177.1 0l93.7 0c18.7 0 36.2 9.4 46.6 24.9zM80 128l0 304c0 17.7 14.3 32 32 32l224 0c17.7 0 32-14.3 32-32l0-304L80 128zm80 64l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16z" />
                                            </svg>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}

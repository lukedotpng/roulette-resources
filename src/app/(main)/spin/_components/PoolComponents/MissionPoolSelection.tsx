import {
    Mission,
    MissionPoolOptions,
    Option,
    Season,
    SeasonPoolSelected,
} from "@/types";

import {
    Dialog,
    DialogContent,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
    DialogTrigger,
} from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import {
    MissionPoolOptionsList,
    SeasonOneMissions,
    SeasonPoolSelectedList,
    SeasonThreeMissions,
    SeasonTwoMissions,
} from "../../utils/SpinGlobals";
import { MISSIONS } from "@/utils/globals";
import { MissionIDToDisplayText } from "@/utils/FormattingUtils";

export default function MissionPoolSelection({
    className,
    missionPool,
}: {
    className: string;
    missionPool: Option<Mission[]>;
}) {
    const seasonsList: Season[] = ["season_1", "season_2", "season_3"];

    function InitializeMissionPoolOptions(
        missionPool: Mission[],
    ): MissionPoolOptions {
        const missionPoolOptions = structuredClone(MissionPoolOptionsList);
        MISSIONS.forEach((mission) => {
            if (missionPool.includes(mission)) {
                missionPoolOptions[mission] = true;
            }
        });
        return missionPoolOptions;
    }

    const [missionsPoolOptions, setMissionsPoolOptions] =
        useState<MissionPoolOptions>(
            InitializeMissionPoolOptions(missionPool.val),
        );

    const [seasonsSelected, setSeasonsSelected] = useState<SeasonPoolSelected>(
        SeasonPoolSelectedList,
    );

    useEffect(() => {
        let seasonOneAllSelected = true;
        for (let i = 0; i < SeasonOneMissions.length; i++) {
            if (!missionsPoolOptions[SeasonOneMissions[i]]) {
                seasonOneAllSelected = false;
            }
        }

        let seasonTwoAllSelected = true;
        for (let i = 0; i < SeasonTwoMissions.length; i++) {
            if (!missionsPoolOptions[SeasonTwoMissions[i]]) {
                seasonTwoAllSelected = false;
            }
        }

        let seasonThreeAllSelected = true;
        for (let i = 0; i < SeasonThreeMissions.length; i++) {
            if (!missionsPoolOptions[SeasonThreeMissions[i]]) {
                seasonThreeAllSelected = false;
            }
        }

        setSeasonsSelected({
            season_1: seasonOneAllSelected,
            season_2: seasonTwoAllSelected,
            season_3: seasonThreeAllSelected,
        });
        const updatedMissionPool: Mission[] = [];

        MISSIONS.map((mission) => {
            if (missionsPoolOptions[mission]) {
                updatedMissionPool.push(mission);
            }
        });

        missionPool.Set(updatedMissionPool);
    }, [missionsPoolOptions]);

    return (
        <Dialog>
            <DialogTrigger className={className}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                    className="h-[.875rem] w-full fill-zinc-900 group-hover:fill-white sm:h-[1.4rem]"
                >
                    {/* Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2024 Fonticons, Inc. */}
                    <path d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z" />
                </svg>
            </DialogTrigger>
            <DialogPortal>
                <DialogOverlay className="fixed inset-0 bg-zinc-900 opacity-80" />
                <DialogContent className="fixed top-1/2 left-1/2 w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white sm:w-[30rem]">
                    <DialogTitle className="w-full p-3 text-center text-base font-bold sm:text-xl">
                        Select Missions
                    </DialogTitle>
                    <section className="flex justify-between gap-2 p-4 text-xs sm:text-base">
                        {seasonsList.map((season) => {
                            let seasonMissionList: Mission[] = [];
                            switch (season) {
                                case "season_1":
                                    seasonMissionList = SeasonOneMissions;
                                    break;
                                case "season_2":
                                    seasonMissionList = SeasonTwoMissions;
                                    break;
                                case "season_3":
                                    seasonMissionList = SeasonThreeMissions;
                                    break;
                                default:
                                    break;
                            }

                            return (
                                <div
                                    className="flex flex-1 flex-col items-center"
                                    key={season}
                                >
                                    <button
                                        data-selected={seasonsSelected[season]}
                                        className="h-8 w-full border-2 border-white bg-white text-zinc-900 first:mb-3 hover:border-red-500 data-[selected=true]:bg-red-500 data-[selected=true]:text-white sm:h-10"
                                        onClick={() => {
                                            const updatedMissionsPoolOptions =
                                                missionsPoolOptions;

                                            seasonMissionList.map((mission) => {
                                                updatedMissionsPoolOptions[
                                                    mission
                                                ] = !seasonsSelected[season];
                                            });

                                            setMissionsPoolOptions({
                                                ...updatedMissionsPoolOptions,
                                            });
                                        }}
                                    >
                                        <h2 className="font-bold">
                                            {MissionIDToDisplayText(season)}
                                        </h2>
                                    </button>
                                    {seasonMissionList.map((mission) => {
                                        return (
                                            <button
                                                key={mission}
                                                data-selected={
                                                    missionsPoolOptions[mission]
                                                }
                                                className="h-fit w-full border-2 border-white bg-white py-1 text-zinc-900 hover:border-red-500 data-[selected=true]:bg-red-500 data-[selected=true]:text-white sm:py-2"
                                                onClick={() => {
                                                    setMissionsPoolOptions({
                                                        ...missionsPoolOptions,
                                                        [mission]:
                                                            !missionsPoolOptions[
                                                                mission
                                                            ],
                                                    });
                                                }}
                                            >
                                                {MissionIDToDisplayText(
                                                    mission,
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </section>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}

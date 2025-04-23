"use client";

import { Mission } from "@/types";
import { useState } from "react";
import { GenerateSpin } from "../utils/SpinGenerationUtils";
import { GenerateSpin as KillMethodFirstGenerateSpin } from "../utils/AlternateSpinGens/KillMethodFirstSpinGeneration";
import { GenerateSpin as RespinConditionGenerateSpin } from "../utils/AlternateSpinGens/RespinConditionSpinGeneration";
// import { GenerateSpin as FullRespinGenerateSpin } from "../utils/FullRespinSpinGeneration";
// import { GenerateSpin as PartialRespinGenerateSpin } from "../utils/PartialRespinSpinGeneration";

import MissionSwitcher from "../_components/PoolComponents/MissionSwitcher";
import SpinStatsSection from "./_components/SpinStatsSection";

export default function Page() {
    const [mission, setMission] = useState<Mission>("paris");

    return (
        <main className="my-4 flex w-full flex-col items-center gap-4 text-xs text-white sm:text-sm">
            <MissionSwitcher
                currentMission={mission}
                HandleMissionSwitch={(mission: Mission) => {
                    setMission(mission);
                }}
            />
            <SpinStatsSection
                title="Current Generator - Disguise then Kill"
                mission={mission}
                GenerateSpin={GenerateSpin}
            />
            <SpinStatsSection
                title="Kill Then Disguise"
                mission={mission}
                GenerateSpin={KillMethodFirstGenerateSpin}
            />
            <SpinStatsSection
                title="Respin Condition"
                mission={mission}
                GenerateSpin={RespinConditionGenerateSpin}
            />
            {/* <SpinStatsSection
                title="Respin each target on illegal condition"
                mission={mission}
                GenerateSpin={PartialRespinGenerateSpin}
            />
            <SpinStatsSection
                title="Respin all targets on illegal spin"
                mission={mission}
                GenerateSpin={FullRespinGenerateSpin}
            /> */}
        </main>
    );
}

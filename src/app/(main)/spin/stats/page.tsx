"use client";

import { Mission } from "@/types";
import { useState } from "react";
import { GenerateSpin } from "@/lib/RouletteSpinner/generation";

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
        </main>
    );
}

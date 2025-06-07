import { MissionIDToDisplayText } from "@/utils/FormattingUtils";
import { Mission } from "@/types";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
} from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import {
    SEASON_ONE_MISSIONS,
    SEASON_THREE_MISSIONS,
    SEASON_TWO_MISSIONS,
} from "../../utils/SpinGlobals";

export default function MissionSwitcher({
    currentMission,
    HandleMissionSwitch,
    textColor = "white",
}: {
    currentMission: Mission;
    HandleMissionSwitch: (mission: Mission) => void;
    textColor?: string;
}) {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <DropdownMenu
            modal={false}
            open={dropdownOpen}
            onOpenChange={setDropdownOpen}
        >
            <DropdownMenuTrigger asChild className={"text-" + textColor}>
                <button className="group flex h-5 items-center justify-center gap-1 font-bold outline-hidden sm:h-8">
                    <span>{MissionIDToDisplayText(currentMission)}</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 320 512"
                        className={
                            "mt-0.5 aspect-square h-2.5 group-data-[state=open]:rotate-90 sm:mt-0.5 sm:h-3.5 " +
                            "fill-" +
                            textColor
                        }
                    >
                        {/* Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2024 Fonticons, Inc. */}
                        <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
                    </svg>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="z-10 mt-1 flex h-fit w-[22rem] rounded-md bg-white text-zinc-900 shadow-2xl shadow-black sm:w-[32rem]"
                onCloseAutoFocus={(event: Event) => {
                    event.preventDefault();
                }}
            >
                <div className="flex h-fit flex-1 flex-col rounded-t-md bg-white">
                    <h2 className="text-center text-[1.05em] font-bold underline">
                        {"Season 1"}
                    </h2>
                    {SEASON_ONE_MISSIONS.map((mission) => {
                        return (
                            <button
                                key={mission}
                                onClick={() => {
                                    setDropdownOpen(false);
                                    HandleMissionSwitch(mission);
                                }}
                                className="bg-white px-1 py-2 text-zinc-900 hover:bg-red-500 hover:text-white focus:bg-red-500 focus:text-white"
                            >
                                {MissionIDToDisplayText(mission)}
                            </button>
                        );
                    })}
                </div>
                <div className="flex h-fit flex-1 flex-col rounded-t-md bg-white">
                    <h2 className="text-center text-[1.05em] font-bold underline">
                        {"Season 2"}
                    </h2>
                    {SEASON_TWO_MISSIONS.map((mission) => {
                        return (
                            <button
                                key={mission}
                                onClick={() => {
                                    setDropdownOpen(false);
                                    HandleMissionSwitch(mission);
                                }}
                                className="bg-white px-1 py-2 text-zinc-900 hover:bg-red-500 hover:text-white focus:bg-red-500 focus:text-white"
                            >
                                {MissionIDToDisplayText(mission)}
                            </button>
                        );
                    })}
                </div>
                <div className="flex h-fit flex-1 flex-col rounded-t-md bg-white">
                    <h2 className="text-center text-[1.05em] font-bold underline">
                        {"Season 3"}
                    </h2>
                    {SEASON_THREE_MISSIONS.map((mission) => {
                        return (
                            <button
                                key={mission}
                                onClick={() => {
                                    setDropdownOpen(false);
                                    HandleMissionSwitch(mission);
                                }}
                                className="bg-white px-1 py-2 text-zinc-900 hover:bg-red-500 hover:text-white focus:bg-red-500 focus:text-white"
                            >
                                {MissionIDToDisplayText(mission)}
                            </button>
                        );
                    })}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

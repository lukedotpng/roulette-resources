"use client";

import { Mission } from "@/types";
import { MissionIDToDisplayText } from "@/utils/FormattingUtils";
import { Missions } from "@/utils/globals";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NotFound() {
    const pathname = usePathname();
    const pathnameSlug = pathname.split("/")[1];

    type MissionRanks = {
        [key in Mission]: 0;
    };
    function GetClosestMissionMatch() {
        const missionRanks: MissionRanks = {
            paris: 0,
            sapienza: 0,
            marrakesh: 0,
            bangkok: 0,
            colorado: 0,
            hokkaido: 0,
            miami: 0,
            santa_fortuna: 0,
            mumbai: 0,
            whittleton_creek: 0,
            ambrose_island: 0,
            isle_of_sgail: 0,
            new_york: 0,
            haven_island: 0,
            dubai: 0,
            dartmoor: 0,
            berlin: 0,
            chongqing: 0,
            mendoza: 0,
        };

        for (const mission of Missions) {
            const matchedLetterIndices: number[] = [];
            for (let i = 0; i < pathnameSlug.length; i++) {
                for (let j = 0; j < mission.length; j++) {
                    if (
                        pathnameSlug[i] === mission[j] &&
                        !matchedLetterIndices.includes(j)
                    ) {
                        missionRanks[mission]++;
                        // add bonus if its in same position
                        if (i === j) {
                            missionRanks[mission]++;
                        }
                        matchedLetterIndices.push(j);
                        break;
                    }
                }
            }
        }

        let closestMatch: Mission | null = null;
        let currentPeak = 0;
        for (const mission of Missions) {
            if (
                currentPeak < missionRanks[mission] &&
                (missionRanks[mission] >= 5 ||
                    missionRanks[mission] >= pathnameSlug.length - 2)
            ) {
                closestMatch = mission;
                currentPeak = missionRanks[mission];
            }
            console.log(mission + ":", missionRanks[mission]);
        }

        return closestMatch;
    }

    const closestMatch = GetClosestMissionMatch();

    return (
        <main className="mt-32 flex flex-1 flex-col items-center justify-center gap-5 text-white">
            <h1 className="text-[2em] font-bold">
                {"Error 404 - Page not found :("}
            </h1>
            {closestMatch && (
                <p className="text-center text-[1.5em] font-bold">
                    {`You searched for "${pathnameSlug}", did you mean`}{" "}
                    <Link
                        href={"/" + closestMatch}
                        className="italic decoration-red-500 hover:underline"
                    >
                        {MissionIDToDisplayText(closestMatch)}
                    </Link>
                    <span>{"?"}</span>
                </p>
            )}
            <div className="flex flex-col items-center gap-3">
                <h3 className="text-[1.4em] text-white">
                    {"Bored? Why don't you go spin around... "}
                </h3>
                <Link
                    href={"/spin"}
                    className="rounded-lg bg-white px-3 py-1 text-center text-[1.3em] font-bold text-zinc-900 decoration-red-500 decoration-2 hover:underline"
                >
                    {"Spin!"}
                </Link>
            </div>
        </main>
    );
}

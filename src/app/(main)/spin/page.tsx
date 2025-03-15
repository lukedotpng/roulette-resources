import { Missions } from "@/lib/globals";
import MainSection from "./_components/MainSection";
import { Metadata } from "next";
import { SpinInfo, SpinTarget } from "@/types";
import { CreateSpinQuery, GetSpinFromQuery } from "@/lib/SpinQueryUtils";
import { Suspense } from "react";
import {
    DisguiseIDToDisplayText,
    MethodIDToDisplayText,
    MissionIDToDisplayText,
    TargetIDToDisplayText,
} from "@/lib/FormattingUtils";

export async function generateMetadata({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
    let spinQuery = ((await searchParams).s as string) || "";

    const spin = GetSpinFromQuery(spinQuery, false, Missions);

    if (!spin) {
        return {
            title: "Play Roulette!",
            description: "Roulette Spinner to Help You Learn Roulette",
        };
    }

    spinQuery = CreateSpinQuery(spin);

    const title = MissionIDToDisplayText(spin.mission) + " Spin";

    let description = "";
    (Object.keys(spin.info) as (keyof SpinInfo)[]).map((target: SpinTarget) => {
        description += `${TargetIDToDisplayText(target)}: ${MethodIDToDisplayText(spin.info[target]?.condition)} / ${DisguiseIDToDisplayText(spin.info[target]?.disguise)}\n`;
    });

    return {
        title: "Roulette Spinner",
        description: description,
        openGraph: {
            title: title,
            description: description,
            siteName: "RouRe",
            url: `https://roulette.luke.town/spin?s=${spinQuery}`,
            images: [
                {
                    url: `/api/og?s=${spinQuery}`,
                    width: 1200,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            images: [
                {
                    url: `/api/og?s=${spinQuery}`,
                    width: 1200,
                },
            ],
        },
    };
}

export default function Page() {
    return (
        <Suspense
            fallback={
                <main className="m-3 flex flex-col items-center gap-3 text-xs sm:m-5 sm:gap-5 sm:text-base">
                    <h1>{"loading..."}</h1>
                </main>
            }
        >
            <MainSection />
        </Suspense>
    );
}

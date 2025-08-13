import { MISSIONS } from "@/utils/globals";
import MainSection from "./_components/MainSection";
import { Metadata } from "next";
import { CreateSpinQuery, GetSpinFromQuery } from "./utils/SpinQuery";
import {
    DisguiseIDToDisplayText,
    MethodIDToDisplayText,
    MissionIDToDisplayText,
    TargetIDToDisplayText,
} from "@/utils/FormattingUtils";
import { SpinInfo, SpinTarget } from "./types";

export async function generateMetadata({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
    let spinQuery = ((await searchParams).s as string) || "";

    const spin = GetSpinFromQuery(spinQuery, false, [...MISSIONS]);

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
        description += `${TargetIDToDisplayText(target)}: ${MethodIDToDisplayText(spin.info[target]?.killMethod)} / ${DisguiseIDToDisplayText(spin.info[target]?.disguise)}\n`;
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
    return <MainSection />;
}

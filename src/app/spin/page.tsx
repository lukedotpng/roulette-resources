export const dynamic = "force-dynamic";

import { Missions } from "@/globals";
import MainSection from "./_components/MainSections";
import {
    CreateSpinQuery,
    GetSpinFromQuery,
    ValidateSpinQuery,
} from "./SpinUtils";
import { Metadata } from "next";
import { Spin, SpinTarget } from "@/types";

export async function generateMetadata({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
    let spinQuery = ((await searchParams).s as string) || "";
    const validSpinQuery = ValidateSpinQuery(spinQuery);

    if (!validSpinQuery) {
        return {
            title: "Play Roulette!",
            description: "Roulette Spinner to Help You Learn Roulette",
        };
    }

    const missionSpin = GetSpinFromQuery(spinQuery, Missions);
    spinQuery = CreateSpinQuery(missionSpin);

    const title = NameIDToDisplayText(missionSpin.mission) + " Spin";

    let description = "";
    (Object.keys(missionSpin.spin) as (keyof Spin)[]).map(
        (target: SpinTarget) => {
            description += `${NameIDToDisplayText(target)}: ${MethodIDToDisplayText(missionSpin.spin[target]?.condition)} / ${DisguiseIDToDisplayText(missionSpin.spin[target]?.disguise)}\n`;
        },
    );

    return {
        title: title,
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

    return {
        title: title,
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

function MethodIDToDisplayText(item: string | undefined) {
    if (!item) {
        return "Err No Condition";
    }
    let itemDisplayText = "";
    // disguise ID example: paris-palace_staff
    const words = item.split("_"); // ["palace", "staff"]

    for (let word of words) {
        if (word.toLowerCase() === "smg") {
            word = "SMG";
        }
        itemDisplayText += word.charAt(0).toUpperCase() + word.slice(1) + " ";
    }

    return itemDisplayText.trim();
}

function DisguiseIDToDisplayText(disguise: string | undefined) {
    if (!disguise) {
        return "Err No Disguise";
    }
    let disguiseDisplayText = "";
    const words = disguise.split("_"); // ["palace", "staff"]

    for (const word of words) {
        disguiseDisplayText +=
            word.charAt(0).toUpperCase() + word.slice(1) + " ";
    }

    return disguiseDisplayText.trim();
}

function NameIDToDisplayText(target: string) {
    let nameDisplayText = "";
    const words = target.split("_");

    for (let word of words) {
        if (word.toLowerCase() === "ica") {
            word = "ICA";
        }
        if (word.toLowerCase() === "of") {
            nameDisplayText += word.toLowerCase() + " ";
        } else {
            nameDisplayText +=
                word.charAt(0).toUpperCase() + word.slice(1) + " ";
        }
    }

    return nameDisplayText.trim();
}

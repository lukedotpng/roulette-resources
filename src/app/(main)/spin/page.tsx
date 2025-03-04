import { Missions } from "@/globals";
import MainSection from "./_components/MainSection";
import { Metadata } from "next";
import { SpinInfo, SpinTarget } from "@/types";
import { CreateSpinQuery, GetSpinFromQuery } from "@/lib/SpinQueryUtils";
import { Suspense } from "react";

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

    const title = NameIDToDisplayText(spin.mission) + " Spin";

    let description = "";
    (Object.keys(spin.info) as (keyof SpinInfo)[]).map((target: SpinTarget) => {
        description += `${NameIDToDisplayText(target)}: ${MethodIDToDisplayText(spin.info[target]?.condition)} / ${DisguiseIDToDisplayText(spin.info[target]?.disguise)}\n`;
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

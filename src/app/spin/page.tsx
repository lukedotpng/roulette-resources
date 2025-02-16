export const dynamic = "force-dynamic";

import { Missions } from "@/globals";
import MainSection from "./_components/MainSections";
import { CreateSpinQuery, GetSpinFromQuery } from "./SpinUtils";

export async function generateMetadata({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    let spinQuery = ((await searchParams).s as string) || "";

    const missionSpin = GetSpinFromQuery(spinQuery, Missions);
    spinQuery = CreateSpinQuery(missionSpin);

    const title =
        missionSpin.mission.charAt(0).toUpperCase() +
        missionSpin.mission.slice(1);

    return {
        title: title,
        openGraph: {
            title: title + "Spin",
            url: `/spin?s=${spinQuery}`,
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

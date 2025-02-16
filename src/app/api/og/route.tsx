import { GetSpinFromQuery } from "@/app/spin/SpinUtils";
import { Missions } from "@/globals";
import { ImageResponse } from "next/og";
import SpinInfoSection from "./SpinInfoSection";
import { Spin } from "@/types";

export async function GET(request: Request) {
    const spinQuery = new URL(request.url).searchParams.get("s") || "";
    const missionSpin = GetSpinFromQuery(spinQuery, Missions);

    const targetCount = Object.keys(missionSpin.spin).length;
    let noKoCount = 0;
    (Object.keys(missionSpin.spin) as (keyof Spin)[]).map((target) => {
        if (missionSpin.spin[target]?.ntko) {
            noKoCount++;
        }
    });

    const ogImageHeight =
        154 * targetCount + noKoCount * 40 + 5 * (targetCount - 1);

    return new ImageResponse(<SpinInfoSection missionSpin={missionSpin} />, {
        width: 600,
        height: ogImageHeight,
        status: 200,
    });
}

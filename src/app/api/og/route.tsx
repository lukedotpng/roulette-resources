import { ImageResponse } from "next/og";
import SpinInfoSection from "./SpinInfoSection";

import { GetSpinFromQuery } from "@/app/(main)/spin/utils/SpinQuery";
import { SpinInfo } from "@/lib/RouletteSpinner/types";

export async function GET(request: Request) {
    const spinQuery = new URL(request.url).searchParams.get("s") || "";
    const spin = GetSpinFromQuery(spinQuery, false);

    if (!spin) {
        return;
    }

    const targetCount = Object.keys(spin.info).length;
    let noKoCount = 0;
    (Object.keys(spin.info) as (keyof SpinInfo)[]).map((target) => {
        if (spin.info[target]?.ntko) {
            noKoCount++;
        }
    });

    const ogImageHeight =
        154 * targetCount + noKoCount * 40 + 5 * (targetCount - 1);

    return new ImageResponse(<SpinInfoSection spin={spin} />, {
        width: 600,
        height: ogImageHeight,
        status: 200,
    });
}

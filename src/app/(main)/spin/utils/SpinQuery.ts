import { GenerateSpin } from "@/lib/RouletteSpinner/generation";
import { GetRandomMission } from "./SpinUtils";
import { MISSIONS } from "@/lib/RouletteSpinner/globals";
import { Mission, Spin } from "@/lib/RouletteSpinner/types";
import { ParseSpinQuery } from "@/lib/RouletteSpinner/queryParser";

export function GetSpinFromQuery(
    query: string,
    generateSpinOnError: boolean,
    missionPool?: Mission[],
): Spin | null {
    if (!query) {
        if (!generateSpinOnError) {
            return null;
        }
        return GenerateSpin(GetRandomMission(missionPool || [...MISSIONS]));
    }
    const parsedSpin = ParseSpinQuery(query);
    if (!parsedSpin) {
        if (!generateSpinOnError) {
            return null;
        }
        return GenerateSpin(GetRandomMission(missionPool || [...MISSIONS]));
    }

    return parsedSpin;
}

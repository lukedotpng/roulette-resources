import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { GetSpinFromQuery } from "./utils/SpinQuery";
import { MatchModeManager, SpinOptions } from "./types";
import { Mission } from "@/types";
import { GetRandomMission } from "./utils/SpinUtils";
import { Spin } from "@/lib/RouletteSpinner/types";
import { GenerateSpin } from "@/lib/RouletteSpinner/generation";
import { CreateSpinQuery } from "@/lib/RouletteSpinner/queryParser";

export function useSpinQuery(
    currentSpin: Spin | null,
    SetCurrentSpin: (spin: Spin | null) => void,
    options: SpinOptions,
    matchModeManager: MatchModeManager,
    missionPool: Mission[],
) {
    const searchParams = useSearchParams();

    const [query, setQuery] = useState("");

    // Update current spin on page navigation
    useEffect(() => {
        const newSpinQuery = searchParams.get("s") ?? "";

        if (newSpinQuery === query && newSpinQuery !== "") {
            return;
        }

        let newSpin: Spin | null;
        if (newSpinQuery === "") {
            newSpin = GenerateSpin(GetRandomMission(missionPool));
        } else {
            newSpin = GetSpinFromQuery(newSpinQuery, false);
        }

        setQuery(newSpinQuery);
        SetCurrentSpin(newSpin);
    }, [searchParams]);

    useEffect(() => {
        if (!currentSpin) {
            return;
        }

        const spinQuery = CreateSpinQuery(currentSpin);
        const params = new URLSearchParams(searchParams.toString());

        const previousQuery = params.get("s");

        if (previousQuery === spinQuery) {
            return;
        }

        setQuery(spinQuery);

        if (
            options.updateUrlOnSpin.value &&
            !(matchModeManager.enabled && !matchModeManager.matchActive)
        ) {
            window.history.pushState(null, "", `/spin?s=${spinQuery}`);
        }
    }, [currentSpin, matchModeManager.matchActive, matchModeManager.enabled]);

    return query;
}

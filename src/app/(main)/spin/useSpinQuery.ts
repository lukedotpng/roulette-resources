import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CreateSpinQuery, GetSpinFromQuery } from "./utils/SpinQuery";
import { MatchModeManager, Spin, SpinOptions } from "./types";

export function useSpinQuery(
    currentSpin: Spin | null,
    SetCurrentSpin: (spin: Spin | null) => void,
    matchModeManager: MatchModeManager,
    options: SpinOptions,
) {
    const searchParams = useSearchParams();

    const [query, setQuery] = useState(searchParams.get("s") ?? "");

    // Update current spin on page navigation
    useEffect(() => {
        const newSpinQuery = searchParams.get("s") ?? "";

        const newSpin: Spin | null = GetSpinFromQuery(newSpinQuery, false);
        setQuery(newSpinQuery);
        SetCurrentSpin(newSpin);
    }, [searchParams, SetCurrentSpin]);

    // Update URL spin query on spin updates
    useEffect(() => {
        if (!currentSpin) {
            return;
        }
        const spinQuery = CreateSpinQuery(currentSpin);

        const params = new URLSearchParams(searchParams.toString());

        const prevQuery = params.toString();
        params.set("s", spinQuery);

        if (
            !options.updateUrlOnSpin.value ||
            (matchModeManager.enabled && !matchModeManager.matchActive)
        ) {
            setQuery(spinQuery);
            return;
        }

        if (prevQuery !== params.toString()) {
            window.history.pushState(null, "", `/spin?${params.toString()}`);
        }
    }, [
        currentSpin,
        matchModeManager.enabled,
        matchModeManager.matchActive,
        options.updateUrlOnSpin.value,
        searchParams,
    ]);

    return query;
}

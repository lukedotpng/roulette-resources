import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CreateSpinQuery, GetSpinFromQuery } from "./utils/SpinQuery";
import { Spin, SpinOptions, SpinQuery } from "./types";
import { Mission } from "@/types";
import { GenerateSpin } from "./utils/SpinGeneration";
import { GetRandomMission } from "./utils/SpinUtils";

export function useSpinQuery(
    SetCurrentSpin: (spin: Spin | null) => void,
    options: SpinOptions,
    missionPool: Mission[],
): SpinQuery {
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

    function UpdateQuery(spin: Spin) {
        const spinQuery = CreateSpinQuery(spin);

        const params = new URLSearchParams(searchParams.toString());

        const prevQuery = params.get("s");
        if (prevQuery === spinQuery) {
            return;
        }

        setQuery(spinQuery);
        if (options.updateUrlOnSpin.value) {
            window.history.pushState(null, "", `/spin?s=${spinQuery}`);
        }
    }

    return {
        query: query,
        UpdateQuery: UpdateQuery,
    };
}

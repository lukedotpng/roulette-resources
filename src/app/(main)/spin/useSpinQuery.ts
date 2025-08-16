import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CreateSpinQuery, GetSpinFromQuery } from "./utils/SpinQuery";
import { Spin, SpinOptions, SpinQuery } from "./types";

export function useSpinQuery(
    SetCurrentSpin: (spin: Spin | null) => void,
    options: SpinOptions,
): SpinQuery {
    const searchParams = useSearchParams();

    const [query, setQuery] = useState("");

    // Update current spin on page navigation
    useEffect(() => {
        const newSpinQuery = searchParams.get("s") ?? "";

        if (newSpinQuery === query) {
            return;
        }

        const newSpin: Spin | null = GetSpinFromQuery(newSpinQuery, false);
        setQuery(newSpinQuery);
        SetCurrentSpin(newSpin);
    }, [searchParams]);

    function UpdateQuery(spin: Spin) {
        const spinQuery = CreateSpinQuery(spin);

        const params = new URLSearchParams(searchParams.toString());

        const prevQuery = params.get("s");

        if (!options.updateUrlOnSpin.value) {
            return;
        }

        setQuery(spinQuery);

        if (prevQuery !== spinQuery) {
            window.history.pushState(null, "", `/spin?s=${spinQuery}`);
        }
    }

    return {
        query: query,
        UpdateQuery: UpdateQuery,
    };
}

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Spin, SpinOptions } from "@/types";
import { CreateSpinQuery, GetSpinFromQuery } from "./utils/SpinQueryUtils";

export function useSpinQuery(
    currentSpin: Spin | undefined,
    UpdateSpin: (spin: Spin) => void,
    options: SpinOptions,
) {
    const searchParams = useSearchParams();

    const [query, setQuery] = useState(searchParams.get("s") ?? "");

    useEffect(() => {
        const newQuery = searchParams.get("s") ?? "";
        let currentSpinQuery = "";
        if (currentSpin) {
            currentSpinQuery = CreateSpinQuery(currentSpin);
        }

        const newSpin = GetSpinFromQuery(newQuery, false);
        setQuery(newQuery);
        if (newSpin && newQuery !== currentSpinQuery) {
            UpdateSpin(newSpin);
        }
    }, [searchParams]);

    useEffect(() => {
        if (!currentSpin) {
            return;
        }
        const spinQuery = CreateSpinQuery(currentSpin);

        const params = new URLSearchParams(searchParams.toString());

        const prevQuery = params.toString();
        params.set("s", spinQuery);

        if (!options.updateQuery.val) {
            setQuery(spinQuery);
            return;
        }

        if (prevQuery !== params.toString()) {
            window.history.pushState(null, "", `/spin?${params.toString()}`);
        }
    }, [currentSpin]);

    return query;
}

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Spin, SpinSettings } from "@/types";
import { CreateSpinQuery, GetSpinFromQuery } from "@/lib/SpinQueryUtils";

export function useSpinQuery(
    currentSpin: Spin | undefined,
    UpdateSpin: (spin: Spin) => void,
    settings: SpinSettings,
) {
    const searchParams = useSearchParams();

    const [query, setQuery] = useState(searchParams.get("s") ?? "");

    useEffect(() => {
        const spin = GetSpinFromQuery(searchParams.get("s") ?? "", false);
        setQuery(searchParams.get("s") ?? "");
        if (spin) {
            UpdateSpin(spin);
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

        if (!settings.updateQuery) {
            setQuery(spinQuery);
            return;
        }

        if (prevQuery !== params.toString()) {
            window.history.pushState(null, "", `/spin?${params.toString()}`);
            console.log("Updating URL");
        }
    }, [currentSpin]);

    return query;
}

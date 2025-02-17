import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Spin } from "@/types";
import { CreateSpinQuery, GetSpinFromQuery } from "@/lib/SpinQueryUtils";

export function useSpinQuery(
    currentSpin: Spin,
    UpdateSpin: (spin: Spin) => void,
) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [query, setQuery] = useState(searchParams.get("s") ?? "");

    useEffect(() => {
        const spin = GetSpinFromQuery(searchParams.get("s") ?? "", false);
        setQuery(searchParams.get("s") ?? "");
        if (spin) {
            UpdateSpin(spin);
        }
    }, [searchParams]);

    useEffect(() => {
        const spinQuery = CreateSpinQuery(currentSpin);

        const params = new URLSearchParams(searchParams.toString());
        params.set("s", spinQuery);
        router.push(`/spin?${params.toString()}`);
    }, [currentSpin]);

    return query;
}

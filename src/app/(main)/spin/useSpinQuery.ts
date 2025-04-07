import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Spin, SpinOptions } from "@/types";
import { CreateSpinQuery, GetSpinFromQuery } from "./utils/SpinQueryUtils";
import { GenerateSpin } from "./utils/SpinGenerationUtils";
import { Missions } from "@/utils/globals";

export function useSpinQuery(
    currentSpin: Spin | null,
    UpdateSpin: (spin: Spin) => void,
    matchActive: boolean,
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
        } else if (!newSpin) {
            if (options.queueMode.val) {
                if (options.missionQueue.val.length > 0) {
                    UpdateSpin(
                        GenerateSpin(
                            options.missionQueue.val[options.queueIndex.val],
                        ),
                    );
                } else {
                    options.missionQueue.Set(Missions);
                }
            } else {
                if (options.missionPool.val.length > 0) {
                    UpdateSpin(
                        GenerateSpin(
                            options.missionPool.val[
                                Math.floor(
                                    Math.random() *
                                        options.missionPool.val.length,
                                )
                            ],
                        ),
                    );
                } else {
                    UpdateSpin(
                        GenerateSpin(
                            Missions[
                                Math.floor(Math.random() * Missions.length)
                            ],
                        ),
                    );
                }
            }
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

        if (
            !options.updateQuery.val ||
            (options.matchMode.val && !matchActive)
        ) {
            setQuery(spinQuery);
            return;
        }

        if (prevQuery !== params.toString()) {
            window.history.pushState(null, "", `/spin?${params.toString()}`);
        }
    }, [currentSpin, matchActive, options.matchMode.val]);

    return query;
}

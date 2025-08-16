"use client";

import { supabase } from "@/utils/supabase";
import { useEffect, useState } from "react";
import SmallMaps from "./SmallMaps";
import LargeMaps from "./LargeMaps";
import Berlin from "./Berlin";
import TextOnly from "./TextOnly";
import { GetSpinFromQuery } from "@/app/(main)/spin/utils/SpinQuery";
import { Spin } from "@/app/(main)/spin/types";

export default function SpinSection({
    id,
    initialQuery,
    initialTheme,
}: {
    id: string;
    initialQuery: string;
    initialTheme: string;
}) {
    // const [query, setQuery] = useState(initialQuery);
    const [spin, setSpin] = useState<Spin | null>(
        GetSpinFromQuery(initialQuery, false),
    );
    const [theme, setTheme] = useState(initialTheme);
    const [startTime, setStartTime] = useState<number>(-1);
    const [matchActive, setMatchActive] = useState(false);

    useEffect(() => {
        const channel = supabase
            .channel("overlay-" + id)
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "roulette-resources-overlays",
                    filter: `id=eq.${id}`,
                },
                (payload) => {
                    const newQuery = payload.new["spin_query"];
                    const newTheme = payload.new["theme"];
                    const startTime = payload.new["spin_start_time"];
                    const matchActive = payload.new["match_active"];

                    console.log(payload.new);

                    if (newQuery) {
                        // setQuery(newQuery);
                        setTheme(newTheme);
                        setSpin(GetSpinFromQuery(newQuery, false));
                    }

                    if (startTime) {
                        setStartTime(startTime);
                    }
                    if (matchActive !== undefined) {
                        setMatchActive(matchActive);
                    } else {
                        setMatchActive(false);
                    }
                },
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [id]);

    if (!spin) {
        return <h1 className="text-5xl text-white">{"Error finding spin"}</h1>;
    }

    if (theme === "text") {
        return (
            <TextOnly
                spin={spin}
                startTime={startTime}
                matchActive={matchActive}
            />
        );
    }

    if (spin.mission === "berlin") {
        return (
            <Berlin
                spin={spin}
                startTime={startTime}
                matchActive={matchActive}
            />
        );
    } else if (Object.keys(spin.info).length > 2) {
        return (
            <LargeMaps
                spin={spin}
                startTime={startTime}
                matchActive={matchActive}
            />
        );
    } else {
        return (
            <SmallMaps
                spin={spin}
                startTime={startTime}
                matchActive={matchActive}
            />
        );
    }
}

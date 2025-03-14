"use client";

import { GetSpinFromQuery } from "@/lib/SpinQueryUtils";

import { Spin } from "@/types";
import { supabase } from "@/utils/supabase";
import { useEffect, useState } from "react";
import SmallMaps from "./SmallMaps";
import LargeMaps from "./LargeMaps";
import Berlin from "./Berlin";
import TextOnly from "./TextOnly";

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
    const [spin, setSpin] = useState<Spin | undefined>(
        GetSpinFromQuery(initialQuery, false),
    );
    const [theme, setTheme] = useState(initialTheme);

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
                    if (newQuery) {
                        // setQuery(newQuery);
                        setTheme(newTheme);
                        setSpin(GetSpinFromQuery(newQuery, false));
                    }
                },
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    if (!spin) {
        return <h1 className="text-5xl text-white">{"Error finding spin"}</h1>;
    }

    if (theme === "text_only") {
        return <TextOnly spin={spin} />;
    }

    if (spin.mission === "berlin") {
        return <Berlin spin={spin} />;
    } else if (Object.keys(spin.info).length > 2) {
        return <LargeMaps spin={spin} />;
    } else {
        return <SmallMaps spin={spin} />;
    }
}

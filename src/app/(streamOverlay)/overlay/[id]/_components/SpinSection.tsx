"use client";

import { supabase } from "@/utils/supabase";
import { useEffect, useState } from "react";

export default function SpinSection({
    id,
    initialQuery,
}: {
    id: string;
    initialQuery: string;
}) {
    const [query, setQuery] = useState(initialQuery);

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
                    if (newQuery) {
                        setQuery(newQuery);
                    }
                },
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return <h1 className="m-10 text-center text-5xl text-white">{query}</h1>;
}

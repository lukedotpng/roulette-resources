"use client";

import {
    DisguiseSelect,
    IsolationSelect,
    ItemSelect,
    Mission,
    RouteSelect,
    TimingsFlashcardSelect,
    UniqueKillSelect,
} from "@/types";
import DisguisesSection from "./_InfoComponents/Disguises/DisguisesSection";
import IsolationsSection from "./_InfoComponents/Isolations/IsolationsSection";
import ItemSection from "./_InfoComponents/Items/ItemSection";
import RoutesSection from "./_InfoComponents/Routes/RoutesSections";
import TimingsCardSection from "./_InfoComponents/TimingsCard/TimingsSection";
import UniqueKillsSection from "./_InfoComponents/UniqueKills/UniqueKillsSection";
import { use, useMemo, useState } from "react";

export default function Sections({
    mission,
    timingsFlashcardPromise,
    itemsPromise,
    disguisesPromise,
    isolationsPromise,
    uniqueKillsPromise,
    routesPromise,
}: {
    mission: Mission;
    timingsFlashcardPromise: Promise<TimingsFlashcardSelect | undefined>;
    itemsPromise: Promise<ItemSelect[]>;
    disguisesPromise: Promise<DisguiseSelect[]>;
    isolationsPromise: Promise<IsolationSelect[]>;
    uniqueKillsPromise: Promise<UniqueKillSelect[]>;
    routesPromise: Promise<RouteSelect[]>;
}) {
    const timingsFlashcard = use(timingsFlashcardPromise);
    const items = use(itemsPromise);
    const disguises = use(disguisesPromise);
    const isolations = use(isolationsPromise);
    const uniqueKills = use(uniqueKillsPromise);
    const routes = use(routesPromise);

    const [filterQuery, setFilterQuery] = useState("");
    /* eslint-disable-next-line */
    function SetFilterQuery(newFilterQuery: string) {
        setFilterQuery(newFilterQuery);
    }

    const {
        filteredItems,
        filteredDisguises,
        filteredIsolations,
        filteredUniqueKills,
        filteredRoutes,
    } = useMemo(() => {
        const filteredItems = items.filter((item) => {
            if (item.name.toLowerCase().includes(filterQuery)) {
                return true;
            }
            if (item.type.toLowerCase() === filterQuery) {
                return true;
            }
        });
        const filteredDisguises = [...disguises];
        const filteredIsolations = [...isolations];
        const filteredUniqueKills = [...uniqueKills];
        const filteredRoutes = [...routes];

        return {
            filteredItems,
            filteredDisguises,
            filteredIsolations,
            filteredUniqueKills,
            filteredRoutes,
        };
    }, [filterQuery]);

    return (
        <>
            {/* <ResourceFilter SetFilterQuery={SetFilterQuery} /> */}
            {/* Dont show timings flashcard when searching */}
            {filterQuery.trim() === "" && (
                <TimingsCardSection
                    mission={mission as Mission}
                    timingsFlashcard={timingsFlashcard}
                />
            )}
            <ItemSection mission={mission as Mission} items={filteredItems} />
            <DisguisesSection
                mission={mission as Mission}
                disguises={filteredDisguises}
            />
            <IsolationsSection
                mission={mission as Mission}
                isolations={filteredIsolations}
            />
            <UniqueKillsSection
                mission={mission as Mission}
                uniqueKills={filteredUniqueKills}
            />
            <RoutesSection
                mission={mission as Mission}
                routes={filteredRoutes}
            />
        </>
    );
}

"use client";

import {
    DisguiseSelect,
    IsolationSelect,
    ItemSelect,
    Mission,
    RouteSelect,
    TechSelect,
    TimingsFlashcardSelect,
    UniqueKillSelect,
} from "@/types";
import DisguisesSection from "./_InfoComponents/Disguises/DisguisesSection";
import IsolationsSection from "./_InfoComponents/Isolations/IsolationsSection";
import ItemSection from "./_InfoComponents/Items/ItemSection";
import RoutesSection from "./_InfoComponents/Routes/RoutesSections";
import TimingsCardSection from "./_InfoComponents/TimingsCard/TimingsSection";
import UniqueKillsSection from "./_InfoComponents/UniqueKills/UniqueKillsSection";
import { use, useEffect, useMemo, useState } from "react";
import TechSection from "./_InfoComponents/Tech/TechSections";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import MissionPageNav from "./_components/MissionPageNav";

export default function MainContent({
    mission,
    timingsFlashcardPromise,
    itemsPromise,
    disguisesPromise,
    isolationsPromise,
    uniqueKillsPromise,
    routesPromise,
    techPromise,
}: {
    mission: Mission;
    timingsFlashcardPromise: Promise<TimingsFlashcardSelect | undefined>;
    itemsPromise: Promise<ItemSelect[]>;
    disguisesPromise: Promise<DisguiseSelect[]>;
    isolationsPromise: Promise<IsolationSelect[]>;
    uniqueKillsPromise: Promise<UniqueKillSelect[]>;
    routesPromise: Promise<RouteSelect[]>;
    techPromise: Promise<TechSelect[]>;
}) {
    const searchParams = useSearchParams();

    const timingsFlashcard = use(timingsFlashcardPromise);
    const items = use(itemsPromise);
    const disguises = use(disguisesPromise);
    const isolations = use(isolationsPromise);
    const uniqueKills = use(uniqueKillsPromise);
    const routes = use(routesPromise);
    const tech = use(techPromise);

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
        filteredTech,
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
        const filteredTech = [...tech];

        return {
            filteredItems,
            filteredDisguises,
            filteredIsolations,
            filteredUniqueKills,
            filteredRoutes,
            filteredTech,
        };
    }, [filterQuery, items, disguises, isolations, uniqueKills, routes, tech]);

    const [fragmentHash, setFragmentHash] = useState("");
    useEffect(() => {
        setFragmentHash(window.location.hash);
    }, [searchParams]);

    return (
        <div className="flex w-full flex-col items-center gap-3 text-white md:gap-5">
            <MissionPageNav fragmentHash={fragmentHash} />
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
            <TechSection mission={mission as Mission} tech={filteredTech} />
        </div>
    );
}

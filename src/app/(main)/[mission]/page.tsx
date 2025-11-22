export const dynamic = "force-dynamic";

import { db } from "@/server/db";
import { unstable_cache } from "next/cache";
import {
    DisguiseSchema,
    IsolationSchema,
    ItemSchema,
    RouteSchema,
    TechSchema,
    TimingsFlashcardSchema,
    UniqueKillSchema,
} from "@/server/db/schema";
import { eq } from "drizzle-orm";
import MainContent from "./MainContent";
import { Mission } from "@/types";

const REVALIDATE_TIME = 60 * 60 * 5; // 5 HOURS

export default async function Page({
    params,
}: {
    params: Promise<{ mission: string }>;
}) {
    const { mission } = await params;

    const GetCachedItems = unstable_cache(
        async () => {
            return db.query.ItemSchema.findMany({
                where: eq(ItemSchema.mission, mission),
            });
        },
        [mission + "items"],
        { revalidate: REVALIDATE_TIME, tags: [mission + "items"] },
    );
    const GetCachedTimingsFlashcard = unstable_cache(
        async () => {
            return db.query.TimingsFlashcardSchema.findFirst({
                where: eq(TimingsFlashcardSchema.mission, mission),
            });
        },
        [mission + "timingsFlashcard"],
        { revalidate: REVALIDATE_TIME, tags: [mission + "timingsFlashcard"] },
    );
    const GetCachedDisguises = unstable_cache(
        async () => {
            return db.query.DisguiseSchema.findMany({
                where: eq(DisguiseSchema.mission, mission),
                with: {
                    disguiseVideoSchema: true,
                },
            });
        },
        [mission + "disguises"],
        { revalidate: REVALIDATE_TIME, tags: [mission + "disguises"] },
    );
    const GetCachedIsolations = unstable_cache(
        async () => {
            return db.query.IsolationSchema.findMany({
                where: eq(IsolationSchema.mission, mission),
            });
        },
        [mission + "isolations"],
        { revalidate: REVALIDATE_TIME, tags: [mission + "isolations"] },
    );
    const GetCachedUniqueKills = unstable_cache(
        async () => {
            return db.query.UniqueKillSchema.findMany({
                where: eq(UniqueKillSchema.mission, mission),
            });
        },
        [mission + "uniqueKills"],
        { revalidate: REVALIDATE_TIME, tags: [mission + "uniqueKills"] },
    );
    const GetCachedRoutes = unstable_cache(
        async () => {
            return db.query.RouteSchema.findMany({
                where: eq(RouteSchema.mission, mission),
            });
        },
        [mission + "routes"],
        { revalidate: REVALIDATE_TIME, tags: [mission + "routes"] },
    );
    const GetCachedTech = unstable_cache(
        async () => {
            return db.query.TechSchema.findMany({
                where: eq(TechSchema.mission, mission),
            });
        },
        [mission + "tech"],
        { revalidate: REVALIDATE_TIME, tags: [mission + "tech"] },
    );

    return (
        <MainContent
            mission={mission as Mission}
            timingsFlashcardPromise={GetCachedTimingsFlashcard()}
            itemsPromise={GetCachedItems()}
            disguisesPromise={GetCachedDisguises()}
            isolationsPromise={GetCachedIsolations()}
            uniqueKillsPromise={GetCachedUniqueKills()}
            routesPromise={GetCachedRoutes()}
            techPromise={GetCachedTech()}
        />
    );
}

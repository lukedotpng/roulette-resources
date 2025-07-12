import { db } from "@/server/db";
import {
    DisguiseSchema,
    IsolationSchema,
    ItemSchema,
    RouteSchema,
    TimingsFlashcardSchema,
} from "@/server/db/schema";
import { eq } from "drizzle-orm";
import ItemSection from "./_InfoComponents/Items/ItemSection";
import { Mission } from "@/types";
import TimingsCardSection from "./_InfoComponents/TimingsCard/TimingsSection";
import DisguisesSection from "./_InfoComponents/Disguises/DisguisesSection";
import IsolationsSection from "./_InfoComponents/Isolations/IsolationsSection";
import UniqueKillsSection from "./_InfoComponents/UniqueKills/UniqueKillsSection";
import RoutesSection from "./_InfoComponents/Routes/RoutesSections";

export default async function Page({
    params,
}: {
    params: Promise<{ mission: string }>;
}) {
    const { mission } = await params;

    const itemsPromise = db.query.ItemSchema.findMany({
        where: eq(ItemSchema.mission, mission),
    });
    const timingsFlashcardsPromise = db.query.TimingsFlashcardSchema.findFirst({
        where: eq(TimingsFlashcardSchema.mission, mission),
    });
    const disguisesPromise = db.query.DisguiseSchema.findMany({
        where: eq(DisguiseSchema.mission, mission),
        with: {
            disguiseVideoSchema: true,
        },
    });
    const isolationsPromise = db.query.IsolationSchema.findMany({
        where: eq(IsolationSchema.mission, mission),
    });
    const uniqueKillsPromise = db.query.UniqueKillSchema.findMany({
        where: eq(IsolationSchema.mission, mission),
    });

    const routesPromise = db.query.RouteSchema.findMany({
        where: eq(RouteSchema.mission, mission),
    });

    return (
        <>
            <TimingsCardSection
                mission={mission as Mission}
                timingsFlashcardPromise={timingsFlashcardsPromise}
            />
            <ItemSection
                mission={mission as Mission}
                itemsPromise={itemsPromise}
            />
            <DisguisesSection
                mission={mission as Mission}
                disguisesPromise={disguisesPromise}
            />
            <IsolationsSection
                mission={mission as Mission}
                isolationsPromise={isolationsPromise}
            />
            <UniqueKillsSection
                mission={mission as Mission}
                uniqueKillsPromise={uniqueKillsPromise}
            />
            <RoutesSection
                mission={mission as Mission}
                routesPromise={routesPromise}
            />
        </>
    );
}

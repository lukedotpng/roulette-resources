import { db } from "@/server/db";
import {
    DisguiseSchema,
    IsolationSchema,
    ItemSchema,
    RouteSchema,
    TimingsFlashcardSchema,
} from "@/server/db/schema";
import { eq } from "drizzle-orm";
import Sections from "./sections";
import { Mission } from "@/types";

export default async function Page({
    params,
}: {
    params: Promise<{ mission: string }>;
}) {
    const { mission } = await params;

    const itemsPromise = db.query.ItemSchema.findMany({
        where: eq(ItemSchema.mission, mission),
    });
    const timingsFlashcardPromise = db.query.TimingsFlashcardSchema.findFirst({
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
        <Sections
            mission={mission as Mission}
            timingsFlashcardPromise={timingsFlashcardPromise}
            itemsPromise={itemsPromise}
            disguisesPromise={disguisesPromise}
            isolationsPromise={isolationsPromise}
            uniqueKillsPromise={uniqueKillsPromise}
            routesPromise={routesPromise}
        />
    );
}

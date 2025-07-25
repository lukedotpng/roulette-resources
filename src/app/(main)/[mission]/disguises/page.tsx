export const maxDuration = 30;

import Disguises from "./_components/Disguises";
import { db } from "@/server/db";
import { DisguiseSchema } from "@/server/db/schema";
import { Mission } from "@/types";
import { eq } from "drizzle-orm";

export default async function Page({
    params,
}: {
    params: Promise<{ mission: string }>;
}) {
    const { mission } = await params;

    const disguises = await db.query.DisguiseSchema.findMany({
        where: eq(DisguiseSchema.mission, mission),
        with: {
            disguiseVideoSchema: true,
        },
    });

    if (disguises === null || disguises.length === 0) {
        return <h1>No data for this map :(</h1>;
    }

    return <Disguises mission={mission as Mission} disguises={disguises} />;
}

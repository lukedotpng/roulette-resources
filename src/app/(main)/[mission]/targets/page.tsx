import { db } from "@/server/db";
import { isolationSchema, uniqueKillSchema } from "@/server/db/schema";
import { Mission } from "@/types";
import { eq } from "drizzle-orm";
import Targets from "./_components/Targets";
import { SessionProvider } from "next-auth/react";

export default async function Page({
    params,
}: {
    params: Promise<{ mission: string }>;
}) {
    const mission = (await params).mission as Mission;

    const uniqueKills = await db
        .select()
        .from(uniqueKillSchema)
        .where(eq(uniqueKillSchema.mission, mission));

    const isolations = await db
        .select()
        .from(isolationSchema)
        .where(eq(isolationSchema.mission, mission));

    const isolationsDontExist = isolations === null || isolations.length === 0;
    const uniqueKillsDontExist =
        uniqueKills === null || uniqueKills.length === 0;

    if (isolationsDontExist && uniqueKillsDontExist) {
        return <h1>No data for this map :(</h1>;
    }

    return (
        <SessionProvider>
            <Targets
                mission={mission}
                isolations={isolationsDontExist ? [] : isolations}
                uniqueKills={uniqueKillsDontExist ? [] : uniqueKills}
            />
        </SessionProvider>
    );
}

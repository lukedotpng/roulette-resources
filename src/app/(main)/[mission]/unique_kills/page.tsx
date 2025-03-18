import { db } from "@/server/db";
import { uniqueKillSchema } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import UniqueKills from "./_components/UniqueKills";
import { BerlinUniqueKillTypes, MissionTargetsList } from "@/utils/globals";
import { Mission } from "@/types";
import BerlinUniqueKills from "./_components/BerlinUniqueKills";
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
        .where(eq(uniqueKillSchema.map, mission));

    if (uniqueKills === null || uniqueKills.length === 0) {
        return <h1>No data for this map :(</h1>;
    }

    // Berlin is treated differently
    if (mission === "berlin") {
        return (
            <BerlinUniqueKills
                uniqueKillTypes={BerlinUniqueKillTypes}
                uniqueKills={uniqueKills}
            />
        );
    } else {
        return (
            <SessionProvider>
                <UniqueKills
                    targets={MissionTargetsList[mission]}
                    mission={mission}
                    uniqueKills={uniqueKills}
                />
            </SessionProvider>
        );
    }
}

// import { UniqueKill } from "@/types";

import { db } from "@/server/db";
import { uniqueKillSchema } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import UniqueKills from "./_components/UniqueKills";
import { MissionTargetsList } from "@/globals";
import { Mission } from "@/types";

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

    return (
        <UniqueKills
            targets={MissionTargetsList[mission]}
            uniqueKills={uniqueKills}
        />
    );
}

// import { UniqueKill } from "@/types";

import { db } from "@/server/db";
import { uniqueKillsSchema } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import UniqueKills from "./_components/UniqueKills";
import { MissionTargets } from "@/globals";
import { Mission } from "@/types";

export default async function Page({
    params,
}: {
    params: Promise<{ mission: string }>;
}) {
    const mission = (await params).mission as Mission;

    const uniqueKillsRow = await db
        .select()
        .from(uniqueKillsSchema)
        .where(eq(uniqueKillsSchema.map, mission));

    if (uniqueKillsRow === null || uniqueKillsRow.length === 0) {
        return <h1>No data for this map :(</h1>;
    }

    const uniqueKillsData = uniqueKillsRow[0].data;

    if (uniqueKillsData === null) {
        return <h1>No data for this map :(</h1>;
    } else {
        return (
            <UniqueKills
                targets={MissionTargets[mission]}
                uniqueKillsGroup={uniqueKillsData}
            />
        );
    }
}

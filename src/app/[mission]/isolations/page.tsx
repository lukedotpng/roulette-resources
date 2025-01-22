import { Mission } from "@/types";
import Isolations from "./_components/Isolations";
import { MissionTargets } from "@/globals";
import { db } from "@/server/db";
import { isolationsSchema } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export default async function Page({
    params,
}: {
    params: Promise<{ mission: string }>;
}) {
    const mission: Mission = (await params).mission as Mission;

    const isolationInfoRow = await db
        .select()
        .from(isolationsSchema)
        .where(eq(isolationsSchema.map, mission));

    if (isolationInfoRow === null || isolationInfoRow.length === 0) {
        return <h1>No data for this map :(</h1>;
    }

    const isolationsData = isolationInfoRow[0].data;

    if (isolationsData === null) {
        return <h1>No data for this map :(</h1>;
    } else {
        return (
            <Isolations
                targets={
                    mission !== "hokkaido"
                        ? MissionTargets[mission]
                        : ["yuki_yamazaki"]
                }
                isolationsGroup={isolationsData}
            />
        );
    }
}

import Disguises from "./_components/Disguises";
import { db } from "@/server/db";
import { disguisesSchema } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export default async function Page({
    params,
}: {
    params: Promise<{ mission: string }>;
}) {
    const { mission } = await params;

    const disguiseInfoRow = await db
        .select()
        .from(disguisesSchema)
        .where(eq(disguisesSchema.map, mission));

    if (disguiseInfoRow === null || disguiseInfoRow.length === 0) {
        return <h1>No data for this map :(</h1>;
    }

    const disguiseData = disguiseInfoRow[0].data;

    if (disguiseData === null) {
        return <h1>No data yet :(</h1>;
    } else {
        return <Disguises disguises={disguiseData} />;
    }
}

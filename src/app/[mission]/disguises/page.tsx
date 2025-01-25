import Disguises from "./_components/Disguises";
import { db } from "@/server/db";
import { disguiseSchema } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export default async function Page({
    params,
}: {
    params: Promise<{ mission: string }>;
}) {
    const { mission } = await params;

    const disguises = await db
        .select()
        .from(disguiseSchema)
        .where(eq(disguiseSchema.map, mission));

    if (disguises === null || disguises.length === 0) {
        return <h1>No data for this map :(</h1>;
    }

    return <Disguises disguises={disguises} />;
}

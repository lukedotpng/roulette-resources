import Disguises from "./_components/Disguises";
import { db } from "@/server/db";
import { disguiseSchema } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { SessionProvider } from "next-auth/react";

export default async function Page({
    params,
}: {
    params: Promise<{ mission: string }>;
}) {
    const { mission } = await params;

    const disguises = await db.query.disguiseSchema.findMany({
        where: eq(disguiseSchema.map, mission),
        with: {
            disguiseVideoSchema: true,
        },
    });

    if (disguises === null || disguises.length === 0) {
        return <h1>No data for this map :(</h1>;
    }

    return (
        <SessionProvider>
            <Disguises disguises={disguises} />
        </SessionProvider>
    );
}

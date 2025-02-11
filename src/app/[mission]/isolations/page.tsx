import { Mission } from "@/types";
import Isolations from "./_components/Isolations";
import { MissionTargetsList } from "@/globals";
import { db } from "@/server/db";
import { isolationSchema } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { SessionProvider } from "next-auth/react";

export default async function Page({
    params,
}: {
    params: Promise<{ mission: string }>;
}) {
    const mission: Mission = (await params).mission as Mission;

    const isolations = await db
        .select()
        .from(isolationSchema)
        .where(eq(isolationSchema.map, mission));

    if (isolations === null || isolations.length === 0) {
        return <h1>No data for this map :(</h1>;
    }

    return (
        <SessionProvider>
            <Isolations
                targets={
                    mission !== "hokkaido"
                        ? MissionTargetsList[mission]
                        : ["yuki_yamazaki"]
                }
                mission={mission}
                isolations={isolations}
            />
        </SessionProvider>
    );
}

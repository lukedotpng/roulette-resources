import { Mission } from "@/types";
import { db } from "@/server/db";
import { routeSchema } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { SessionProvider } from "next-auth/react";
import Routes from "./_components/Routes";

export default async function Page({
    params,
}: {
    params: Promise<{ mission: string }>;
}) {
    const mission: Mission = (await params).mission as Mission;

    const routes = await db
        .select()
        .from(routeSchema)
        .where(eq(routeSchema.map, mission));

    return (
        <SessionProvider>
            <Routes mission={mission} routes={routes} />
        </SessionProvider>
    );
}

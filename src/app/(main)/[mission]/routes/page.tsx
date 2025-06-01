import { Mission } from "@/types";
import { db } from "@/server/db";
import { RouteSchema } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import Routes from "./_components/Routes";

export default async function Page({
    params,
}: {
    params: Promise<{ mission: string }>;
}) {
    const mission: Mission = (await params).mission as Mission;

    const routes = await db
        .select()
        .from(RouteSchema)
        .where(eq(RouteSchema.map, mission));

    return <Routes mission={mission} routes={routes} />;
}

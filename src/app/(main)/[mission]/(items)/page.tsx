import { db } from "@/server/db";
import { ItemSchema } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import Items from "./_components/Items";
import { Mission } from "@/types";

export default async function Page({
    params,
}: {
    params: Promise<{ mission: string }>;
}) {
    const { mission } = await params;

    let items = await db.query.ItemSchema.findMany({
        where: eq(ItemSchema.mission, mission),
    });

    if (items === null || items.length === 0) {
        return <h1>No data for this map :(</h1>;
    }

    items = items.sort((a, b) => (a.name >= b.name ? 1 : -1));

    return <Items items={items} mission={mission as Mission} />;
}

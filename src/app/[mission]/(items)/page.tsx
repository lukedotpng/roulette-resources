import { db } from "@/server/db";
import { itemSchema } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import Items from "./_components/Items";
import { SessionProvider } from "next-auth/react";
import { Mission } from "@/types";

export default async function Page({
    params,
}: {
    params: Promise<{ mission: string }>;
}) {
    const { mission } = await params;

    let items = await db.query.itemSchema.findMany({
        where: eq(itemSchema.map, mission),
    });

    if (items === null || items.length === 0) {
        return <h1>No data for this map :(</h1>;
    }

    items = items.sort((a, b) => (a.name >= b.name ? 1 : -1));

    return (
        <SessionProvider>
            <Items items={items} mission={mission as Mission} />
        </SessionProvider>
    );
}

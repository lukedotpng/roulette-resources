import { db } from "@/server/db";
import { itemsSchema } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import Items from "./_components/Items";

export default async function Page({
    params,
}: {
    params: Promise<{ mission: string }>;
}) {
    const { mission } = await params;

    const itemInfoRow = await db
        .select()
        .from(itemsSchema)
        .where(eq(itemsSchema.map, mission));

    if (itemInfoRow === null || itemInfoRow.length === 0) {
        return <h1>No data for this map :(</h1>;
    }

    const itemsData = itemInfoRow[0].data;

    if (itemsData === null) {
        return <h1>No data for this map :(</h1>;
    } else {
        return <Items items={itemsData} />;
    }
}

import { db } from "@/server/db";
import { ItemSchema, TimingsFlashcard } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import General from "./_components/General";
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
    const timingsFlashcards = await db.query.TimingsFlashcard.findMany({
        where: eq(TimingsFlashcard.mission, mission),
    });

    if (
        (items === null || items.length === 0) &&
        (timingsFlashcards === null || timingsFlashcards.length === 0)
    ) {
        return <h1>No data for this map :(</h1>;
    }

    items = items.sort((a, b) => (a.name >= b.name ? 1 : -1));

    return (
        <General
            items={items}
            mission={mission as Mission}
            timingsFlashcard={
                timingsFlashcards.length > 0 ? timingsFlashcards[0] : undefined
            }
        />
    );
}

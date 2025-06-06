import { db } from "@/server/db";
import { FlashcardSchema, ItemSchema } from "@/server/db/schema";
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
    const flashcards = await db.query.FlashcardSchema.findMany({
        where: eq(FlashcardSchema.mission, mission),
    });

    if (
        (items === null || items.length === 0) &&
        (flashcards === null || flashcards.length === 0)
    ) {
        return <h1>No data for this map :(</h1>;
    }

    items = items.sort((a, b) => (a.name >= b.name ? 1 : -1));

    return (
        <General
            items={items}
            mission={mission as Mission}
            flashcards={flashcards}
        />
    );
}

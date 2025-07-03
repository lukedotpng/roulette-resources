export const maxDuration = 30;

import { db } from "@/server/db";
import {
    DisguiseSchema,
    ItemSchema,
    TimingsFlashcardSchema,
} from "@/server/db/schema";
import { eq } from "drizzle-orm";
import ItemSection from "./_InfoComponents/Items/ItemSection";
import { ItemSelect, Mission } from "@/types";
import TimingsCardSection from "./_InfoComponents/TimingsCard/TimingsSection";
import DisguisesSection from "./_InfoComponents/Disguises/DisguisesSection";

export default async function Page({
    params,
}: {
    params: Promise<{ mission: string }>;
}) {
    const { mission } = await params;

    const itemsPromise = db.query.ItemSchema.findMany({
        where: eq(ItemSchema.mission, mission),
    });
    const timingsFlashcardsPromise = db.query.TimingsFlashcardSchema.findFirst({
        where: eq(TimingsFlashcardSchema.mission, mission),
    });
    const disguisesPromise = db.query.DisguiseSchema.findMany({
        where: eq(DisguiseSchema.mission, mission),
        with: {
            disguiseVideoSchema: true,
        },
    });

    return (
        <>
            <TimingsCardSection
                mission={mission as Mission}
                timingsFlashcardPromise={timingsFlashcardsPromise}
            />
            <ItemSection
                mission={mission as Mission}
                itemsPromise={itemsPromise}
            />
            <DisguisesSection
                mission={mission as Mission}
                disguisesPromise={disguisesPromise}
            ></DisguisesSection>
        </>
    );
}

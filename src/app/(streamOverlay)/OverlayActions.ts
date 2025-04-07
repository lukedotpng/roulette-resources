"use server";

import { db } from "@/server/db";
import { overlaySchema } from "@/server/db/schema";
import { and, eq, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import z from "zod";

export async function InitializeSpinOverlay(
    id: string,
    key: number,
    spin: string,
) {
    console.log("Creating Spin Overlay at", id);

    const initSpinOverlayScheme = z.object({
        id: z.string().uuid(),
    });
    const idParsed = initSpinOverlayScheme.safeParse({ id: id });

    if (idParsed.error) {
        return { error: "Overlay ID is not valid", status: 400 };
    }

    await db
        .insert(overlaySchema)
        .values({ id: id, key: key, spin_query: spin })
        .catch((e) => console.error("SPIN OVERLAY CREATION:", e));

    revalidatePath("/overlay/" + id);
}

export async function UpdateSpinOverlay(
    id: string,
    key: number,
    query: string,
    theme: string,
) {
    console.log("Updating Spin at", id);

    await db
        .update(overlaySchema)
        .set({ id: id, spin_query: query, theme: theme })
        .where(
            and(
                eq(overlaySchema.id, id),
                or(eq(overlaySchema.key, key), eq(overlaySchema.key, -1)),
            ),
        )
        .catch((e) => console.error("SPIN OVERLAY UPDATE:", e));

    revalidatePath("/overlay/" + id);
}

export async function UpdateSpinOverlayMatchStatus(
    id: string,
    key: number,
    query: string,
    match_active: boolean,
    spin_start_time?: number,
) {
    console.log("Updating Spin at", id);

    if (spin_start_time === undefined) {
        await db
            .update(overlaySchema)
            .set({
                id: id,
                spin_query: query,
                match_active: match_active,
            })
            .where(
                and(
                    eq(overlaySchema.id, id),
                    or(eq(overlaySchema.key, key), eq(overlaySchema.key, -1)),
                ),
            )
            .catch((e) => console.error("SPIN OVERLAY UPDATE:", e));
    } else {
        await db
            .update(overlaySchema)
            .set({
                id: id,
                spin_query: query,
                match_active: match_active,
                spin_start_time: spin_start_time,
            })
            .where(
                and(
                    eq(overlaySchema.id, id),
                    or(eq(overlaySchema.key, key), eq(overlaySchema.key, -1)),
                ),
            )
            .catch((e) => console.error("SPIN OVERLAY UPDATE:", e));
    }

    revalidatePath("/overlay/" + id);
}

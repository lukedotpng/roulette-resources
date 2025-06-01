"use server";

import { db } from "@/server/db";
import { OverlaySchema } from "@/server/db/schema";
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
        .insert(OverlaySchema)
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
        .update(OverlaySchema)
        .set({ id: id, spin_query: query, theme: theme })
        .where(
            and(
                eq(OverlaySchema.id, id),
                or(eq(OverlaySchema.key, key), eq(OverlaySchema.key, -1)),
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
            .update(OverlaySchema)
            .set({
                id: id,
                spin_query: query,
                match_active: match_active,
            })
            .where(
                and(
                    eq(OverlaySchema.id, id),
                    or(eq(OverlaySchema.key, key), eq(OverlaySchema.key, -1)),
                ),
            )
            .catch((e) => console.error("SPIN OVERLAY UPDATE:", e));
    } else {
        await db
            .update(OverlaySchema)
            .set({
                id: id,
                spin_query: query,
                match_active: match_active,
                spin_start_time: spin_start_time,
            })
            .where(
                and(
                    eq(OverlaySchema.id, id),
                    or(eq(OverlaySchema.key, key), eq(OverlaySchema.key, -1)),
                ),
            )
            .catch((e) => console.error("SPIN OVERLAY UPDATE:", e));
    }

    revalidatePath("/overlay/" + id);
}

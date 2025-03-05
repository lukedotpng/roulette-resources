"use server";

import { db } from "@/server/db";
import { overlaySchema } from "@/server/db/schema";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import z from "zod";

export async function InitializeSpinOverlay(id: string, spin: string) {
    console.log("Creating Spin Overlay at", id);

    const initSpinOverlayScheme = z.object({
        id: z.string().uuid(),
    });
    const idParsed = initSpinOverlayScheme.safeParse({ id: id });

    if (idParsed.error) {
        NextResponse.json(
            { error: "Overlay ID is not valid" },
            { status: 400 },
        );
    }

    db.insert(overlaySchema)
        .values({ id: id, spin_query: spin })
        .catch((e) => console.error("SPIN OVERLAY CREATION:", e));

    revalidatePath("/overlay/" + id);
}

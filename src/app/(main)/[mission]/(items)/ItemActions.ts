"use server";

import { auth } from "@/auth";
import { db } from "@/server/db";
import { ItemSchema, UpdateLogSchema } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import z from "zod";

const updateItemScheme = z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    quick_look: z.string().min(0),
    hitmaps_link: z.string(),
});

export async function UpdateItemAction(formData: FormData) {
    const session = await auth();

    if (!session || !session.user || !session.user.admin) {
        return "unauthorized";
    }

    const formParsed = updateItemScheme.safeParse({
        id: formData.get("id"),
        name: formData.get("name"),
        quick_look: formData.get("quick_look"),
        hitmaps_link: formData.get("hitmaps_link"),
    });

    if (!formParsed.success) {
        return;
    }

    let updatedSuccessful = true;

    try {
        await db
            .update(ItemSchema)
            .set({ updated_at: new Date(), ...formParsed.data })
            .where(eq(ItemSchema.id, formParsed.data.id));
    } catch {
        console.error(
            `ERROR UPDATING ITEM ${formParsed.data.id}: Wouldve been a good update :/`,
        );
        updatedSuccessful = false;
    }

    if (updatedSuccessful) {
        try {
            await db.insert(UpdateLogSchema).values({
                username: session.user.username,
                table: "items",
                row_id: formParsed.data.id,
                content: JSON.stringify(formParsed.data),
                is_admin: true,
            });
        } catch {
            console.error("ERROR UPDATING LOG: This feels ironic");
        }
    }

    revalidatePath("/[mission]/", "page");
}

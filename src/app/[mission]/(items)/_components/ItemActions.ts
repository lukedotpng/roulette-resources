"use server";

import { auth } from "@/auth";
import { db } from "@/server/db";
import { itemSchema } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import z from "zod";

// const newItemScheme = z.object({
//     id: z.string(),
//     map: z.string().min(1),
//     name: z.string().min(1),
//     type: z.string().min(1),
//     quick_look: z.string().min(0),
//     hitmaps_link: z.string(),
// });

const updateItemScheme = z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    quick_look: z.string().min(0),
    hitmaps_link: z.string(),
});

export async function UpdateItemAction(formData: FormData) {
    const session = await auth();

    if (!session || !session.user || session.user.username !== "lukedotpng") {
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

    await db
        .update(itemSchema)
        .set(formParsed.data)
        .where(eq(itemSchema.id, formParsed.data.id));

    revalidatePath("/[mission]/", "page");
}

"use server";

import { auth } from "@/auth";
import { db } from "@/server/db";
import { disguiseVideoSchema } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import z from "zod";

const newDisguiseVideoScheme = z.object({
    id: z.string(),
    link: z.string().url(),
});

export async function NewDisguiseVideoAction(formData: FormData) {
    const session = await auth();

    if (!session || !session.user || !session.user.admin) {
        return "unauthorized";
    }

    const formParsed = newDisguiseVideoScheme.safeParse({
        id: formData.get("id"),
        link: formData.get("link"),
    });

    if (!formParsed.success) {
        return;
    }

    await db.insert(disguiseVideoSchema).values({
        disguise_id: formParsed.data.id,
        link: formParsed.data.link,
        visible: true,
    });

    revalidatePath("/[mission]/disguises", "page");
}

export async function DeleteDisguiseVideoAction(disguiseVideoId: string) {
    const session = await auth();

    if (!session || !session.user || !session.user.admin) {
        return "unauthorized";
    }

    await db
        .update(disguiseVideoSchema)
        .set({ visible: false })
        .where(eq(disguiseVideoSchema.id, disguiseVideoId));

    revalidatePath("/[mission]/disguises", "page");
}

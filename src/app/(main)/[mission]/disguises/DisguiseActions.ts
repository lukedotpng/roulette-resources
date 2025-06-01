"use server";

import { auth } from "@/auth";
import { db } from "@/server/db";
import { DisguiseVideoSchema, UpdateLogSchema } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import z from "zod";

const zodUpdateDisguiseVideoScheme = z.object({
    video_id: z.string(),
    disguise_id: z.string(),
    link: z.string().url(),
    notes: z.string(),
});

const zodNewDisguiseVideoScheme = z.object({
    disguise_id: z.string(),
    link: z.string().url(),
    notes: z.string(),
});

export async function UpdateDisguiseVideoAction(formData: FormData) {
    const session = await auth();

    if (!session || !session.user || !session.user.admin) {
        return "unauthorized";
    }

    const formParsed = zodUpdateDisguiseVideoScheme.safeParse({
        video_id: formData.get("video_id"),
        disguise_id: formData.get("disguise_id"),
        link: formData.get("link"),
        notes: formData.get("notes"),
    });

    if (!formParsed.success) {
        return;
    }

    let updatedSuccessful = true;

    try {
        await db
            .update(DisguiseVideoSchema)
            .set({
                link: formParsed.data.link,
                notes: formParsed.data.notes,
            })
            .where(eq(DisguiseVideoSchema.id, formParsed.data.video_id));
    } catch {
        console.error(
            `ERROR UPDATING DISGUISE VIDEO ${formParsed.data.video_id}: Wouldve been a good update :/`,
        );
        updatedSuccessful = false;
    }

    if (updatedSuccessful) {
        try {
            await db.insert(UpdateLogSchema).values({
                username: session.user.username,
                table: "disguises",
                row_id: formParsed.data.video_id,
                content: JSON.stringify(formParsed.data),
                is_admin: true,
            });
        } catch {
            console.error("ERROR UPDATING LOG: This feels ironic");
        }
    }

    revalidatePath("/[mission]/disguises", "page");
}

export async function NewDisguiseVideoAction(formData: FormData) {
    const session = await auth();

    if (!session || !session.user || !session.user.admin) {
        return "unauthorized";
    }

    const formParsed = zodNewDisguiseVideoScheme.safeParse({
        disguise_id: formData.get("disguise_id"),
        link: formData.get("link"),
        notes: formData.get("notes"),
    });

    if (!formParsed.success) {
        return;
    }

    let updatedSuccessful = true;

    try {
        await db.insert(DisguiseVideoSchema).values({
            disguise_id: formParsed.data.disguise_id,
            link: formParsed.data.link,
            notes: formParsed.data.notes,
            visible: true,
        });
    } catch {
        console.error(
            `ERROR CREATING DISGUISE VIDEO FOR ${formParsed.data.disguise_id}: already miss it :/`,
        );
        updatedSuccessful = false;
    }

    if (updatedSuccessful) {
        try {
            await db.insert(UpdateLogSchema).values({
                username: session.user.username,
                table: "disguises",
                row_id: "",
                content: JSON.stringify(formParsed.data),
                is_admin: true,
            });
        } catch {
            console.error("ERROR UPDATING LOG: This feels ironic");
        }
    }

    revalidatePath("/[mission]/disguises", "page");
}

export async function DeleteDisguiseVideoAction(disguiseVideoId: string) {
    const session = await auth();

    if (!session || !session.user || !session.user.admin) {
        return "unauthorized";
    }

    await db
        .update(DisguiseVideoSchema)
        .set({ visible: false })
        .where(eq(DisguiseVideoSchema.id, disguiseVideoId));

    revalidatePath("/[mission]/disguises", "page");
}

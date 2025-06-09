"use server";

import { auth } from "@/auth";
import { db } from "@/server/db";
import { TimingsFlashcardSchema, UpdateLogSchema } from "@/server/db/schema";
import { ActionResponse } from "@/types";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import z from "zod";

const createFlashcardSchema = z.object({
    mission: z.string().min(1),
    info: z.string().min(0),
});

const updateFlashcardSchema = z.object({
    id: z.string().min(1),
    mission: z.string().min(1),
    info: z.string().min(0),
});

export async function CreateTimingsFlashcardAction(
    formData: FormData,
): Promise<ActionResponse> {
    const session = await auth();

    if (!session || !session.user || !session.user.admin) {
        return { success: false, error: "User Unauthorized" };
    }

    const formParsed = createFlashcardSchema.safeParse({
        mission: formData.get("mission"),
        info: formData.get("info"),
    });

    if (!formParsed.success) {
        return { success: false, error: "Failed to parse the data" };
    }

    let updatedSuccessful = true;

    try {
        await db.insert(TimingsFlashcardSchema).values({
            mission: formParsed.data.mission,
            info: formParsed.data.info,
        });
    } catch {
        console.error(
            `ERROR CREATING FLASHCARD ${formParsed.data.mission}: Wouldve been helpful :/`,
        );
        updatedSuccessful = false;
    }

    if (updatedSuccessful) {
        try {
            await db.insert(UpdateLogSchema).values({
                username: session.user.username,
                table: "flashcards",
                row_id: formParsed.data.mission,
                content: JSON.stringify(formParsed.data),
                is_admin: true,
            });
        } catch {
            console.error("ERROR UPDATING LOG: This feels ironic");
        }
    }

    revalidatePath("/[mission]/", "page");

    return { success: true, error: "" };
}

export async function UpdateTimingsFlashcardAction(
    formData: FormData,
): Promise<ActionResponse> {
    const session = await auth();

    if (!session || !session.user || !session.user.admin) {
        return { success: false, error: "User Unauthorized" };
    }

    const formParsed = updateFlashcardSchema.safeParse({
        id: formData.get("id"),
        mission: formData.get("mission"),
        info: formData.get("info"),
    });

    if (!formParsed.success) {
        return { success: false, error: formParsed.error.message };
    }

    let updatedSuccessful = true;

    try {
        await db
            .update(TimingsFlashcardSchema)
            .set({ info: formParsed.data.info, updated_at: new Date() })
            .where(eq(TimingsFlashcardSchema.id, formParsed.data.id));
    } catch {
        console.error(
            `ERROR UPDATING FLASHCARD ${formParsed.data.id}: Wouldve been helpful :/`,
        );
        updatedSuccessful = false;
    }

    if (updatedSuccessful) {
        try {
            await db.insert(UpdateLogSchema).values({
                username: session.user.username,
                table: "flashcards",
                row_id: formParsed.data.id,
                content: JSON.stringify(formParsed.data),
                is_admin: true,
            });
        } catch {
            console.error("ERROR UPDATING LOG: This feels ironic");
        }
    }

    revalidatePath("/[mission]/", "page");

    return { success: true, error: "" };
}

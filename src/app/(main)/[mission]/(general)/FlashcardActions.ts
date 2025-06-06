"use server";

import { auth } from "@/auth";
import { db } from "@/server/db";
import { FlashcardSchema, UpdateLogSchema } from "@/server/db/schema";
import { ActionResponse } from "@/types";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import z from "zod";

const createFlashcardSchema = z.object({
    mission: z.string().min(1),
    target: z.string().min(1),
    info: z.string().min(0),
});

const updateFlashcardSchema = z.object({
    id: z.string().min(1),
    mission: z.string().min(1),
    target: z.string().min(1),
    info: z.string().min(0),
    visible: z.coerce.boolean(),
});

export async function CreateFlashcardAction(
    formData: FormData,
): Promise<ActionResponse> {
    const session = await auth();

    if (!session || !session.user || !session.user.admin) {
        return { success: false, error: "User Unauthorized" };
    }

    const formParsed = createFlashcardSchema.safeParse({
        mission: formData.get("mission"),
        target: formData.get("target"),
        info: formData.get("info"),
    });

    if (!formParsed.success) {
        return { success: false, error: "Failed to parse the data" };
    }

    let updatedSuccessful = true;

    const filteredFlashcardInfo = formParsed.data.info.replace(/\r/g, "");

    try {
        await db.insert(FlashcardSchema).values({
            mission: formParsed.data.mission,
            target: formParsed.data.target,
            info: filteredFlashcardInfo,
            visible: true,
        });
    } catch {
        console.error(
            `ERROR CREATING FLASHCARD ${formParsed.data.target}: Wouldve been helpful :/`,
        );
        updatedSuccessful = false;
    }

    if (updatedSuccessful) {
        try {
            await db.insert(UpdateLogSchema).values({
                username: session.user.username,
                table: "flashcards",
                row_id: formParsed.data.target,
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

export async function UpdateFlashcardAction(
    formData: FormData,
): Promise<ActionResponse> {
    const session = await auth();

    if (!session || !session.user || !session.user.admin) {
        return { success: false, error: "User Unauthorized" };
    }

    const formParsed = updateFlashcardSchema.safeParse({
        id: formData.get("id"),
        mission: formData.get("mission"),
        target: formData.get("target"),
        info: formData.get("info"),
    });

    if (!formParsed.success) {
        return { success: false, error: formParsed.error.message };
    }

    let updatedSuccessful = true;

    const filteredFlashcardInfo = formParsed.data.info.replace(/\r/g, "");

    try {
        await db
            .update(FlashcardSchema)
            .set({ info: filteredFlashcardInfo, updated_at: new Date() })
            .where(eq(FlashcardSchema.id, formParsed.data.id));
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
                row_id: formParsed.data.target,
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

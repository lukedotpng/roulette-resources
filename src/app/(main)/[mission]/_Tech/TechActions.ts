"use server";

import { auth } from "@/auth";
import { db } from "@/server/db";
import { TechSchema, UpdateLogSchema } from "@/server/db/schema";
import { ActionResponse } from "@/types";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";

import z from "zod";

const newTechScheme = z.object({
    mission: z.string().min(1),
    name: z.string().min(1),
    notes: z.string(),
    video_link: z.string().min(1),
});

const updateTechScheme = z.object({
    id: z.string().min(1),
    mission: z.string().min(1),
    name: z.string().min(1),
    notes: z.string(),
    video_link: z.string().min(1),
});

export async function CreateTechAction(
    formData: FormData,
): Promise<ActionResponse> {
    const session = await auth();

    if (!session || !session.user || !session.user.admin) {
        return { success: false, error: "User Unauthorized" };
    }

    const formParsed = newTechScheme.safeParse({
        mission: formData.get("mission"),
        name: formData.get("name"),
        notes: formData.get("notes"),
        video_link: formData.get("video_link"),
    });

    if (!formParsed.success) {
        console.log("Failed to parse form data:", formData);
        return { success: false, error: formParsed.error.message };
    }

    try {
        await db.insert(TechSchema).values({
            mission: formParsed.data.mission,
            name: formParsed.data.name,
            notes: formParsed.data.notes,
            video_link: formParsed.data.video_link,
            visible: true,
        });
    } catch {
        return {
            success: false,
            error: `Failed to updated data: ${formParsed.data.toString()}`,
        };
    }

    try {
        await db.insert(UpdateLogSchema).values({
            username: session.user.username,
            table: "tech",
            row_id: "",
            content: JSON.stringify(formParsed.data),
            is_admin: true,
        });
    } catch {
        console.error("ERROR UPDATING LOG: This feels ironic");
    }

    revalidateTag(formParsed.data.mission + "tech");
    return { success: true };
}

export async function UpdateTechAction(
    formData: FormData,
): Promise<ActionResponse> {
    const session = await auth();

    if (!session || !session.user || !session.user.admin) {
        return { success: false, error: "User Unauthorized" };
    }

    const formParsed = updateTechScheme.safeParse({
        id: formData.get("id"),
        mission: formData.get("mission"),
        name: formData.get("name"),
        notes: formData.get("notes"),
        video_link: formData.get("video_link"),
    });

    if (!formParsed.success) {
        console.log(formParsed.error);
        return { success: false, error: formParsed.error.message };
    }
    try {
        await db
            .update(TechSchema)
            .set({ updated_at: new Date(), ...formParsed.data })
            .where(eq(TechSchema.id, formParsed.data.id));
    } catch {
        return {
            success: false,
            error: `Failed to update data: ${formParsed.data.toString()}`,
        };
    }

    try {
        await db.insert(UpdateLogSchema).values({
            username: session.user.username,
            table: "tech",
            row_id: "",
            content: JSON.stringify(formParsed.data),
            is_admin: true,
        });
    } catch {
        console.error("ERROR UPDATING LOG: This feels ironic");
    }

    revalidateTag(formParsed.data.mission + "tech");
    return { success: true };
}

// TODO: ADD TRY/CATCH
export async function DeleteTechAction(
    mission: string,
    techId: string,
): Promise<ActionResponse> {
    const session = await auth();

    if (!session || !session.user || !session.user.admin) {
        return { success: false, error: "User Unauthorized" };
    }

    await db
        .update(TechSchema)
        .set({ visible: false, updated_at: new Date() })
        .where(eq(TechSchema.id, techId));

    revalidateTag(mission + "tech");
    return { success: true };
}

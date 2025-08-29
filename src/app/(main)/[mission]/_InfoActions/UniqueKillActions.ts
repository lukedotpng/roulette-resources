"use server";

import { auth } from "@/auth";
import { db } from "@/server/db";
import { UniqueKillSchema, UpdateLogSchema } from "@/server/db/schema";
import { ActionResponse } from "@/types";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import z from "zod";

const newUniqueKillScheme = z.object({
    target: z.string().min(1),
    mission: z.string(),
    kill_method: z.string().min(1),
    name: z.string(),
    info: z.string(),
    video_link: z.string(),
});

const updateUniqueKillScheme = z.object({
    id: z.string().min(1),
    target: z.string(),
    mission: z.string().min(1),
    kill_method: z.string().min(1),
    name: z.string(),
    info: z.string(),
    video_link: z.string(),
});

export async function CreateUniqueKillAction(
    formData: FormData,
): Promise<ActionResponse> {
    const session = await auth();

    if (!session || !session.user || !session.user.admin) {
        return { success: false, error: "User Unauthorized" };
    }

    const formParsed = newUniqueKillScheme.safeParse({
        target: formData.get("target"),
        mission: formData.get("mission"),
        kill_method: formData.get("kill_method"),
        name: formData.get("name"),
        info: formData.get("info"),
        video_link: formData.get("video_link"),
    });

    if (!formParsed.success) {
        return { success: false, error: formParsed.error.message };
    }

    try {
        await db.insert(UniqueKillSchema).values({
            target: formParsed.data.target,
            mission: formParsed.data.mission,
            kill_method: formParsed.data.kill_method,
            name: formParsed.data.name,
            info: formParsed.data.info,
            video_link: formParsed.data.video_link,
            visible: true,
        });
    } catch {
        return {
            success: false,
            error: `Failed to update data: ${formParsed.data.toString()}`,
        };
    }

    try {
        await db.insert(UpdateLogSchema).values({
            username: session.user.username,
            table: "uniqueKills",
            row_id: "",
            content: JSON.stringify(formParsed.data),
            is_admin: true,
        });
    } catch {
        console.error("ERROR UPDATING LOG: This feels ironic");
    }

    revalidatePath("/[mission]/targets", "page");
    return { success: true };
}

export async function UpdateUniqueKillAction(
    formData: FormData,
): Promise<ActionResponse> {
    const session = await auth();

    if (!session || !session.user || !session.user.admin) {
        return { success: false, error: "User Unauthorized" };
    }

    console.log("form:", formData);

    const formParsed = updateUniqueKillScheme.safeParse({
        id: formData.get("id"),
        target: formData.get("target"),
        mission: formData.get("mission"),
        kill_method: formData.get("kill_method"),
        name: formData.get("name"),
        info: formData.get("info"),
        video_link: formData.get("video_link"),
    });

    console.log("formParsed:", formParsed);

    if (!formParsed.success) {
        return { success: false, error: formParsed.error.message };
    }

    try {
        await db
            .update(UniqueKillSchema)
            .set({ updated_at: new Date(), ...formParsed.data })
            .where(eq(UniqueKillSchema.id, formParsed.data.id));
    } catch {
        return {
            success: false,
            error: `Failed to update data: ${formParsed.data.toString()}`,
        };
    }

    try {
        await db.insert(UpdateLogSchema).values({
            username: session.user.username,
            table: "uniqueKills",
            row_id: formParsed.data.id,
            content: JSON.stringify(formParsed.data),
            is_admin: true,
        });
    } catch {
        console.error("ERROR UPDATING LOG: This feels ironic");
    }

    revalidatePath("/[mission]/targets", "page");
    return { success: true };
}

export async function DeleteUniqueKillAction(
    uniqueKillId: string,
): Promise<ActionResponse> {
    const session = await auth();

    if (!session || !session.user || !session.user.admin) {
        return { success: false, error: "User Unauthorized" };
    }

    try {
        await db
            .update(UniqueKillSchema)
            .set({ updated_at: new Date(), visible: false })
            .where(eq(UniqueKillSchema.id, uniqueKillId));
    } catch {
        return {
            success: false,
            error: `Failed to update data: ${uniqueKillId}`,
        };
    }

    try {
        await db.insert(UpdateLogSchema).values({
            username: session.user.username,
            table: "uniqueKills",
            row_id: uniqueKillId,
            content: "DELETE",
            is_admin: true,
        });
    } catch {
        console.error("ERROR UPDATING LOG: This feels ironic");
    }

    revalidatePath("/[mission]/targets", "page");
    return { success: true };
}

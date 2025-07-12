"use server";

import { auth } from "@/auth";
import { db } from "@/server/db";
import { RouteSchema, UpdateLogSchema } from "@/server/db/schema";
import { ActionResponse } from "@/types";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import z from "zod";

const newRouteScheme = z.object({
    mission: z.string().min(1),
    name: z.string().min(1),
    notes: z.string(),
    video_link: z.string().min(1),
});

const updateRouteScheme = z.object({
    id: z.string().min(1),
    mission: z.string().min(1),
    name: z.string().min(1),
    notes: z.string(),
    video_link: z.string().min(1),
});

export async function CreateRouteAction(
    formData: FormData,
): Promise<ActionResponse> {
    const session = await auth();

    if (!session || !session.user || !session.user.admin) {
        return { success: false, error: "User Unauthorized" };
    }

    const formParsed = newRouteScheme.safeParse({
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
        await db.insert(RouteSchema).values({
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
            table: "routes",
            row_id: "",
            content: JSON.stringify(formParsed.data),
            is_admin: true,
        });
    } catch {
        console.error("ERROR UPDATING LOG: This feels ironic");
    }

    revalidatePath("/[mission]/routes", "page");
    return { success: true };
}

export async function UpdateRouteAction(
    formData: FormData,
): Promise<ActionResponse> {
    const session = await auth();

    if (!session || !session.user || !session.user.admin) {
        return { success: false, error: "User Unauthorized" };
    }

    const formParsed = updateRouteScheme.safeParse({
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
            .update(RouteSchema)
            .set({ updated_at: new Date(), ...formParsed.data })
            .where(eq(RouteSchema.id, formParsed.data.id));
    } catch {
        return {
            success: false,
            error: `Failed to update data: ${formParsed.data.toString()}`,
        };
    }

    try {
        await db.insert(UpdateLogSchema).values({
            username: session.user.username,
            table: "routes",
            row_id: "",
            content: JSON.stringify(formParsed.data),
            is_admin: true,
        });
    } catch {
        console.error("ERROR UPDATING LOG: This feels ironic");
    }

    revalidatePath("/[mission]/routes", "page");
    return { success: true };
}

export async function DeleteRouteAction(
    routeId: string,
): Promise<ActionResponse> {
    const session = await auth();

    if (!session || !session.user || !session.user.admin) {
        return { success: false, error: "User Unauthorized" };
    }

    await db
        .update(RouteSchema)
        .set({ visible: false, updated_at: new Date() })
        .where(eq(RouteSchema.id, routeId));

    revalidatePath("/[mission]/routes", "page");
    return { success: true };
}

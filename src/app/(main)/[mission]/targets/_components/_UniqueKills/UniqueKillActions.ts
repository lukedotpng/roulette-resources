"use server";

import { auth } from "@/auth";
import { db } from "@/server/db";
import { uniqueKillSchema } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import z from "zod";

const newUniqueKillScheme = z.object({
    target: z.string().min(1),
    map: z.string().min(1),
    kill_method: z.string().min(1),
    name: z.string(),
    requires: z.string(),
    starts: z.string(),
    timings: z.string(),
    notes: z.string(),
    video_link: z.string(),
});

const updateUniqueKillScheme = z.object({
    id: z.string().min(1),
    target: z.string().min(1),
    map: z.string().min(1),
    kill_method: z.string().min(1),
    name: z.string(),
    requires: z.string(),
    starts: z.string(),
    timings: z.string(),
    notes: z.string(),
    video_link: z.string(),
});

export async function CreateUniqueKillAction(formData: FormData) {
    const session = await auth();

    if (!session || !session.user || !session.user.admin) {
        return "unauthorized";
    }

    const formParsed = newUniqueKillScheme.safeParse({
        target: formData.get("target"),
        map: formData.get("map"),
        kill_method: formData.get("kill_method"),
        name: formData.get("name"),
        requires: formData.get("requires"),
        starts: formData.get("starts"),
        timings: formData.get("timings"),
        notes: formData.get("notes"),
        video_link: formData.get("video_link"),
    });

    if (!formParsed.success) {
        console.log(formParsed.error);
        console.log("Failed to create new unique kill method,", formData);
        return;
    }

    console.log("Creating new unique kill");
    await db.insert(uniqueKillSchema).values({
        target: formParsed.data.target,
        map: formParsed.data.map,
        kill_method: formParsed.data.kill_method,
        name: formParsed.data.name,
        requires: formParsed.data.requires,
        starts: formParsed.data.starts,
        timings: formParsed.data.timings,
        notes: formParsed.data.notes,
        video_link: formParsed.data.video_link,
        visible: true,
    });

    revalidatePath("/[mission]/targets", "page");
}

export async function UpdateUniqueKillAction(formData: FormData) {
    const session = await auth();

    if (!session || !session.user || !session.user.admin) {
        return "unauthorized";
    }

    const formParsed = updateUniqueKillScheme.safeParse({
        id: formData.get("id"),
        target: formData.get("target"),
        map: formData.get("map"),
        kill_method: formData.get("kill_method"),
        name: formData.get("name"),
        requires: formData.get("requires"),
        starts: formData.get("starts"),
        timings: formData.get("timings"),
        notes: formData.get("notes"),
        video_link: formData.get("video_link"),
    });

    if (!formParsed.success) {
        console.log(formParsed.error);
        return;
    }

    await db
        .update(uniqueKillSchema)
        .set(formParsed.data)
        .where(eq(uniqueKillSchema.id, formParsed.data.id));

    revalidatePath("/[mission]/targets", "page");
}

export async function DeleteUniqueKillAction(uniqueKillId: string) {
    const session = await auth();

    if (!session || !session.user || !session.user.admin) {
        return "unauthorized";
    }

    await db
        .update(uniqueKillSchema)
        .set({ visible: false })
        .where(eq(uniqueKillSchema.id, uniqueKillId));

    revalidatePath("/[mission]/targets", "page");
}

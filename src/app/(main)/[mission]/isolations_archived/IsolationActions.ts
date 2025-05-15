"use server";

import { auth } from "@/auth";
import { db } from "@/server/db";
import { isolationSchema } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import z from "zod";

const newIsolationScheme = z.object({
    target: z.string().min(1),
    mission: z.string().min(1),
    name: z.string().min(1),
    requires: z.string(),
    starts: z.string(),
    timings: z.string(),
    notes: z.string(),
    video_link: z.string().min(1),
});

const updateIsolationScheme = z.object({
    id: z.string().min(1),
    target: z.string().min(1),
    mission: z.string().min(1),
    name: z.string().min(1),
    requires: z.string(),
    starts: z.string(),
    timings: z.string(),
    notes: z.string(),
    video_link: z.string().min(1),
});

export async function CreateIsolationAction(formData: FormData) {
    const session = await auth();

    if (!session || !session.user || !session.user.admin) {
        return "unauthorized";
    }

    const formParsed = newIsolationScheme.safeParse({
        target: formData.get("target"),
        mission: formData.get("mission"),
        name: formData.get("name"),
        requires: formData.get("requires"),
        starts: formData.get("starts"),
        timings: formData.get("timings"),
        notes: formData.get("notes"),
        video_link: formData.get("video_link"),
    });

    if (!formParsed.success) {
        console.log(formParsed.error);
        console.log("Failed to create new ISO,", formData);
        return;
    }

    console.log("Creating new isolation");
    await db.insert(isolationSchema).values({
        target: formParsed.data.target,
        mission: formParsed.data.mission,
        name: formParsed.data.name,
        requires: formParsed.data.requires,
        starts: formParsed.data.starts,
        timings: formParsed.data.timings,
        notes: formParsed.data.notes,
        info: "",
        video_link: formParsed.data.video_link,
        visible: true,
    });

    revalidatePath("/[mission]/targets", "page");
}

export async function UpdateIsolationAction(formData: FormData) {
    const session = await auth();

    if (!session || !session.user || !session.user.admin) {
        return "unauthorized";
    }

    const formParsed = updateIsolationScheme.safeParse({
        id: formData.get("id"),
        target: formData.get("target"),
        mission: formData.get("mission"),
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
        .update(isolationSchema)
        .set(formParsed.data)
        .where(eq(isolationSchema.id, formParsed.data.id));

    revalidatePath("/[mission]/targets", "page");
}

export async function DeleteIsolationAction(isolationId: string) {
    const session = await auth();

    if (!session || !session.user || !session.user.admin) {
        return "unauthorized";
    }

    await db
        .update(isolationSchema)
        .set({ visible: false })
        .where(eq(isolationSchema.id, isolationId));

    revalidatePath("/[mission]/targets", "page");
}

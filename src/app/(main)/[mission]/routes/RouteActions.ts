"use server";

import { auth } from "@/auth";
import { db } from "@/server/db";
import { routeSchema } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import z from "zod";

const newRouteScheme = z.object({
    map: z.string().min(1),
    name: z.string().min(1),
    notes: z.string(),
    video_link: z.string().min(1),
});

const updateRouteScheme = z.object({
    id: z.string().min(1),
    map: z.string().min(1),
    name: z.string().min(1),
    notes: z.string(),
    video_link: z.string().min(1),
});

export async function CreateRouteAction(formData: FormData) {
    const session = await auth();

    if (!session || !session.user || !session.user.admin) {
        return "unauthorized";
    }

    const formParsed = newRouteScheme.safeParse({
        map: formData.get("map"),
        name: formData.get("name"),
        notes: formData.get("notes"),
        video_link: formData.get("video_link"),
    });

    if (!formParsed.success) {
        console.log(formParsed.error);
        console.log("Failed to create new route,", formData);
        return;
    }

    console.log("Creating new route");
    await db.insert(routeSchema).values({
        map: formParsed.data.map,
        name: formParsed.data.name,
        notes: formParsed.data.notes,
        video_link: formParsed.data.video_link,
        visible: true,
    });

    revalidatePath("/[mission]/routes", "page");
}

export async function UpdateRouteAction(formData: FormData) {
    const session = await auth();

    if (!session || !session.user || !session.user.admin) {
        return "unauthorized";
    }

    const formParsed = updateRouteScheme.safeParse({
        id: formData.get("id"),
        map: formData.get("map"),
        name: formData.get("name"),
        notes: formData.get("notes"),
        video_link: formData.get("video_link"),
    });

    if (!formParsed.success) {
        console.log(formParsed.error);
        return;
    }

    await db
        .update(routeSchema)
        .set(formParsed.data)
        .where(eq(routeSchema.id, formParsed.data.id));

    revalidatePath("/[mission]/routes", "page");
}

export async function DeleteRouteAction(routeId: string) {
    const session = await auth();

    if (!session || !session.user || !session.user.admin) {
        return "unauthorized";
    }

    await db
        .update(routeSchema)
        .set({ visible: false })
        .where(eq(routeSchema.id, routeId));

    revalidatePath("/[mission]/routes", "page");
}

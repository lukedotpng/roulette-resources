"use server";

import { auth } from "@/auth";
import { db } from "@/server/db";
import { uniqueKillSchema, updateLogSchema } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import z from "zod";

const newUniqueKillScheme = z.object({
    target: z.string().min(1),
    mission: z.string().min(1),
    kill_method: z.string().min(1),
    name: z.string(),
    info: z.string(),
    video_link: z.string(),
});

const updateUniqueKillScheme = z.object({
    id: z.string().min(1),
    target: z.string().min(1),
    mission: z.string().min(1),
    kill_method: z.string().min(1),
    name: z.string(),
    info: z.string(),
    video_link: z.string(),
});

export async function CreateUniqueKillAction(formData: FormData) {
    const session = await auth();

    if (!session || !session.user || !session.user.admin) {
        return "unauthorized";
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
        console.log(formParsed.error);
        console.log("Failed to create new unique kill method,", formData);
        return;
    }

    console.log("Creating new unique kill");

    let updatedSuccessful = true;

    try {
        await db.insert(uniqueKillSchema).values({
            target: formParsed.data.target,
            mission: formParsed.data.mission,
            kill_method: formParsed.data.kill_method,
            name: formParsed.data.name,
            info: formParsed.data.info,
            video_link: formParsed.data.video_link,
            visible: true,
        });
    } catch {
        console.error(`ERROR CREATING UNIQUE KILL: maybe it sucked!`);
        updatedSuccessful = false;
    }

    if (updatedSuccessful) {
        try {
            await db.insert(updateLogSchema).values({
                username: session.user.username,
                table: "uniqueKills",
                row_id: "",
                content: JSON.stringify(formParsed.data),
                is_admin: true,
            });
        } catch {
            console.error("ERROR UPDATING LOG: This feels ironic");
        }
    }

    revalidatePath("/[mission]/targets", "page");
}

export async function UpdateUniqueKillAction(formData: FormData) {
    const session = await auth();

    if (!session || !session.user || !session.user.admin) {
        return "unauthorized";
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
        console.log(formParsed.error);
        return;
    }

    let updatedSuccessful = true;

    try {
        await db
            .update(uniqueKillSchema)
            .set(formParsed.data)
            .where(eq(uniqueKillSchema.id, formParsed.data.id));
    } catch {
        console.error(
            `ERROR UPDATING UNIQUE KILL ${formParsed.data.id}: thats okay ig!`,
        );
        updatedSuccessful = false;
    }

    if (updatedSuccessful) {
        try {
            await db.insert(updateLogSchema).values({
                username: session.user.username,
                table: "uniqueKills",
                row_id: formParsed.data.id,
                content: JSON.stringify(formParsed.data),
                is_admin: true,
            });
        } catch {
            console.error("ERROR UPDATING LOG: This feels ironic");
        }
    }

    revalidatePath("/[mission]/targets", "page");
}

export async function DeleteUniqueKillAction(uniqueKillId: string) {
    const session = await auth();

    if (!session || !session.user || !session.user.admin) {
        return "unauthorized";
    }

    let updatedSuccessful = true;

    try {
        await db
            .update(uniqueKillSchema)
            .set({ visible: false })
            .where(eq(uniqueKillSchema.id, uniqueKillId));
    } catch {
        console.error(
            `ERROR DELETING UNIQUE KILL ${uniqueKillId}: uhh maybe we do need this!`,
        );
        updatedSuccessful = false;
    }

    if (updatedSuccessful) {
        try {
            await db.insert(updateLogSchema).values({
                username: session.user.username,
                table: "uniqueKills",
                row_id: uniqueKillId,
                content: "DELETE",
                is_admin: true,
            });
        } catch {
            console.error("ERROR UPDATING LOG: This feels ironic");
        }
    }

    revalidatePath("/[mission]/targets", "page");
}

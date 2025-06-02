"use server";

import { auth } from "@/auth";
import { db } from "@/server/db";
import { IsolationSchema, UpdateLogSchema } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import z from "zod";

const newIsolationScheme = z.object({
    target: z.string().min(1),
    mission: z.string().min(1),
    name: z.string().min(1),
    info: z.string(),
    video_link: z.string().min(1),
});

const updateIsolationScheme = z.object({
    id: z.string().min(1),
    target: z.string().min(1),
    mission: z.string().min(1),
    name: z.string().min(1),
    info: z.string(),
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
        info: formData.get("info"),
        video_link: formData.get("video_link"),
    });

    if (!formParsed.success) {
        console.log(formParsed.error);
        console.log("Failed to create new ISO,", formData);
        return;
    }

    console.log("Creating new isolation");

    let updatedSuccessful = true;

    try {
        await db.insert(IsolationSchema).values({
            target: formParsed.data.target,
            mission: formParsed.data.mission,
            name: formParsed.data.name,
            info: formParsed.data.info,
            video_link: formParsed.data.video_link,
            visible: true,
        });
    } catch {
        console.error(`ERROR CREATING ISOLATION: Wouldve been a good iso :/`);
        updatedSuccessful = false;
    }

    if (updatedSuccessful) {
        try {
            await db.insert(UpdateLogSchema).values({
                username: session.user.username,
                table: "isolations",
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
        info: formData.get("info"),
        video_link: formData.get("video_link"),
    });

    if (!formParsed.success) {
        console.log(formParsed.error);
        return;
    }

    let updatedSuccessful = true;

    try {
        await db
            .update(IsolationSchema)
            .set({ updated_at: new Date(), ...formParsed.data })
            .where(eq(IsolationSchema.id, formParsed.data.id));
    } catch {
        console.error(
            `ERROR UPDATING ISOLATION ${formParsed.data.id}: Wouldve been a good update :/`,
        );
        updatedSuccessful = false;
    }

    if (updatedSuccessful) {
        try {
            await db.insert(UpdateLogSchema).values({
                username: session.user.username,
                table: "isolations",
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

export async function DeleteIsolationAction(isolationId: string) {
    const session = await auth();

    if (!session || !session.user || !session.user.admin) {
        return "unauthorized";
    }

    let updatedSuccessful = true;

    try {
        await db
            .update(IsolationSchema)
            .set({ updated_at: new Date(), visible: false })
            .where(eq(IsolationSchema.id, isolationId));
    } catch {
        console.error(
            `ERROR UPDATING ISOLATION ${isolationId}: uhh maybe we do need this!`,
        );
        updatedSuccessful = false;
    }

    if (updatedSuccessful) {
        try {
            await db.insert(UpdateLogSchema).values({
                username: session.user.username,
                table: "isolations",
                row_id: isolationId,
                content: "DELETE",
                is_admin: true,
            });
        } catch {
            console.error("ERROR UPDATING LOG: This feels ironic");
        }
    }

    revalidatePath("/[mission]/targets", "page");
}

"use server";

import { auth } from "@/auth";

export async function UpdateItemAction(formData: FormData) {
    const session = await auth();

    if (!session) {
        return;
    }

    console.log(session.user);
    console.log("Updating item...");
    console.log(formData);
}

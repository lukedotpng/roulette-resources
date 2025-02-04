import { db } from "@/server/db";
import { itemSchema } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import Items from "./_components/Items";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

export default async function Page({
    params,
}: {
    params: Promise<{ mission: string }>;
}) {
    const { mission } = await params;

    const items = await db
        .select()
        .from(itemSchema)
        .where(eq(itemSchema.map, mission));

    if (items === null || items.length === 0) {
        return <h1>No data for this map :(</h1>;
    }

    const session = await auth();
    let isAdmin = false;

    if (session && session.user) {
        if (session.user.username === "lukedotpng") {
            isAdmin = true;
        }
    }

    return (
        <SessionProvider>
            <Items items={items} isAdmin={isAdmin} />
        </SessionProvider>
    );
}

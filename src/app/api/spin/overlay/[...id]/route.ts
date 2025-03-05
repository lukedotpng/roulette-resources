import { db } from "@/server/db";
import { overlaySchema } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; theme: string }> },
) {
    const id = (await params).id;
    const body = await request.json();

    console.log("Updating Spin at", id);
    console.log("\tBody:", body);

    if (!body["query"]) {
        console.error("Query not provided");
        const response = NextResponse.json(
            { error: "Query not provided" },
            { status: 200 },
        );
        return response;
    }

    const query = body["query"];

    const theme = body["theme"] || "default";

    db.update(overlaySchema)
        .set({ spin_query: query, theme: theme })
        .where(eq(overlaySchema.id, id))
        .catch((e) => console.error("SPIN OVERLAY UPDATE:", e));

    revalidatePath("/overlay/" + id);

    const response = NextResponse.json({ status: 200 });

    return response;
}

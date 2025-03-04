export const dynamic = "force-dynamic";

import { db } from "@/server/db";
import { overlaySchema } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import SpinSection from "./_components/SpinSection";

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const overlayId = (await params).id;

    const overlayInfo = await db.query.overlaySchema.findFirst({
        where: eq(overlaySchema.id, overlayId),
    });

    if (!overlayInfo) {
        return <h1 className="text-5xl text-white">{"Error finding spin"}</h1>;
    }

    return (
        <SpinSection
            id={overlayId}
            initialQuery={overlayInfo.spin_query ?? ""}
        />
    );
}

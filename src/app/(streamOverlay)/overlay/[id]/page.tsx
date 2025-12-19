export const dynamic = "force-dynamic";

import { db } from "@/server/db";
import { OverlaySchema } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import SpinSection from "./_components/SpinSection";

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const overlayId = (await params).id;

    return <SpinSection id={overlayId} />;
}

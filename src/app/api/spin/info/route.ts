import {
    SpinTips,
    SpinInfo,
    SpinTipItem,
    SpinTipKill,
    SpinTipDisguise,
    SpinTipDisguiseVideo,
} from "@/app/(main)/spin/types";
import { GetSpinFromQuery } from "@/app/(main)/spin/utils/SpinQuery";
import { db } from "@/server/db";
import {
    DisguiseSchema,
    DisguiseVideoSchema,
    ItemSchema,
    UniqueKillSchema,
} from "@/server/db/schema";
import { UniqueKillToMarkdown } from "@/utils/OldInfoToMarkdown";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest): Promise<Response> {
    const searchParams = request.nextUrl.searchParams;
    const spinQuery = searchParams.get("s");

    if (!spinQuery) {
        return Response.json({});
    }

    const spin = GetSpinFromQuery(spinQuery, false);

    if (!spin) {
        return Response.json({});
    }

    const itemData =
        (await db.query.ItemSchema.findMany({
            where: eq(ItemSchema.mission, spin.mission),
        })) || [];
    const disguiseData = await db.query.DisguiseSchema.findMany({
        where: eq(DisguiseSchema.mission, spin.mission),
        with: {
            disguiseVideoSchema: {
                where: eq(DisguiseVideoSchema.visible, true),
            },
        },
    });
    const uniqueKillData = await db.query.UniqueKillSchema.findMany({
        where: eq(UniqueKillSchema.mission, spin.mission),
    });

    const targetSpinResources = {} as SpinTips;

    const filteredItemData = itemData.filter(
        (item) => item.mission == spin.mission,
    );
    const filteredDisguiseData = disguiseData.filter(
        (disguise) => disguise.mission == spin.mission,
    );
    const filteredUniqueKillData = uniqueKillData.filter(
        (uniqueKill) => uniqueKill.mission == spin.mission,
    );

    (Object.keys(spin.info) as (keyof SpinInfo)[]).map((target) => {
        const itemsInSpin: SpinTipItem[] = [];
        const disguisesInSpin: SpinTipDisguise[] = [];
        const uniqueKillsInSpin: SpinTipKill[] = [];

        const currentCondition = spin.info[target]?.killMethod || "";
        const currentDisguise = spin.info[target]?.disguise || "";
        const isNtko = spin.info[target]?.ntko || false;

        filteredItemData.forEach((item) => {
            const itemId = item.id.split("-")[1];
            if (itemId.toLowerCase() === currentCondition.toLowerCase()) {
                itemsInSpin.push({
                    id: item.id,
                    mission: item.mission,
                    name: item.name,
                    type: item.type,
                    quick_look: item.quick_look,
                    hitmaps_link: item.hitmaps_link || "",
                });
            }
        });

        filteredUniqueKillData.forEach((uniqueKill) => {
            let addUniqueKill = false;

            if (
                !uniqueKill.visible ||
                (uniqueKill.target !== target && spin.mission !== "berlin")
            ) {
                return;
            }

            if (uniqueKill.kill_method === currentCondition) {
                addUniqueKill = true;
            } else if (
                currentCondition.includes("loud") &&
                uniqueKill.kill_method === "loud_kills"
            ) {
                addUniqueKill = true;
            } else if (
                uniqueKill.kill_method === "consumed" &&
                currentCondition === "consumed_poison"
            ) {
                addUniqueKill = true;
            } else if (isNtko && uniqueKill.kill_method === "live_kills") {
                addUniqueKill = true;
            }

            if (addUniqueKill) {
                const uniqueKillInfo =
                    uniqueKill.info === ""
                        ? UniqueKillToMarkdown(uniqueKill)
                        : uniqueKill.info;

                uniqueKillsInSpin.push({
                    id: uniqueKill.id,
                    mission: uniqueKill.mission,
                    name: uniqueKill.name,
                    target: uniqueKill.target,
                    kill_method: uniqueKill.kill_method,
                    info: uniqueKillInfo,
                    video_link: uniqueKill.video_link,
                });
            }
        });

        filteredDisguiseData.forEach((disguise) => {
            const disguiseIdNoMission = disguise.id.split("-")[1] || "";
            if (disguiseIdNoMission === currentDisguise) {
                const disguiseVideos: SpinTipDisguiseVideo[] = [];
                for (const video of disguise.disguiseVideoSchema) {
                    disguiseVideos.push({
                        id: video.id,
                        disguise_id: video.disguise_id,
                        link: video.link,
                        notes: video.notes,
                    });
                }
                disguisesInSpin.push({
                    id: disguise.id,
                    mission: disguise.mission,
                    quick_look: disguise.quick_look,
                    notes: disguise.notes,
                    hitmaps_link: disguise.hitmaps_link,
                    disguiseVideos: disguiseVideos,
                });
            }
        });

        targetSpinResources[target] = {
            items: itemsInSpin,
            disguises: disguisesInSpin,
            uniqueKills: uniqueKillsInSpin,
        };
    });

    return Response.json(targetSpinResources);
}

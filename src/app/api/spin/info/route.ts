import { SpinTips, SpinInfo } from "@/app/(main)/spin/types";
import { GetSpinFromQuery } from "@/app/(main)/spin/utils/SpinQuery";
import { db } from "@/server/db";
import {
    DisguiseSchema,
    ItemSchema,
    UniqueKillSchema,
} from "@/server/db/schema";
import { DisguiseSelect, ItemSelect, UniqueKillSelect } from "@/types";
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
            disguiseVideoSchema: true,
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
        const itemsInSpin: ItemSelect[] = [];
        const disguisesInSpin: DisguiseSelect[] = [];
        const uniqueKillsInSpin: UniqueKillSelect[] = [];

        const currentCondition = spin.info[target]?.killMethod || "";
        const currentDisguise = spin.info[target]?.disguise || "";
        const isNtko = spin.info[target]?.ntko || false;

        filteredItemData.forEach((item) => {
            const itemId = item.id.split("-")[1];
            if (itemId.toLowerCase() === currentCondition.toLowerCase()) {
                itemsInSpin.push(item);
            }
        });

        filteredUniqueKillData.forEach((uniqueKill) => {
            if (uniqueKill.target !== target && spin.mission !== "berlin") {
                return;
            }

            if (uniqueKill.kill_method === currentCondition) {
                uniqueKillsInSpin.push(uniqueKill);
            } else if (
                currentCondition.includes("loud") &&
                uniqueKill.kill_method === "loud_kills"
            ) {
                uniqueKillsInSpin.push(uniqueKill);
            } else if (
                uniqueKill.kill_method === "consumed" &&
                currentCondition === "consumed_poison"
            ) {
                uniqueKillsInSpin.push(uniqueKill);
            } else if (isNtko && uniqueKill.kill_method === "live_kills") {
                uniqueKillsInSpin.push(uniqueKill);
            }
        });

        filteredDisguiseData.forEach((disguise) => {
            const disguiseIdNoMission = disguise.id.split("-")[1] || "";
            if (disguiseIdNoMission === currentDisguise) {
                disguisesInSpin.push(disguise);
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

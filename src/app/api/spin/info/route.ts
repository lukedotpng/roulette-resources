import { GetSpinFromQuery } from "@/lib/SpinQueryUtils";
import { db } from "@/server/db";
import {
    disguiseSchema,
    itemSchema,
    uniqueKillSchema,
} from "@/server/db/schema";
import {
    Disguise,
    Item,
    SpinInfo,
    TargetSpinResources,
    UniqueKill,
} from "@/types";
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

    const items =
        (await db.query.itemSchema.findMany({
            where: eq(itemSchema.map, spin.mission),
        })) || [];
    const disguises = await db.query.disguiseSchema.findMany({
        where: eq(disguiseSchema.map, spin.mission),
        with: {
            disguiseVideoSchema: true,
        },
    });
    // const isolations = await db.query.isolationSchema.findMany({
    //     where: eq(isolationSchema.map, spin.mission),
    // });
    const uniqueKills = await db.query.uniqueKillSchema.findMany({
        where: eq(uniqueKillSchema.map, spin.mission),
    });

    const targetSpinResources = {} as TargetSpinResources;

    (Object.keys(spin.info) as (keyof SpinInfo)[]).map((target) => {
        const itemsInSpin: Item[] = [];
        const disguisesInSpin: Disguise[] = [];
        const uniqueKillsInSpin: UniqueKill[] = [];

        const currentCondition = spin.info[target]?.condition || "";
        const currentDisguise = spin.info[target]?.disguise || "";
        const isNtko = spin.info[target]?.ntko || false;

        items.forEach((item) => {
            const itemId = item.name.toLowerCase().replaceAll(" ", "_");
            if (itemId.toLowerCase() === currentCondition.toLowerCase()) {
                itemsInSpin.push(item);
            }
        });

        uniqueKills.forEach((uniqueKill) => {
            if (uniqueKill.target !== target) {
                return;
            }

            if (uniqueKill.kill_method === currentCondition) {
                uniqueKillsInSpin.push(uniqueKill);
            } else if (
                currentCondition.includes("loud") &&
                uniqueKill.kill_method === "loud_kills"
            ) {
                console.log(target, "loud");
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

        disguises.forEach((disguise) => {
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

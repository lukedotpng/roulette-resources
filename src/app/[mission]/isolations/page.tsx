import { promises as fs } from "fs";

import { IsolationsGroup, Mission } from "@/types";
import Isolations from "./_components/Isolations";
import { MissionTargets } from "@/globals";

export default async function Page({
    params,
}: {
    params: Promise<{ mission: string }>;
}) {
    const mission: Mission = (await params).mission as Mission;

    const isolations = await fs
        .readFile(
            process.cwd() + "/roure_data/" + mission + "/isolations.json",
            "utf-8",
        )
        .then((data) => JSON.parse(data) as IsolationsGroup)
        .catch(() => undefined);

    if (!isolations) {
        return <h1>No data for this map :(</h1>;
    } else {
        return (
            <Isolations
                targets={
                    mission !== "hokkaido"
                        ? MissionTargets[mission]
                        : ["yuki_yamazaki"]
                }
                isolationsGroup={isolations}
            />
        );
    }
}

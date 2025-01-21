import { promises as fs } from "fs";

import { Disguise } from "@/types";
import Disguises from "./_components/Disguises";

export default async function Page({
    params,
}: {
    params: Promise<{ mission: string }>;
}) {
    const { mission } = await params;

    const disguises = await fs
        .readFile(
            process.cwd() + "/roure_data/" + mission + "/disguises.json",
            "utf-8",
        )
        .then((data) => JSON.parse(data) as Disguise[])
        .catch(() => []);

    if (disguises.length === 0) {
        return <h1>No data yet :(</h1>;
    } else {
        return <Disguises disguises={disguises} />;
    }
}

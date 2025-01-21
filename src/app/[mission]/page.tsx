import { promises as fs } from "fs";

export default async function Page({
    params,
}: {
    params: Promise<{ mission: string }>;
}) {
    const { mission } = await params;

    // const parisDisguises = await fs
    //     .readFile(process.cwd() + "/roure_data/paris/disguises.json", "utf-8")
    //     .then((data) => JSON.parse(data) as Disguise[]);

    // const parisIsolations = await fs.readFile(
    //     process.cwd() + "/roure_data/paris/isolations.json",
    //     "utf-8",
    // );
    const items = await fs.readFile(
        process.cwd() + "/roure_data/" + mission + "/items.json",
        "utf-8",
    );
    // const parisUniqueKills = await fs.readFile(
    //     process.cwd() + "/roure_data/paris/unique_kills.json",
    //     "utf-8",
    // );

    if (!items) {
        return <h1>No data for this map :(</h1>;
    } else {
        return <h1>{JSON.stringify(items)}</h1>;
    }
}

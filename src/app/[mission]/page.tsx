import { promises as fs } from "fs";
import Disguises from "./disguises/_components/Disguises";
import { Disguise } from "@/types";

export default async function Page({
    params,
}: {
    params: Promise<{ mission: string }>;
}) {
    const { mission } = await params;

    const parisDisguises = await fs
        .readFile(process.cwd() + "/roure_data/paris/disguises.json", "utf-8")
        .then((data) => JSON.parse(data) as Disguise[]);

    // const parisIsolations = await fs.readFile(
    //     process.cwd() + "/roure_data/paris/isolations.json",
    //     "utf-8",
    // );
    const parisItems = await fs.readFile(
        process.cwd() + "/roure_data/paris/items.json",
        "utf-8",
    );
    // const parisUniqueKills = await fs.readFile(
    //     process.cwd() + "/roure_data/paris/unique_kills.json",
    //     "utf-8",
    // );

    return (
        <section className="flex gap-5 text-xl">
            <h1>General Page under construction</h1>
        </section>
    );
}

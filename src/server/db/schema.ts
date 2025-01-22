import { Disguise, IsolationsGroup, Item, UniqueKillsGroup } from "@/types";

import { json, pgTable, text } from "drizzle-orm/pg-core";

export const disguisesSchema = pgTable("roulette-resources-disguises", {
    map: text().primaryKey(),
    data: json().$type<Disguise[]>(),
});

export const isolationsSchema = pgTable("roulette-resources-isolations", {
    map: text().primaryKey(),
    data: json().$type<IsolationsGroup>(),
});

export const itemsSchema = pgTable("roulette-resources-items", {
    map: text().primaryKey(),
    data: json().$type<Item[]>(),
});

export const uniqueKillsSchema = pgTable("roulette-resources-unique_kills", {
    map: text().primaryKey(),
    data: json().$type<UniqueKillsGroup>(),
});

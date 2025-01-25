import { pgTable, text, uuid } from "drizzle-orm/pg-core";

export const disguiseSchema = pgTable("roulette-resources-disguises", {
    id: text().primaryKey(),
    map: text().notNull(),
    quick_look: text().notNull(),
    hitmaps_link: text(),
    notes: text(),
    video_links: text().array(),
    image_url: text(),
});

export const isolationSchema = pgTable("roulette-resources-isolations", {
    id: uuid().primaryKey(),
    target: text().notNull(),
    map: text().notNull(),
    name: text().notNull(),
    requires: text(),
    starts: text(),
    timings: text(),
    notes: text(),
    video_link: text().notNull(),
});

export const itemSchema = pgTable("roulette-resources-items", {
    id: text().primaryKey(),
    map: text().notNull(),
    name: text().notNull(),
    type: text().notNull(),
    quick_look: text().notNull(),
    hitmaps_link: text(),
});

export const uniqueKillSchema = pgTable("roulette-resources-unique_kills", {
    id: uuid().primaryKey(),
    target: text().notNull(),
    map: text().notNull(),
    kill_method: text().notNull(),
    name: text().notNull(),
    requires: text(),
    starts: text(),
    timings: text(),
    notes: text(),
    video_link: text().notNull(),
});

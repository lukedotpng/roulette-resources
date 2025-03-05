import { randomUUID } from "crypto";
import { relations } from "drizzle-orm";
import { boolean, pgTable, text, uuid } from "drizzle-orm/pg-core";

export const userSchema = pgTable("roulette-resources-users", {
    username: text().primaryKey(),
    name: text(),
    image: text(),
    admin: boolean(),
});

export const disguiseSchema = pgTable("roulette-resources-disguises", {
    id: text().primaryKey(),
    map: text().notNull(),
    quick_look: text().notNull(),
    hitmaps_link: text(),
    notes: text(),
});

export const disguiseVideoSchema = pgTable(
    "roulette-resources-disguise_videos",
    {
        id: uuid()
            .primaryKey()
            .$defaultFn(() => randomUUID()),
        disguise_id: text()
            .notNull()
            .references(() => disguiseSchema.id),
        link: text().notNull(),
        visible: boolean().notNull(),
    },
);

export const disguiseRelations = relations(disguiseSchema, ({ many }) => ({
    disguiseVideoSchema: many(disguiseVideoSchema),
}));

export const disguiseVideoRelations = relations(
    disguiseVideoSchema,
    ({ one }) => ({
        disguise: one(disguiseSchema, {
            fields: [disguiseVideoSchema.disguise_id],
            references: [disguiseSchema.id],
        }),
    }),
);

export const isolationSchema = pgTable("roulette-resources-isolations", {
    id: uuid()
        .primaryKey()
        .$defaultFn(() => randomUUID()),
    target: text().notNull(),
    map: text().notNull(),
    name: text().notNull(),
    requires: text(),
    starts: text(),
    timings: text(),
    notes: text(),
    video_link: text().notNull(),
    visible: boolean().notNull(),
});

export const itemSchema = pgTable("roulette-resources-items", {
    id: uuid().primaryKey(),
    map: text().notNull(),
    name: text().notNull(),
    type: text().notNull(),
    quick_look: text().notNull(),
    hitmaps_link: text(),
});

export const uniqueKillSchema = pgTable("roulette-resources-unique_kills", {
    id: uuid()
        .primaryKey()
        .$defaultFn(() => randomUUID()),
    target: text().notNull(),
    map: text().notNull(),
    kill_method: text().notNull(),
    name: text().notNull(),
    requires: text(),
    starts: text(),
    timings: text(),
    notes: text(),
    video_link: text().notNull(),
    visible: boolean().notNull(),
});

export const overlaySchema = pgTable("roulette-resources-overlays", {
    id: uuid().primaryKey(),
    spin_query: text(),
    theme: text(),
});

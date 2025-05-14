import { relations } from "drizzle-orm";
import {
    boolean,
    integer,
    pgTable,
    text,
    timestamp,
    uuid,
} from "drizzle-orm/pg-core";

export const userSchema = pgTable("roulette-resources-users", {
    username: text().primaryKey(),
    name: text(),
    image: text(),
    admin: boolean(),
});

export const updateLogSchema = pgTable("roulette-resources-update_log", {
    id: uuid().primaryKey().defaultRandom(),
    username: text().notNull(),
    table: text().notNull(),
    row_id: text().notNull(),
    content: text().notNull(),
    created_at: timestamp().defaultNow().notNull(),
    is_admin: boolean().notNull(),
});

export const disguiseSchema = pgTable("dev-roulette-resources-disguises", {
    id: text().primaryKey(),
    mission: text().notNull(),
    quick_look: text().notNull(),
    notes: text(),
    hitmaps_link: text(),
});

export const disguiseVideoSchema = pgTable(
    "dev-roulette-resources-disguise_videos",
    {
        id: uuid().primaryKey().defaultRandom(),
        disguise_id: text()
            .notNull()
            .references(() => disguiseSchema.id),
        link: text().notNull(),
        notes: text().notNull(),
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
    id: uuid().primaryKey().defaultRandom(),
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

export const routeSchema = pgTable("roulette-resources-routes", {
    id: uuid().primaryKey().defaultRandom(),
    map: text().notNull(),
    name: text().notNull(),
    notes: text(),
    video_link: text().notNull(),
    visible: boolean().notNull(),
});

export const itemSchema = pgTable("dev-roulette-resources-items", {
    id: text().primaryKey(),
    mission: text().notNull(),
    name: text().notNull(),
    type: text().notNull(),
    quick_look: text().notNull(),
    hitmaps_link: text(),
});

export const uniqueKillSchema = pgTable("roulette-resources-unique_kills", {
    id: uuid().primaryKey().defaultRandom(),
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
    key: integer().notNull(),
    spin_query: text(),
    theme: text(),
    spin_start_time: integer(),
    match_active: boolean(),
});

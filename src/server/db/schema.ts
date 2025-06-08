import { relations } from "drizzle-orm";
import {
    boolean,
    integer,
    pgTable,
    text,
    timestamp,
    uuid,
} from "drizzle-orm/pg-core";

export const UserSchema = pgTable("roulette-resources-users", {
    username: text().primaryKey(),
    name: text(),
    image: text(),
    admin: boolean(),
});

export const TimingsFlashcard = pgTable(
    "roulette-resources-timings-flashcard",
    {
        id: uuid().primaryKey().defaultRandom(),
        mission: text().notNull(),
        info: text().notNull(),
        created_at: timestamp().defaultNow().notNull(),
        updated_at: timestamp().defaultNow().notNull(),
    },
);

export const ItemSchema = pgTable("roulette-resources-items", {
    id: text().primaryKey(),
    mission: text().notNull(),
    name: text().notNull(),
    type: text().notNull(),
    quick_look: text().notNull(),
    hitmaps_link: text(),
    visible: boolean().notNull().default(true),
    updated_at: timestamp().defaultNow().notNull(),
});

export const DisguiseSchema = pgTable("roulette-resources-disguises", {
    id: text().primaryKey(),
    mission: text().notNull(),
    quick_look: text().notNull(),
    notes: text(),
    hitmaps_link: text(),
});
export const DisguiseVideoSchema = pgTable(
    "roulette-resources-disguise_videos",
    {
        id: uuid().primaryKey().defaultRandom(),
        disguise_id: text()
            .notNull()
            .references(() => DisguiseSchema.id),
        link: text().notNull(),
        notes: text().notNull(),
        visible: boolean().notNull(),
        created_at: timestamp().defaultNow().notNull(),
        updated_at: timestamp().defaultNow().notNull(),
    },
);

export const DisguiseRelations = relations(DisguiseSchema, ({ many }) => ({
    disguiseVideoSchema: many(DisguiseVideoSchema),
}));
export const DisguiseVideoRelations = relations(
    DisguiseVideoSchema,
    ({ one }) => ({
        disguise: one(DisguiseSchema, {
            fields: [DisguiseVideoSchema.disguise_id],
            references: [DisguiseSchema.id],
        }),
    }),
);

export const IsolationSchema = pgTable("roulette-resources-isolations", {
    id: uuid().primaryKey().defaultRandom(),
    target: text().notNull(),
    mission: text().notNull(),
    name: text().notNull(),
    requires: text(),
    starts: text(),
    timings: text(),
    notes: text(),
    info: text().notNull(),
    video_link: text().notNull(),
    visible: boolean().notNull(),
    created_at: timestamp().defaultNow().notNull(),
    updated_at: timestamp().defaultNow().notNull(),
});

export const UniqueKillSchema = pgTable("roulette-resources-unique_kills", {
    id: uuid().primaryKey().defaultRandom(),
    target: text().notNull(),
    mission: text().notNull(),
    kill_method: text().notNull(),
    name: text().notNull(),
    requires: text(),
    starts: text(),
    timings: text(),
    notes: text(),
    info: text().notNull(),
    video_link: text().notNull(),
    visible: boolean().notNull(),
    created_at: timestamp().defaultNow().notNull(),
    updated_at: timestamp().defaultNow().notNull(),
});

export const RouteSchema = pgTable("roulette-resources-routes", {
    id: uuid().primaryKey().defaultRandom(),
    map: text().notNull(),
    name: text().notNull(),
    notes: text(),
    video_link: text().notNull(),
    visible: boolean().notNull(),
    created_at: timestamp().defaultNow().notNull(),
    updated_at: timestamp().defaultNow().notNull(),
});

export const UpdateLogSchema = pgTable("roulette-resources-update_log", {
    id: uuid().primaryKey().defaultRandom(),
    username: text().notNull(),
    table: text().notNull(),
    row_id: text().notNull(),
    content: text().notNull(),
    created_at: timestamp().defaultNow().notNull(),
    is_admin: boolean().notNull(),
});

export const OverlaySchema = pgTable("roulette-resources-overlays", {
    id: uuid().primaryKey(),
    key: integer().notNull(),
    spin_query: text(),
    theme: text(),
    spin_start_time: integer(),
    match_active: boolean(),
});

import { InferSelectModel } from "drizzle-orm";
import {
    disguiseSchema,
    isolationSchema,
    itemSchema,
    uniqueKillSchema,
} from "./server/db/schema";

export type Disguise = InferSelectModel<typeof disguiseSchema>;
export type Isolation = InferSelectModel<typeof isolationSchema>;
export type Item = InferSelectModel<typeof itemSchema>;
export type UniqueKill = InferSelectModel<typeof uniqueKillSchema>;

export type Mission =
    | "paris"
    | "sapienza"
    | "marrakesh"
    | "bangkok"
    | "colorado"
    | "hokkaido"
    | "miami"
    | "santa_fortuna"
    | "mumbai"
    | "ambrose_island"
    | "whittleton_creek"
    | "isle_of_sgail"
    | "new_york"
    | "haven_island"
    | "dubai"
    | "dartmoor"
    | "berlin"
    | "chongqing"
    | "mendoza";

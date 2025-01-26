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

export type Target =
    | "viktor_novikov"
    | "dalia_margolis"
    | "silvio_caruso"
    | "francesca_de_santis"
    | "claus_strandberg"
    | "reza_zaydan"
    | "jordan_cross"
    | "ken_morgan"
    | "sean_rose"
    | "ezra_berg"
    | "penelope_graves"
    | "maya_parvati"
    | "erich_soders"
    | "yuki_yamazaki"
    | "sierra_knox"
    | "robert_knox"
    | "rico_delgado"
    | "jorge_franco"
    | "andrea_martinez"
    | "dawood_rangan"
    | "vanya_shah"
    | "maelstrom"
    | "noel_crest"
    | "sinhi_venthan"
    | "janus"
    | "nolan_cassidy"
    | "zoe_washington"
    | "sophia_washington"
    | "athena_savalas"
    | "tyson_williams"
    | "ljudmila_vetrova"
    | "steven_bradley"
    | "carl_ingram"
    | "marcus_stuyvesant"
    | "alexa_carlisle"
    | "ica_agents"
    | "hush"
    | "imogen_royce"
    | "don_yates"
    | "tamara_vidal";

export type MissionTargets = {
    [key in Mission]: readonly Target[];
};

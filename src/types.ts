import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
    DisguiseSchema,
    DisguiseVideoSchema,
    IsolationSchema,
    ItemSchema,
    RouteSchema,
    UniqueKillSchema,
    UpdateLogSchema,
    TimingsFlashcardSchema,
    TechSchema,
} from "./server/db/schema";

export type DisguiseSelect = InferSelectModel<typeof DisguiseSchema> & {
    disguiseVideoSchema: DisguiseVideoSelect[];
};

export type DisguiseVideoSelect = InferSelectModel<typeof DisguiseVideoSchema>;
export type DisguiseVideoInsert = InferInsertModel<typeof DisguiseVideoSchema>;

export type IsolationSelect = InferSelectModel<typeof IsolationSchema>;
export type IsolationInsert = InferInsertModel<typeof IsolationSchema>;

export type RouteSelect = InferSelectModel<typeof RouteSchema>;
export type RouteInsert = InferInsertModel<typeof RouteSchema>;

export type TechSelect = InferSelectModel<typeof TechSchema>;
export type TechInsert = InferInsertModel<typeof TechSchema>;

export type ItemSelect = InferSelectModel<typeof ItemSchema>;
export type ItemInsert = InferInsertModel<typeof ItemSchema>;

export type TimingsFlashcardSelect = InferSelectModel<
    typeof TimingsFlashcardSchema
>;
export type TimingsFlashcardInsert = InferInsertModel<
    typeof TimingsFlashcardSchema
>;

export type UniqueKillSelect = InferSelectModel<typeof UniqueKillSchema>;
export type UniqueKillInsert = InferInsertModel<typeof UniqueKillSchema>;

export type UpdateLogSelect = InferSelectModel<typeof UpdateLogSchema>;
export type UpdateLogInsert = InferInsertModel<typeof UpdateLogSchema>;

export type ActionResponse =
    | { success: true }
    | { success: false; error: string };

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
    | "whittleton_creek"
    | "ambrose_island"
    | "isle_of_sgail"
    | "new_york"
    | "haven_island"
    | "dubai"
    | "dartmoor"
    | "berlin"
    | "chongqing"
    | "mendoza";

export type Season = "season_1" | "season_2" | "season_3";

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
    | "wazir_kale"
    | "janus"
    | "nolan_cassidy"
    | "noel_crest"
    | "sinhi_akka"
    | "zoe_washington"
    | "sophia_washington"
    | "athena_savalas"
    | "tyson_williams"
    | "ljudmila_vetrova"
    | "steven_bradley"
    | "carl_ingram"
    | "marcus_stuyvesant"
    | "alexa_carlisle"
    | "banner"
    | "chamberlin"
    | "davenport"
    | "green"
    | "lowenthal"
    | "montgomery"
    | "rhodes"
    | "swan"
    | "thames"
    | "tremaine"
    | "hush"
    | "imogen_royce"
    | "don_yates"
    | "tamara_vidal";

export type MissionTargets = {
    [key in Mission]: readonly Target[];
};

export type ItemType = "weapon" | "melee" | "utility";

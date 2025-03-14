import { InferSelectModel } from "drizzle-orm";
import {
    disguiseSchema,
    disguiseVideoSchema,
    isolationSchema,
    itemSchema,
    routeSchema,
    uniqueKillSchema,
} from "./server/db/schema";

export type DisguiseVideo = InferSelectModel<typeof disguiseVideoSchema>;
export type Disguise = InferSelectModel<typeof disguiseSchema> & {
    disguiseVideoSchema: DisguiseVideo[];
};
export type Isolation = InferSelectModel<typeof isolationSchema>;
export type Route = InferSelectModel<typeof routeSchema>;
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

export type BerlinUniqueKill =
    | "loud_kills"
    | "drowning"
    | "falling_object"
    | "fall"
    | "fire"
    | "electrocution"
    | "explosion_accident"
    | "consumed"
    | "live_kills";

export type MissionSpinInfoElement = "disguises" | "conditions";

export type ConditionType = "melee" | "weapon" | "unique_kill";

export type TargetConditions = {
    [key in ConditionType]: string[];
};

export type TargetBannedConditions = {
    [key in SpinTarget]: string[];
};

export type MissionSpinOptions = {
    [key in Mission]: {
        disguises: string[];
        conditions: TargetConditions;
    };
};

export type SpinTarget =
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
    | "ica_agent_#1"
    | "ica_agent_#2"
    | "ica_agent_#3"
    | "ica_agent_#4"
    | "ica_agent_#5"
    | "hush"
    | "imogen_royce"
    | "don_yates"
    | "tamara_vidal";

export type Spin = {
    mission: Mission;
    info: SpinInfo;
};

export type SpinInfo = {
    [key in SpinTarget]?: {
        disguise: string;
        condition: string;
        ntko: boolean;
    };
};

export type SpinMissionTargets = {
    [key in Mission]: readonly SpinTarget[];
};

export type TargetUniqueKills = {
    [key in SpinTarget]: string[];
};

export type MissionPoolOptions = {
    [key in Mission]: boolean;
};

export type SeasonPoolSelected = {
    [key in Season]: boolean;
};

export type MissionDisguises = {
    [key in Mission]: string[];
};

export type SpinUpdateAction = "condition" | "disguise" | "toggle_ntko";

export type SpinResources = {
    items: Item[];
    disguises: Disguise[];
    uniqueKills: UniqueKill[];
};

export type TargetSpinResources = {
    [key in SpinTarget]?: SpinResources;
};

export type OverlayTheme = "default" | "text_only";

export type SpinSettings = {
    dontRepeatMissions: boolean;
    ToggleDontRepeatMissions: () => void;
    showTips: boolean;
    ToggleShowTips: () => void;
    layoutMode: string;
    SetLayoutMode: (layout: string) => void;
    manualMode: boolean;
    ToggleManualMode: () => void;
    canAlwaysEditNTKO: boolean;
    ToggleCanAlwaysEditNTKO: () => void;
    showQueueList: boolean;
    ToggleShowQueueList: () => void;
    updateQuery: boolean;
    ToggleUpdateQuery: () => void;
    streamOverlayActive: boolean;
    ToggleStreamOverlayActive: () => void;
    overlayTheme: OverlayTheme;
    SetOverlayTheme: (theme: OverlayTheme) => void;
};

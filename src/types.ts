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
} from "./server/db/schema";
import { Ruleset } from "./app/(main)/spin/_components/CustomRulesComponents/CustomRuleTypes";

export type DisguiseSelect = InferSelectModel<typeof DisguiseSchema> & {
    disguiseVideoSchema: DisguiseVideoSelect[];
};

export type DisguiseVideoSelect = InferSelectModel<typeof DisguiseVideoSchema>;
export type DisguiseVideoInsert = InferInsertModel<typeof DisguiseVideoSchema>;

export type IsolationSelect = InferSelectModel<typeof IsolationSchema>;
export type IsolationInsert = InferInsertModel<typeof IsolationSchema>;

export type RouteSelect = InferSelectModel<typeof RouteSchema>;
export type RouteInsert = InferInsertModel<typeof RouteSchema>;

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

export type MissionSpinInfoElement = "disguises" | "killMethods";

export type KillMethodType = "melees" | "weapons" | "unique_kills";

export type TargetKillMethods = {
    [key in KillMethodType]: string[];
};

export type TargetBannedKillMethods = {
    [key in SpinTarget]: string[];
};

export type MissionSpinOptions = {
    [key in Mission]: {
        disguises: string[];
        killMethods: TargetKillMethods;
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
        killMethod: string;
        ntko: boolean;
    };
};

export type LockedTargetConditions = {
    [key in SpinTarget]?: {
        disguise: string;
        killMethod: string;
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

export type SpinUpdateAction = "killMethod" | "disguise" | "toggle_ntko";

export type SpinResources = {
    items: ItemSelect[];
    disguises: DisguiseSelect[];
    uniqueKills: UniqueKillSelect[];
};

export type TargetSpinResources = {
    [key in SpinTarget]?: SpinResources;
};

export type ToggleOption = {
    val: boolean;
    Toggle: () => void;
};

export type Option<T> = {
    val: T;
    Set: (value: T) => void;
};

export type SpinOptions = {
    missionPool: Option<Mission[]>;
    missionQueue: Option<Mission[]>;
    queueIndex: Option<number>;
    queueMode: ToggleOption;
    matchMode: ToggleOption;
    simRecords: Option<MatchSimRecord[]>;
    dontRepeatMissions: ToggleOption;
    showTips: ToggleOption;
    layoutMode: Option<string>;
    manualMode: ToggleOption;
    canAlwaysEditNTKO: ToggleOption;
    showQueueList: ToggleOption;
    updateQuery: ToggleOption;
    warnForIllegalSpins: ToggleOption;
    streamOverlayActive: ToggleOption;
    overlayTheme: Option<string>;
    lockedConditions: Option<LockedTargetConditions>;
    ruleset: Option<Ruleset>;
    playCustomRules: ToggleOption;
};

export type SpinIllegalReason =
    | "error_checking_legality"
    | "repeat_kill_method"
    | "repeat_disguise"
    | "condition_banned"
    | "kill_method_banned_with_disguise"
    | "illegal_ntko";

export type SpinCheckResult = {
    legal: boolean;
    reason?: SpinIllegalReason;
    reason_info?: string;
};

export type DisguiseStats = {
    disguise: string;
    count: number;
};

export type KillMethodStats = {
    method: string;
    count: number;
};

export type TargetSpinStats = {
    meleesCount: number;
    uniqueKillsCount: number;
    weaponsCount: number;
    largeWeaponCount: number;
    trapKillCount: number;
    ntkoCount: number;
    disguises: { [key: string]: DisguiseStats };
    killMethods: { [key: string]: KillMethodStats };
};

export type SpinGenStats = {
    title: string;
    time: number;
};

export type SpinStats = {
    count: number;
    illegalSpinCount: number;
    targets: { [key in SpinTarget]?: TargetSpinStats };
};

export type MatchSimRecord = {
    mission: Mission;
    spinId: string;
    time: number; // in ms
    date: number; // in ms
};

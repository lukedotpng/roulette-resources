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

export type KillMethodType = "melees" | "weapons" | "unique_kills";

export type MissionTargets = {
    [key in Mission]: readonly SpinTarget[];
};

export type TargetKillMethods = {
    [key in KillMethodType]: string[];
};

export type TargetBannedKillMethods = {
    [key in SpinTarget]: string[];
};

export type TargetUniqueKills = {
    [key in SpinTarget]: string[];
};

export type MissionDisguises = {
    [key in Mission]: string[];
};

export type MissionSpinOptions = {
    [key in Mission]: {
        disguises: string[];
        killMethods: TargetKillMethods;
    };
};

// SPIN CHECKING
type SpinIllegalReason =
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

import {
    DisguiseSelect,
    ItemSelect,
    Mission,
    Season,
    UniqueKillSelect,
} from "@/types";

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

export type SpinUpdateAction = "killMethod" | "disguise" | "toggle_ntko";

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

export type SpinMode = "pool" | "queue" | "seeded_queue";

export type SpinManager = {
    currentSpin: Spin | null;
    spinQuery: string;
    missionPool: Mission[];
    SetMissionPool: (updatedMissionPool: Mission[]) => void;
    noMissionsSelectedAlertActive: boolean;
    missionQueue: Mission[];
    SetMissionQueue: (updatedMissionQueue: Mission[]) => void;
    spinMode: SpinMode;
    SetSpinMode: (updatedSpinMode: SpinMode) => void;
    manualMode: boolean;
    SetManualMode: (newState: boolean) => void;
    NewSpin: (mission?: Mission) => void;
    Respin: () => void;
    RespinCondition: (target: SpinTarget, action: SpinUpdateAction) => void;
    NextSpin: () => void;
    PreviousSpin: () => void;
    queueIndex: number;
    SetQueueIndex: (updatedIndex: number) => void;
    EditSpin: (
        target: SpinTarget,
        action: SpinUpdateAction,
        newValue: string,
    ) => void;
    lockedConditions: LockedTargetConditions;
    SetLockedConditions: (
        updatedLockedConditions: LockedTargetConditions,
    ) => void;
    spinIsLegal: SpinCheckResult;
    options: SpinOptions;
    matchModeManager: MatchModeManager;
    StartMatch: () => void;
    StopMatch: () => void;
};

export type LockedTargetConditions = {
    [key in SpinTarget]?: {
        disguise: string;
        killMethod: string;
        ntko: boolean;
    };
};

export type SpinTheme = "row" | "col";
export type OverlayTheme = "default" | "text";
export type StreamOverlay = {
    id: string;
    RegenerateId: (updatedId: string, spinQuery: string) => void;
    key: number;
    active: boolean;
    ToggleActive: () => void;
    theme: OverlayTheme;
    SetTheme: (updatedTheme: OverlayTheme) => void;
};
export type SpinOptions = {
    // General
    dontRepeatMissions: { value: boolean; Toggle: () => void };
    updateUrlOnSpin: { value: boolean; Toggle: () => void };
    canAlwaysEditNTKO: { value: boolean; Toggle: () => void };
    showQueueList: { value: boolean; Toggle: () => void };
    spinTheme: { value: SpinTheme; Set: (newSpinTheme: SpinTheme) => void };
    // Help
    showTips: { value: boolean; Toggle: () => void };
    warnForIllegalSpins: { value: boolean; Toggle: () => void };
    // Stream Overlay
    streamOverlay: StreamOverlay;
};

export type MatchModeManager = {
    enabled: boolean;
    SetEnabled: (updatedState: boolean) => void;
    matchActive: boolean;
    SetMatchActive: (updatedState: boolean) => void;
    simRecords: MatchSimRecord[];
    SetSimRecords: (updatedSimRecords: MatchSimRecord[]) => void;
};

export type MatchSimRecord = {
    mission: Mission;
    spinId: string;
    time: number; // in ms
    date: number; // in ms
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

export type SpinResources = {
    items: ItemSelect[];
    disguises: DisguiseSelect[];
    uniqueKills: UniqueKillSelect[];
};

export type TargetSpinResources = {
    [key in SpinTarget]?: SpinResources;
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

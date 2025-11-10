import {
    Mission,
    Spin,
    SpinCheckResult,
    SpinTarget,
} from "@/lib/RouletteSpinner/types";
import { Season } from "@/types";

export type MissionSpinInfoElement = "disguises" | "killMethods";

export type SpinUpdateAction = "killMethod" | "disguise" | "toggle_ntko";

export type SpinMode = "pool" | "queue" | "seeded_queue";

export type SpinManager = {
    currentSpin: Spin | null;
    SetCurrentSpin: (updatedSpin: Spin) => void;
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
    queueSeed: string;
    SetQueueSeed: (updatedQueueSeed: string) => void;
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
    useSeededQueues: { value: boolean; Toggle: () => void };
    spinTheme: { value: SpinTheme; Set: (newSpinTheme: SpinTheme) => void };
    // Help
    showTips: { value: boolean; Toggle: () => void };
    warnForIllegalSpins: { value: boolean; Toggle: () => void };
    // Stream Overlay
    streamOverlay: StreamOverlay;
};

export type MatchModeManager = {
    enabled: boolean;
    matchActive: boolean;
    EnableMatchMode: () => void;
    DisableMatchMode: () => void;
    StartMatch: () => void;
    EndMatch: () => void;
    simRecords: MatchSimRecord[];
    SetSimRecords: (updatedSimRecords: MatchSimRecord[]) => void;
};

export type MatchSimRecord = {
    mission: Mission;
    spinId: string;
    time: number; // in ms
    date: number; // in ms
};

export type SpinQuery = {
    query: string;
    UpdateQuery: (spin: Spin) => void;
};

export type MissionPoolOptions = {
    [key in Mission]: boolean;
};

export type SeasonPoolSelected = {
    [key in Season]: boolean;
};

export type SpinTipItem = {
    id: string;
    mission: string;
    name: string;
    type: string;
    quick_look: string;
    hitmaps_link: string;
};

export type SpinTipDisguiseVideo = {
    id: string;
    disguise_id: string;
    link: string;
    notes: string;
};

export type SpinTipDisguise = {
    id: string;
    mission: string;
    quick_look: string;
    notes: string | null;
    hitmaps_link: string | null;
    disguiseVideos: SpinTipDisguiseVideo[];
};

export type SpinTipKill = {
    id: string;
    mission: string;
    name: string;
    target: string;
    kill_method: string;
    info: string;
    video_link: string;
};

export type TargetSpinTips = {
    items: SpinTipItem[];
    disguises: SpinTipDisguise[];
    uniqueKills: SpinTipKill[];
};

export type SpinTips = {
    [key in SpinTarget]?: TargetSpinTips;
};

export type FocusedSpinTip =
    | {
          type: "disguise";
          data: SpinTipDisguise;
      }
    | {
          type: "killMethod";
          data: SpinTipKill;
      }
    | null;

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

export type HitmapsSpin = {
    mission: { slug: string };
    targetConditions: HitmapsTargetConditions[];
};

export type HitmapsTargetConditions = {
    target: {
        name: string;
    };
    killMethod: {
        name: string;
        selectedVariant: string | null;
    };
    disguise: {
        name: string;
    };
    complications: {
        name: string;
    }[];
};

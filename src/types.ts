export type Disguise = {
    disguise_id: string;
    name: string;
    quick_look: string;
    hitmaps_link: string;
    notes: string;
    video_links: string[];
};

export type Isolation = {
    name: string;
    video_link: string;
    requires: string;
    starts: string;
    timings: string;
    notes: string;
};

export type IsolationsGroup = {
    [key: string]: Isolation[];
};

export type Item = {
    item_id: string;
    name: string;
    type: string;
    quick_look: string;
    hitmaps_link: string;
    tags: string[];
};

export type UniqueKill = {
    name: string;
    methods: Method[];
};

export type Method = {
    name: string;
    video_link: string;
    requires: string;
    starts: string;
    timings: string;
    notes: string;
};

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

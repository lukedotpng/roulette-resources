import { BerlinUniqueKill, Mission, MissionTargets } from "./types";

export const Missions: Mission[] = [
    "paris",
    "sapienza",
    "marrakesh",
    "bangkok",
    "colorado",
    "hokkaido",
    "miami",
    "santa_fortuna",
    "mumbai",
    "whittleton_creek",
    "ambrose_island",
    "isle_of_sgail",
    "new_york",
    "haven_island",
    "dubai",
    "dartmoor",
    "berlin",
    "chongqing",
    "mendoza",
] as const;

export const MissionTargetsList: MissionTargets = {
    paris: ["viktor_novikov", "dalia_margolis"],
    sapienza: ["silvio_caruso", "francesca_de_santis"],
    marrakesh: ["claus_strandberg", "reza_zaydan"],
    bangkok: ["jordan_cross", "ken_morgan"],
    colorado: ["sean_rose", "ezra_berg", "penelope_graves", "maya_parvati"],
    hokkaido: ["erich_soders", "yuki_yamazaki"],
    miami: ["sierra_knox", "robert_knox"],
    santa_fortuna: ["rico_delgado", "jorge_franco", "andrea_martinez"],
    mumbai: ["dawood_rangan", "vanya_shah", "wazir_kale"],
    whittleton_creek: ["janus", "nolan_cassidy"],
    ambrose_island: ["noel_crest", "sinhi_venthan"],
    isle_of_sgail: ["zoe_washington", "sophia_washington"],
    new_york: ["athena_savalas"],
    haven_island: ["tyson_williams", "ljudmila_vetrova", "steven_bradley"],
    dubai: ["carl_ingram", "marcus_stuyvesant"],
    dartmoor: ["alexa_carlisle"],
    berlin: [
        "banner",
        "chamberlin",
        "davenport",
        "green",
        "lowenthal",
        "montgomery",
        "rhodes",
        "swan",
        "thames",
        "tremaine",
    ],
    chongqing: ["hush", "imogen_royce"],
    mendoza: ["don_yates", "tamara_vidal"],
} as const;

export const UniqueKillTypes = [
    "loud_kills",
    "drowning",
    "falling_object",
    "fall",
    "fire",
    "electrocution",
    "explosion_accident",
    "consumed",
    "live_kills",
    "firearm",
    "poison_stem_cells",
    "shoot_silvio_through_the_telescope",
    "explosive_watch_battery",
    "shoot_the_car",
    "athena_savalas_award",
    "explosive_on_water_scooter",
    "robot_arms",
    "throw_the_heart_in_the_trash",
    "shoot_the_heart",
    "explosion",
    "impact_explosive",
];

// making seperate group for berlin so i can iterate through them instead of targets
export const BerlinUniqueKillTypes: BerlinUniqueKill[] = [
    "loud_kills",
    "drowning",
    "falling_object",
    "fall",
    "fire",
    "electrocution",
    "explosion_accident",
    "consumed",
    "live_kills",
];

export function DisguiseIDToDisplayText(disguise: string) {
    let disguiseDisplayText = "";
    // disguise ID example: paris-palace_staff
    const disguiseSplit = disguise.split("-")[1]; // palace_staff
    const words = disguiseSplit.split("_"); // ["palace", "staff"]

    for (const word of words) {
        disguiseDisplayText +=
            word.charAt(0).toUpperCase() + word.slice(1) + " ";
    }

    return disguiseDisplayText.trim();
}

import { Mission } from "./types";

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
    "ambrose_island",
    "whittleton_creek",
    "isle_of_sgail",
    "new_york",
    "haven_island",
    "dubai",
    "dartmoor",
    "berlin",
    "chongqing",
    "mendoza",
] as const;

export const MissionTargets = {
    paris: ["viktor_novikov", "dalia_margolis"],
    sapienza: ["silvio_caruso", "francesca_de_santis"],
    marrakesh: ["claus_strandberg", "reza_zaydan"],
    bangkok: ["jordan_cross", "ken_morgan"],
    colorado: ["sean_rose", "ezra_berg", "penelope_graves", "maya_parvati"],
    hokkaido: ["erich_soders", "yuki_yamazaki"],
    miami: ["sierra_knox", "robert_knox"],
    santa_fortuna: ["rico_delgado", "jorge_franco", "andrea_martinez"],
    mumbai: ["dawood_rangan", "vanya_shah", "maelstrom"],
    ambrose_island: ["noel_crest", "sinhi_venthan"],
    whittleton_creek: ["janus", "nolan_cassidy"],
    isle_of_sgail: ["zoe_washington", "sophia_washington"],
    new_york: ["athena_savalas"],
    haven_island: ["tyson_williams", "ljudmila_vetrova", "steven_bradley"],
    dubai: ["carl_ingram", "marcus_stuyvesant"],
    dartmoor: ["alexa_carlisle"],
    berlin: ["ica_agents"],
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
];

export const SodersUniqueKillTypes = [
    "firearm",
    "poison_stem_cells",
    "robot_arms",
    "electrocution",
    "throw_heart_in_trash_can",
    "shoot_heart",
    "explosive",
];

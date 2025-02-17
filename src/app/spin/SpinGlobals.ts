import {
    SpinMissionTargets,
    TargetBannedConditions,
    MissionSpinOptions,
    TargetUniqueKills,
    Mission,
    MissionPoolOptions,
    SeasonPoolSelected,
    MissionDisguises,
} from "@/types";

// Global
export const weapons = [
    "pistol",
    "sniper_rifle",
    "assault_rifle",
    "smg",
    "shotgun",
    "explosive",
];
export const weaponModifierPrefix = ["loud_", "silenced_", ""];
export const explosiveModifierPrefix = ["remote_", "loud_remote_", "impact_"];
export const pistolConditionList = ["loud_pistol", "pistol", "silenced_pistol"];
export const smgConditionList = ["loud_smg", "smg", "silenced_smg"];
export const assaultRifleConditionList = [
    "loud_assault_rifle",
    "assault_rifle",
    "silenced_assault_rifle",
];
export const shotgunConditionList = [
    "loud_shotgun",
    "shotgun",
    "silenced_shotgun",
];
export const sniperConditionList = [
    "loud_sniper_rifle",
    "sniper_rifle",
    "silenced_sniper_rifle",
];
const uniqueKills = [
    "drowning",
    "falling_object",
    "fall",
    "fire",
    "electrocution",
    "explosion_accident",
    "consumed_poison",
    "injected_poison",
];

// Paris
const parisMelees = [
    "scissors",
    "screwdriver",
    "letter_opener",
    "fire_axe",
    "kitchen_knife",
    "cleaver",
    "hatchet",
    "battle_axe",
    "saber",
    "fiber_wire",
    "neck_snap",
];
const parisDisguises = [
    "suit",
    "auction_staff",
    "chef",
    "cicada_bodyguard",
    "helmut_kruger",
    "palace_staff",
    "security_guard",
    "sheikh",
    "stylist",
    "tech_crew",
    "vampire_magician",
];

// Sapienza
const sapienzaMelees = [
    "circumcision_knife",
    "amputation_knife",
    "fire_axe",
    "letter_opener",
    "screwdriver",
    "hatchet",
    "kitchen_knife",
    "saber",
    "scissors",
    "combat_knife",
    "folding_knife",
    "old_axe",
    "battle_axe",
    "katana",
    "cleaver",
    "fiber_wire",
    "neck_snap",
];
const sapienzaDisguises = [
    "suit",
    "biolab_security",
    "bodyguard",
    "bohemian",
    "butler",
    "church_staff",
    "cyclist",
    "delivery_man",
    "oscar_lafayette",
    "gardener",
    "green_plumber",
    "hazmat_suit",
    "housekeeper",
    "kitchen_assistant",
    "lab_technician",
    "chef",
    "mansion_security",
    "mansion_staff",
    "plague_doctor",
    "priest",
    "private_detective",
    "red_plumber",
    "roberto_vargas",
    "store_clerk",
    "street_performer",
    "waiter",
];

// Marrakesh
const marrakeshMelees = [
    "screwdriver",
    "kitchen_knife",
    "cleaver",
    "scissors",
    "letter_opener",
    "fire_axe",
    "saber",
    "battle_axe",
    "fiber_wire",
    "neck_snap",
];
const marrakeshDisguises = [
    "suit",
    "bodyguard",
    "cameraman",
    "consulate_intern",
    "consulate_janitor",
    "consulate_security",
    "elite_soldier",
    "food_vendor",
    "fortune_teller",
    "handyman",
    "headmaster",
    "local_printing_crew",
    "masseur",
    "military_officer",
    "military_soldier",
    "prisoner",
    "shopkeeper",
    "waiter",
];

// Bangkok
const bangkokMelees = [
    "hatchet",
    "fire_axe",
    "screwdriver",
    "cleaver",
    "kitchen_knife",
    "letter_opener",
    "katana",
    "sappers_axe",
    "fiber_wire",
    "neck_snap",
];
const bangkokDisguises = [
    "suit",
    "abel_de_silva",
    "exterminator",
    "groundskeeper",
    "hotel_security",
    "hotel_staff",
    "jordan_cross_bodyguard",
    "kitchen_staff",
    "morgans_bodyguard",
    "recording_crew",
    "stalker",
    "waiter",
];

// Colorado
const coloradoMelees = [
    "screwdriver",
    "cleaver",
    "kitchen_knife",
    "old_axe",
    "fiber_wire",
    "neck_snap",
];
const coloradoDisguises = [
    "suit",
    "explosives_specialist",
    "hacker",
    "militia_cook",
    "militia_elite",
    "militia_soldier",
    "militia_spec_ops",
    "militia_technician",
    "point_man",
    "scarecrow",
];

// Hokkaido
const hokkaidoMelees = [
    "fire_axe",
    "scalpel",
    "screwdriver",
    "kitchen_knife",
    "cleaver",
    "katana",
    "scissors",
    "fiber_wire",
    "neck_snap",
];
const hokkaidoDisguises = [
    "suit",
    "baseball_player",
    "bodyguard",
    "chef",
    "chief_surgeon",
    "doctor",
    "handyman",
    "helicopter_pilot",
    "hospital_director",
    "morgue_doctor",
    "motorcyclist",
    "ninja",
    "patient",
    "resort_security",
    "resort_staff",
    "surgeon",
    "amos_dexter",
    "jason_portman",
    "yoga_instructor",
];

// Miami
const miamiMelees = [
    "screwdriver",
    "fire_axe",
    "scissors",
    "kitchen_knife",
    "cleaver",
    "old_axe",
    "amputation_knife",
    "starfish",
    "battle_axe",
    "fiber_wire",
    "neck_snap",
];
const miamiDisguises = [
    "suit",
    "aeon_driver",
    "aeon_mechanic",
    "blue_seed_driver",
    "crashed_kronstadt_driver",
    "event_crew",
    "event_security",
    "florida_man",
    "food_vendor",
    "journalist",
    "kitchen_staff",
    "kowoon_driver",
    "kowoon_mechanic",
    "kronstadt_engineer",
    "kronstadt_mechanic",
    "kronstadt_researcher",
    "kronstadt_security",
    "mascot",
    "medic",
    "moses_lee",
    "pale_rider",
    "race_coordinator",
    "race_marshal",
    "sheikh",
    "sotteraneo_mechanic",
    "street_musician",
    "ted_mendez",
    "thwack_driver",
    "thwack_mechanic",
    "waiter",
];

// Santa Fortuna
const santaFortunaMelees = [
    "screwdriver",
    "kitchen_knife",
    "letter_opener",
    "scissors",
    "cleaver",
    "machete",
    "folding_knife",
    "barber_razor",
    "fiber_wire",
    "neck_snap",
];
const santaFortunaDisguises = [
    "suit",
    "band_member",
    "barman",
    "chef",
    "coca_field_guard",
    "coca_field_worker",
    "construction_worker",
    "drug_lab_worker",
    "elite_guard",
    "gardener",
    "hippie",
    "hippo_whisperer",
    "mansion_guard",
    "mansion_staff",
    "shaman",
    "street_soldier",
    "submarine_crew",
    "submarine_engineer",
    "tattoo_artist",
];

// Mumbai
const mumbaiMelees = [
    "kitchen_knife",
    "beak_staff",
    "old_axe",
    "scissors",
    "screwdriver",
    "barber_razor",
    "fire_axe",
    "amputation_knife",
    "cleaver",
    "folding_knife",
    "letter_opener",
    "saber",
    "fiber_wire",
    "neck_snap",
];
const mumbaiDisguises = [
    "suit",
    "barber",
    "bollywood_bodyguard",
    "bollywood_crew",
    "dancer",
    "elite_thug",
    "food_vendor",
    "holy_man",
    "kashmirian",
    "laundry_foreman",
    "laundry_worker",
    "lead_actor",
    "local_security",
    "metal_worker",
    "painter",
    "queens_bodyguard",
    "queens_guard",
    "tailor",
    "thug",
    "vanyas_servant",
];

// Whittleton Creek
const whittletonCreekMelees = [
    "kitchen_knife",
    "screwdriver",
    "fire_axe",
    "scissors",
    "letter_opener",
    "hatchet",
    "fiber_wire",
    "neck_snap",
];
const whittletonCreekDisguises = [
    "suit",
    "arkian_robes",
    "bbq_owner",
    "cassidy_bodyguard",
    "construction_worker",
    "exterminator",
    "garbage_man",
    "gardener",
    "gunther",
    "james_batty",
    "janus_bodyguard",
    "mailman",
    "nurse",
    "plumber",
    "police_deputy",
    "politician",
    "politicians_assistant",
    "real_estate_broker",
    "server",
    "sheriff_masterson",
    "spencer_green",
];

// Ambrose Island
const ambroseIslandMelees = [
    "garden_fork",
    "starfish",
    "scissors",
    "cleaver",
    "kitchen_knife",
    "meat_fork",
    "letter_opener",
    "kukri_machete",
    "seashell",
    "screwdriver",
    "folding_knife",
    "old_axe",
    "hook",
    "scrap_sword",
    "shears",
    "barber_razor",
    "hobby_knife",
    "jarls_pirate_saber",
    "fiber_wire",
    "neck_snap",
];
const ambroseIslandDisguises = [
    "suit",
    "cook",
    "engineer",
    "hippie",
    "metal_worker",
    "militia_soldier",
    "pirate",
];

// Isle of Sgail
const isleOfSgailMelees = [
    "battle_axe",
    "sappers_axe",
    "broadsword",
    "old_axe",
    "saber",
    "viking_axe",
    "hatchet",
    "scalpel",
    "screwdriver",
    "letter_opener",
    "cleaver",
    "kitchen_knife",
    "fire_axe",
    "circumcision_knife",
    "scissors",
    "katana",
    "starfish",
    "fiber_wire",
    "neck_snap",
];
const isleOfSgailDisguises = [
    "suit",
    "architect",
    "ark_member",
    "blake_nathaniel",
    "burial_robes",
    "butler",
    "castle_staff",
    "chef",
    "custodian",
    "elite_guard",
    "entertainer",
    "event_staff",
    "guard",
    "initiate",
    "jebediah_block",
    "knights_armor",
    "master_of_ceremonies",
    "raider",
];

const newYorkMelees = [
    "letter_opener",
    "screwdriver",
    "fire_axe",
    "scissors",
    "tanto",
    "hobby_knife",
    "burial_dagger",
    "kitchen_knife",
    "antique_carved_knife",
    "folding_knife",
    "fiber_wire",
    "neck_snap",
];
const newYorkDisguises = [
    "suit",
    "bank_robber",
    "bank_teller",
    "fired_banker",
    "high_security_guard",
    "investment_banker",
    "it_worker",
    "janitor",
    "job_applicant",
    "security_guard",
];

// Haven Island
const havenIslandMelees = [
    "barber_razor",
    "scissors",
    "scalpel",
    "machete",
    "folding_knife",
    "screwdriver",
    "starfish",
    "cleaver",
    "kitchen_knife",
    "hatchet",
    "letter_opener",
    "seashell",
    "jarls_pirate_saber",
    "fire_axe",
    "fiber_wire",
    "neck_snap",
];
const havenIslandDisguises = [
    "suit",
    "boat_captain",
    "bodyguard",
    "butler",
    "chef",
    "doctor",
    "gas_suit",
    "lifeguard",
    "masseur",
    "personal_trainer",
    "resort_guard",
    "resort_staff",
    "snorkel_instructor",
    "tech_crew",
    "villa_guard",
    "villa_staff",
    "waiter",
];

// Dubai
const dubaiMelees = [
    "letter_opener",
    "ornate_scimitar",
    "kitchen_knife",
    "screwdriver",
    "fire_axe",
    "cleaver",
    "scissors",
    "folding_knife",
    "fiber_wire",
    "neck_snap",
];
const dubaiDisguises = [
    "suit",
    "art_crew",
    "event_security",
    "event_staff",
    "famous_chef",
    "helicopter_pilot",
    "ingrams_bodyguard",
    "kitchen_staff",
    "maintenance_staff",
    "penthouse_guard",
    "penthouse_staff",
    "skydiving_suit",
    "assassin",
];

// Dartmoor
const dartmoorMelees = [
    "hatchet",
    "shears",
    "folding_knife",
    "garden_fork",
    "screwdriver",
    "unicorn_horn",
    "letter_opener",
    "barber_razor",
    "saber",
    "cleaver",
    "scissors",
    "kitchen_knife",
    "fiber_wire",
    "neck_snap",
];
const dartmoorDisguises = [
    "suit",
    "bodyguard",
    "gardener",
    "lawyer",
    "mansion_guard",
    "mansion_staff",
    "photographer",
    "private_investigator",
    "undertaker",
];

// Berlin
const berlinMelees = [
    "kitchen_knife",
    "screwdriver",
    "fire_axe",
    "hobby_knife",
    "battle_axe",
    "garden_fork",
    "scrap_sword",
    "combat_knife",
    "old_axe",
    "concealable_knife",
    "fiber_wire",
    "neck_snap",
];
const berlinDisguises = [
    "suit",
    "bartender",
    "biker",
    "club_crew",
    "club_security",
    "dealer",
    "delivery_guy",
    "dj",
    "florida_man",
    "rolf",
    "technician",
];

// Chongqing
const chongqingMelees = [
    "screwdriver",
    "fire_axe",
    "tanto",
    "letter_opener",
    "scrap_sword",
    "cleaver",
    "kitchen_knife",
    "scissors",
    "hobby_knife",
    "garden_fork",
    "fiber_wire",
    "neck_snap",
];
const chongqingDisguises = [
    "suit",
    "block_guard",
    "dumpling_cook",
    "facility_analyst",
    "facility_engineer",
    "facility_guard",
    "facility_security",
    "homeless_person",
    "perfect_test_subject",
    "researcher",
    "street_guard",
    "board_member",
];

// Mendoza
const mendozaMelees = [
    "broadsword",
    "jarls_pirate_saber",
    "old_axe",
    "sappers_axe",
    "shears",
    "garden_fork",
    "grape_knife",
    "screwdriver",
    "fire_axe",
    "combat_knife",
    "hatchet",
    "machete",
    "hobby_knife",
    "icicle",
    "kitchen_knife",
    "fiber_wire",
    "neck_snap",
];
const mendozaDisguises = [
    "suit",
    "asado_chef",
    "bodyguard",
    "chief_winemaker",
    "corvo_black",
    "gaucho",
    "head_of_security",
    "lawyer",
    "mercenary",
    "providence_herald",
    "sommelier",
    "tango_musician",
    "waiter",
    "winery_worker",
];

export const SpinMissionTargetsList: SpinMissionTargets = {
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
    ambrose_island: ["noel_crest", "sinhi_akka"],
    isle_of_sgail: ["zoe_washington", "sophia_washington"],
    new_york: ["athena_savalas"],
    haven_island: ["tyson_williams", "ljudmila_vetrova", "steven_bradley"],
    dubai: ["carl_ingram", "marcus_stuyvesant"],
    dartmoor: ["alexa_carlisle"],
    berlin: [
        "ica_agent_#1",
        "ica_agent_#2",
        "ica_agent_#3",
        "ica_agent_#4",
        "ica_agent_#5",
    ],
    chongqing: ["hush", "imogen_royce"],
    mendoza: ["don_yates", "tamara_vidal"],
} as const;

export const TargetBannedConditionsList: TargetBannedConditions = {
    viktor_novikov: ["fire"],
    dalia_margolis: ["fire"],
    silvio_caruso: ["fire", "consumed_poison"],
    francesca_de_santis: ["fire"],
    claus_strandberg: ["falling_object"],
    reza_zaydan: ["drowning", "electrocution"],
    jordan_cross: ["fire"],
    ken_morgan: ["fire"],
    sean_rose: ["consumed_poison", "drowning"],
    ezra_berg: ["electrocution", "consumed_poison", "drowning"],
    penelope_graves: ["drowning", "fire"],
    maya_parvati: ["drowning"],
    erich_soders: [],
    yuki_yamazaki: ["fire"],
    sierra_knox: [],
    robert_knox: ["fire"],
    rico_delgado: ["consumed_poison"],
    jorge_franco: ["falling_object"],
    andrea_martinez: ["fire"],
    dawood_rangan: ["fire", "drowning", "consumed_poison"],
    vanya_shah: ["drowning", "consumed_poison"],
    wazir_kale: ["fire", "drowning"],
    janus: ["falling_object", "fire"],
    nolan_cassidy: ["falling_object", "fire"],
    noel_crest: [],
    sinhi_akka: [],
    zoe_washington: ["consumed_poison"],
    sophia_washington: ["consumed_poison", "fire"],
    athena_savalas: ["fire"],
    tyson_williams: ["fire", "consumed_poison"],
    ljudmila_vetrova: ["fire", "falling_object"],
    steven_bradley: ["fire", "consumed_poison"],
    carl_ingram: ["consumed_poison", "fire"],
    marcus_stuyvesant: ["consumed_poison", "fire"],
    alexa_carlisle: ["fire"],
    hush: ["fire", "consumed_poison"],
    imogen_royce: ["fire", "consumed_poison", "falling_object"],
    don_yates: ["consumed_poison", "fire"],
    tamara_vidal: ["consumed_poison", "falling_object", "fire"],
    "ica_agent_#1": [],
    "ica_agent_#2": [],
    "ica_agent_#3": [],
    "ica_agent_#4": [],
    "ica_agent_#5": [],
};

export const MissionSpinInfoList: MissionSpinOptions = {
    paris: {
        disguises: parisDisguises,
        conditions: {
            melee: parisMelees,
            weapon: weapons,
            unique_kill: uniqueKills,
        },
    },
    sapienza: {
        disguises: sapienzaDisguises,
        conditions: {
            melee: sapienzaMelees,
            weapon: weapons,
            unique_kill: uniqueKills,
        },
    },
    marrakesh: {
        disguises: marrakeshDisguises,
        conditions: {
            melee: marrakeshMelees,
            weapon: weapons,
            unique_kill: uniqueKills,
        },
    },
    bangkok: {
        disguises: bangkokDisguises,
        conditions: {
            melee: bangkokMelees,
            weapon: weapons,
            unique_kill: uniqueKills,
        },
    },
    colorado: {
        disguises: coloradoDisguises,
        conditions: {
            melee: coloradoMelees,
            weapon: weapons,
            unique_kill: uniqueKills,
        },
    },
    hokkaido: {
        disguises: hokkaidoDisguises,
        conditions: {
            melee: hokkaidoMelees,
            weapon: weapons,
            unique_kill: uniqueKills,
        },
    },
    miami: {
        disguises: miamiDisguises,
        conditions: {
            melee: miamiMelees,
            weapon: weapons,
            unique_kill: uniqueKills,
        },
    },
    santa_fortuna: {
        disguises: santaFortunaDisguises,
        conditions: {
            melee: santaFortunaMelees,
            weapon: weapons,
            unique_kill: uniqueKills,
        },
    },
    mumbai: {
        disguises: mumbaiDisguises,
        conditions: {
            melee: mumbaiMelees,
            weapon: weapons,
            unique_kill: uniqueKills,
        },
    },
    whittleton_creek: {
        disguises: whittletonCreekDisguises,
        conditions: {
            melee: whittletonCreekMelees,
            weapon: weapons,
            unique_kill: uniqueKills,
        },
    },
    ambrose_island: {
        disguises: ambroseIslandDisguises,
        conditions: {
            melee: ambroseIslandMelees,
            weapon: weapons,
            unique_kill: uniqueKills,
        },
    },
    isle_of_sgail: {
        disguises: isleOfSgailDisguises,
        conditions: {
            melee: isleOfSgailMelees,
            weapon: weapons,
            unique_kill: uniqueKills,
        },
    },
    new_york: {
        disguises: newYorkDisguises,
        conditions: {
            melee: newYorkMelees,
            weapon: weapons,
            unique_kill: uniqueKills,
        },
    },
    haven_island: {
        disguises: havenIslandDisguises,
        conditions: {
            melee: havenIslandMelees,
            weapon: weapons,
            unique_kill: uniqueKills,
        },
    },
    dubai: {
        disguises: dubaiDisguises,
        conditions: {
            melee: dubaiMelees,
            weapon: weapons,
            unique_kill: uniqueKills,
        },
    },
    dartmoor: {
        disguises: dartmoorDisguises,
        conditions: {
            melee: dartmoorMelees,
            weapon: weapons,
            unique_kill: uniqueKills,
        },
    },
    berlin: {
        disguises: berlinDisguises,
        conditions: {
            melee: berlinMelees,
            weapon: weapons,
            unique_kill: uniqueKills,
        },
    },
    chongqing: {
        disguises: chongqingDisguises,
        conditions: {
            melee: chongqingMelees,
            weapon: weapons,
            unique_kill: uniqueKills,
        },
    },
    mendoza: {
        disguises: mendozaDisguises,
        conditions: {
            melee: mendozaMelees,
            weapon: weapons,
            unique_kill: uniqueKills,
        },
    },
};

export const TargetUniqueKillsList: TargetUniqueKills = {
    viktor_novikov: [],
    dalia_margolis: [],
    silvio_caruso: ["shoot_silvio_through_the_telescope"],
    francesca_de_santis: [],
    claus_strandberg: [],
    reza_zaydan: [],
    jordan_cross: [],
    ken_morgan: [],
    sean_rose: ["explosive_watch_battery"],
    ezra_berg: [],
    penelope_graves: [],
    maya_parvati: [],
    erich_soders: [
        "throw_the_heart_in_the_trash",
        "shoot_the_heart",
        "electrocution",
        "explosion",
        "poison_stem_cells",
        "robot_arms",
    ],
    yuki_yamazaki: [],
    sierra_knox: ["shoot_the_car"],
    robert_knox: [],
    rico_delgado: [],
    jorge_franco: [],
    andrea_martinez: [],
    dawood_rangan: [],
    vanya_shah: [],
    wazir_kale: [],
    janus: [],
    nolan_cassidy: [],
    noel_crest: [],
    sinhi_akka: [],
    zoe_washington: [],
    sophia_washington: [],
    athena_savalas: ["athena_savalas_award"],
    tyson_williams: [],
    ljudmila_vetrova: [],
    steven_bradley: ["explosive_on_water_scooter"],
    carl_ingram: [],
    marcus_stuyvesant: [],
    alexa_carlisle: [],
    "ica_agent_#1": [],
    "ica_agent_#2": [],
    "ica_agent_#3": [],
    "ica_agent_#4": [],
    "ica_agent_#5": [],
    hush: [],
    imogen_royce: [],
    don_yates: [],
    tamara_vidal: [],
};

export const SeasonOneMissions: Mission[] = [
    "paris",
    "sapienza",
    "marrakesh",
    "bangkok",
    "colorado",
    "hokkaido",
];

export const SeasonTwoMissions: Mission[] = [
    "miami",
    "santa_fortuna",
    "mumbai",
    "whittleton_creek",
    "ambrose_island",
    "isle_of_sgail",
    "new_york",
    "haven_island",
];

export const SeasonThreeMissions: Mission[] = [
    "dubai",
    "dartmoor",
    "berlin",
    "chongqing",
    "mendoza",
];

export const MissionPoolOptionsList: MissionPoolOptions = {
    paris: true,
    sapienza: true,
    marrakesh: true,
    bangkok: true,
    colorado: true,
    hokkaido: true,
    miami: true,
    santa_fortuna: true,
    mumbai: true,
    whittleton_creek: true,
    ambrose_island: true,
    isle_of_sgail: true,
    new_york: true,
    haven_island: true,
    dubai: true,
    dartmoor: true,
    berlin: true,
    chongqing: true,
    mendoza: true,
};

export const SeasonPoolSelectedList: SeasonPoolSelected = {
    season_1: true,
    season_2: true,
    season_3: true,
};

export const KillMethodOptions = [
    "pistol",
    "loud_pistol",
    "silenced_pistol",
    "sniper_rifle",
    "loud_sniper_rifle",
    "silenced_sniper_rifle",
    "assault_rifle",
    "loud_assault_rifle",
    "silenced_assault_rifle",
    "smg",
    "loud_smg",
    "silenced_smg",
    "shotgun",
    "loud_shotgun",
    "silenced_shotgun",
    "remote_explosive",
    "loud_remote_explosive",
    "impact_explosive",
    "drowning",
    "falling_object",
    "fall",
    "fire",
    "electrocution",
    "explosion_accident",
    "consumed_poison",
    "injected_poison",
    "shoot_silvio_through_the_telescope",
    "explosive_watch_battery",
    "throw_the_heart_in_the_trash",
    "shoot_the_heart",
    "electrocution",
    "explosion",
    "poison_stem_cells",
    "robot_arms",
    "shoot_the_car",
    "athena_savalas_award",
    "explosive_on_water_scooter",
    "amputation_knife",
    "antique_carved_knife",
    "barber_razor",
    "battle_axe",
    "beak_staff",
    "broadsword",
    "burial_dagger",
    "circumcision_knife",
    "cleaver",
    "combat_knife",
    "concealable_knife",
    "fiber_wire",
    "fire_axe",
    "folding_knife",
    "garden_fork",
    "grape_knife",
    "hatchet",
    "hobby_knife",
    "hook",
    "icicle",
    "jarls_pirate_saber",
    "katana",
    "kitchen_knife",
    "kukri_machete",
    "letter_opener",
    "machete",
    "meat_fork",
    "neck_snap",
    "old_axe",
    "ornate_scimitar",
    "saber",
    "sappers_axe",
    "scalpel",
    "scissors",
    "scrap_sword",
    "screwdriver",
    "seashell",
    "shears",
    "starfish",
    "tanto",
    "unicorn_horn",
    "viking_axe",
];

export const MissionDisguisesList: MissionDisguises = {
    paris: parisDisguises,
    sapienza: sapienzaDisguises,
    marrakesh: marrakeshDisguises,
    bangkok: bangkokDisguises,
    colorado: coloradoDisguises,
    hokkaido: hokkaidoDisguises,
    miami: miamiDisguises,
    santa_fortuna: santaFortunaDisguises,
    mumbai: mumbaiDisguises,
    whittleton_creek: whittletonCreekDisguises,
    ambrose_island: ambroseIslandDisguises,
    isle_of_sgail: isleOfSgailDisguises,
    new_york: newYorkDisguises,
    haven_island: havenIslandDisguises,
    dubai: dubaiDisguises,
    dartmoor: dartmoorDisguises,
    berlin: berlinDisguises,
    chongqing: chongqingDisguises,
    mendoza: mendozaDisguises,
};

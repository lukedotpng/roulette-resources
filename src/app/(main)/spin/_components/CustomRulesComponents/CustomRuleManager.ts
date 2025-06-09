import { Ruleset } from "./CustomRuleTypes";
import { MELEES } from "../../utils/SpinGlobals";

export const RouletteRivalsRuleset: Ruleset = {
    targets: {
        viktor_novikov: {
            bannedKills: ["fire"],
        },
        dalia_margolis: {
            bannedKills: ["fire"],
        },
        silvio_caruso: {
            bannedKills: ["fire", "consumed_poison"],
            customKills: {
                unique_kills: ["shoot_silvio_through_the_telescope"],
            },
        },
        francesca_de_santis: {
            bannedKills: ["fire"],
        },
        claus_strandberg: {
            bannedKills: ["falling_object"],
            remoteForcedDisguises: ["prisoner"],
        },
        reza_zaydan: {
            bannedKills: ["drowning", "electrocution"],
        },
        jordan_cross: {
            bannedKills: ["fire"],
            remoteForcedDisguises: ["stalker"],
        },
        ken_morgan: {
            bannedKills: ["fire"],
            remoteForcedDisguises: ["stalker"],
        },
        sean_rose: {
            bannedKills: ["consumed_poison", "drowning"],
            customKills: {
                unique_kills: ["explosive_watch_battery"],
            },
        },
        ezra_berg: {
            bannedKills: ["electrocution", "consumed_poison", "drowning"],
        },
        penelope_graves: {
            bannedKills: ["drowning", "fire"],
            ntkoBannedKills: [
                "loud_pistol",
                "loud_assault_rifle",
                "loud_smg",
                "loud_sniper_rifle",
                "loud_shotgun",
            ],
        },
        maya_parvati: {
            bannedKills: ["drowning"],
        },
        erich_soders: {
            bannedKills: [
                "fire_axe",
                "scalpel",
                "screwdriver",
                "kitchen_knife",
                "cleaver",
                "katana",
                "scissors",
                "fiber_wire",
                "neck_snap",
                "punch_then_snap_neck",
                "remote_explosive",
                "loud_explosive",
                "impact_explosive",
            ],
        },
        yuki_yamazaki: {
            bannedKills: ["fire"],
        },
        sierra_knox: {
            bannedKillsWithDisguise: [
                {
                    kills: ["shoot_the_car"],
                    disguise: "moses_lee",
                },
            ],
            customKills: { unique_kills: ["shoot_the_car"] },
        },
        robert_knox: {
            bannedKills: ["fire"],
        },
        rico_delgado: {
            bannedKills: ["consumed_poison", "sacrificial_knife"],
        },
        jorge_franco: {
            bannedKills: ["falling_object", "sacrificial_knife"],
        },
        andrea_martinez: {
            bannedKills: ["fire", "sacrificial_knife"],
        },
        dawood_rangan: {
            bannedKills: ["fire", "drowning", "consumed_poison"],
            ntkoBannedKills: [
                "loud_pistol",
                "loud_assault_rifle",
                "loud_smg",
                "loud_sniper_rifle",
                "loud_shotgun",
            ],
        },
        vanya_shah: {
            bannedKills: ["drowning", "consumed_poison"],
        },
        wazir_kale: {
            bannedKills: ["fire", "drowning"],
        },
        janus: {
            bannedKills: ["falling_object", "fire"],
        },
        nolan_cassidy: {
            bannedKills: ["falling_object", "fire"],
        },
        noel_crest: {},
        sinhi_akka: {},
        zoe_washington: {
            bannedKills: ["consumed_poison", "sacrificial_knife"],
            remoteForcedDisguises: ["knights_armor"],
        },
        sophia_washington: {
            bannedKills: ["consumed_poison", "fire", "sacrificial_knife"],
            remoteForcedDisguises: ["knights_armor"],
        },
        athena_savalas: {
            bannedKills: ["fire"],
            customKills: { unique_kills: ["athena_savalas_award"] },
        },
        tyson_williams: {
            bannedKills: ["fire", "consumed_poison"],
        },
        ljudmila_vetrova: {
            bannedKills: ["fire", "falling_object"],
        },
        steven_bradley: {
            bannedKills: ["fire", "consumed_poison"],
            customKills: { unique_kills: ["explosive_on_water_scooter"] },
        },
        carl_ingram: {
            bannedKills: ["fire", "consumed_poison"],
        },
        marcus_stuyvesant: {
            bannedKills: ["consumed_poison", "fire"],
            bannedKillsWithDisguise: [
                {
                    kills: ["drowning"],
                    disguise: "skydiving_suit",
                },
            ],
        },
        alexa_carlisle: {
            bannedKills: ["fire"],
        },
        "ica_agent_#1": {},
        "ica_agent_#2": {},
        "ica_agent_#3": {},
        "ica_agent_#4": {},
        "ica_agent_#5": {},
        hush: {
            bannedKills: ["fire", "consumed_poison"],
        },
        imogen_royce: {
            bannedKills: ["fire", "consumed_poison", "falling_object"],
        },
        don_yates: {
            bannedKills: ["consumed_poison", "fire"],
        },
        tamara_vidal: {
            bannedKills: ["consumed_poison", "falling_object", "fire"],
        },
    },
    conditions: {
        global: {
            killMethodsCantRepeat: true,
            disguisesCantRepeat: true,
            conditionCombosGroupsCantRepeat: [
                {
                    combos: [
                        {
                            disguises: [],
                            killMethods: [
                                "sniper_rifle",
                                "silenced_sniper_rifle",
                                "loud_sniper_rifle",
                                "assault_rifle",
                                "silenced_assault_rifle",
                                "loud_assault_rifle",
                                "shotgun",
                                "silenced_shotgun",
                                "loud_shotgun",
                            ],
                        },
                    ],
                },
            ],
        },
        missions: {
            paris: {
                conditionCombosGroupsCantRepeat: [],
            },
            sapienza: {
                conditionCombosGroupsCantRepeat: [],
            },
            marrakesh: {
                conditionCombosGroupsCantRepeat: [],
            },
            bangkok: {
                conditionCombosGroupsCantRepeat: [],
            },
            colorado: {
                conditionCombosGroupsCantRepeat: [],
            },
            hokkaido: {
                conditionCombosGroupsCantRepeat: [
                    {
                        combos: [
                            {
                                disguises: [],
                                killMethods: [
                                    "remote_explosive",
                                    "loud_explosive",
                                    "impact_explosive",
                                    "explosion_accident",
                                    "explosion",
                                ],
                            },
                        ],
                    },
                ],
            },
            miami: {
                conditionCombosGroupsCantRepeat: [],
            },
            santa_fortuna: {
                conditionCombosGroupsCantRepeat: [],
            },
            mumbai: {
                conditionCombosGroupsCantRepeat: [],
            },
            whittleton_creek: {
                conditionCombosGroupsCantRepeat: [],
            },
            ambrose_island: {
                conditionCombosGroupsCantRepeat: [],
            },
            isle_of_sgail: {
                conditionCombosGroupsCantRepeat: [],
            },
            new_york: {
                conditionCombosGroupsCantRepeat: [],
            },
            haven_island: {
                conditionCombosGroupsCantRepeat: [],
            },
            dubai: {
                conditionCombosGroupsCantRepeat: [],
            },
            dartmoor: {
                conditionCombosGroupsCantRepeat: [],
            },
            berlin: {
                conditionCombosGroupsCantRepeat: [],
            },
            chongqing: {
                conditionCombosGroupsCantRepeat: [],
            },
            mendoza: {
                conditionCombosGroupsCantRepeat: [],
            },
        },
    },
    customKills: {},
    odds: {
        NTKO: 0.25,
    },
    ntkoValidKills: [
        ...MELEES,
        "pistol",
        "silenced_pistol",
        "loud_pistol",
        "sniper_rifle",
        "silenced_sniper_rifle",
        "loud_sniper_rifle",
        "assault_rifle",
        "silenced_assault_rifle",
        "loud_assault_rifle",
        "smg",
        "silenced_smg",
        "loud_smg",
        "shotgun",
        "silenced_shotgun",
        "loud_shotgun",
    ],
    remoteKillMethods: [
        "explosion_accident",
        "consumed_poison",
        "fire",
        "electrocution",
        "remote_explosive",
    ],
};

export const ImprovRuleset: Ruleset = {
    targets: {
        viktor_novikov: {
            bannedKills: [
                "fire",
                "fiber_wire",
                "electrocution",
                "injected_poison",
                "impact_explosive",
                "sniper_rifle",
                "loud_sniper_rifle",
                "silenced_pistol",
                "silenced_smg",
                "silenced_assault_rifle",
                "silenced_shotgun",
                "silenced_sniper_rifle",
            ],
        },
        dalia_margolis: {
            bannedKills: [
                "fire",
                "fiber_wire",
                "electrocution",
                "injected_poison",
                "impact_explosive",
                "sniper_rifle",
                "loud_sniper_rifle",
                "silenced_pistol",
                "silenced_smg",
                "silenced_assault_rifle",
                "silenced_shotgun",
                "silenced_sniper_rifle",
                "consumed_poison",
            ],
        },
        silvio_caruso: {
            bannedKills: ["fire", "consumed_poison"],
            customKills: {
                unique_kills: ["shoot_silvio_through_the_telescope"],
            },
        },
        francesca_de_santis: {
            bannedKills: ["fire"],
        },
        claus_strandberg: {
            bannedKills: ["falling_object"],
            remoteForcedDisguises: ["prisoner"],
        },
        reza_zaydan: {
            bannedKills: ["drowning", "electrocution"],
        },
        jordan_cross: {
            bannedKills: ["fire"],
            remoteForcedDisguises: ["stalker"],
        },
        ken_morgan: {
            bannedKills: ["fire"],
            remoteForcedDisguises: ["stalker"],
        },
        sean_rose: {
            bannedKills: ["consumed_poison", "drowning"],
            customKills: {
                unique_kills: ["explosive_watch_battery"],
            },
        },
        ezra_berg: {
            bannedKills: ["electrocution", "consumed_poison", "drowning"],
        },
        penelope_graves: {
            bannedKills: ["drowning", "fire"],
            ntkoBannedKills: [
                "loud_pistol",
                "loud_assault_rifle",
                "loud_smg",
                "loud_sniper_rifle",
                "loud_shotgun",
            ],
        },
        maya_parvati: {
            bannedKills: ["drowning"],
        },
        erich_soders: {
            bannedKills: [
                "fire_axe",
                "scalpel",
                "screwdriver",
                "kitchen_knife",
                "cleaver",
                "katana",
                "scissors",
                "fiber_wire",
                "neck_snap",
                "punch_then_snap_neck",
                "remote_explosive",
                "loud_explosive",
                "impact_explosive",
            ],
        },
        yuki_yamazaki: {
            bannedKills: ["fire"],
        },
        sierra_knox: {
            bannedKillsWithDisguise: [
                {
                    kills: ["shoot_the_car"],
                    disguise: "moses_lee",
                },
            ],
            customKills: { unique_kills: ["shoot_the_car"] },
        },
        robert_knox: {
            bannedKills: ["fire"],
        },
        rico_delgado: {
            bannedKills: ["consumed_poison", "sacrificial_knife"],
        },
        jorge_franco: {
            bannedKills: ["falling_object", "sacrificial_knife"],
        },
        andrea_martinez: {
            bannedKills: ["fire", "sacrificial_knife"],
        },
        dawood_rangan: {
            bannedKills: ["fire", "drowning", "consumed_poison"],
            ntkoBannedKills: [
                "loud_pistol",
                "loud_assault_rifle",
                "loud_smg",
                "loud_sniper_rifle",
                "loud_shotgun",
            ],
        },
        vanya_shah: {
            bannedKills: ["drowning", "consumed_poison"],
        },
        wazir_kale: {
            bannedKills: ["fire", "drowning"],
        },
        janus: {
            bannedKills: ["falling_object", "fire"],
        },
        nolan_cassidy: {
            bannedKills: ["falling_object", "fire"],
        },
        noel_crest: {},
        sinhi_akka: {},
        zoe_washington: {
            bannedKills: ["consumed_poison", "sacrificial_knife"],
            remoteForcedDisguises: ["knights_armor"],
        },
        sophia_washington: {
            bannedKills: ["consumed_poison", "fire", "sacrificial_knife"],
            remoteForcedDisguises: ["knights_armor"],
        },
        athena_savalas: {
            bannedKills: ["fire"],
            customKills: { unique_kills: ["athena_savalas_award"] },
        },
        tyson_williams: {
            bannedKills: ["fire", "consumed_poison"],
        },
        ljudmila_vetrova: {
            bannedKills: ["fire", "falling_object"],
        },
        steven_bradley: {
            bannedKills: ["fire", "consumed_poison"],
            customKills: { unique_kills: ["explosive_on_water_scooter"] },
        },
        carl_ingram: {
            bannedKills: ["fire", "consumed_poison"],
        },
        marcus_stuyvesant: {
            bannedKills: ["consumed_poison", "fire"],
            bannedKillsWithDisguise: [
                {
                    kills: ["drowning"],
                    disguise: "skydiving_suit",
                },
            ],
        },
        alexa_carlisle: {
            bannedKills: ["fire"],
        },
        "ica_agent_#1": {},
        "ica_agent_#2": {},
        "ica_agent_#3": {},
        "ica_agent_#4": {},
        "ica_agent_#5": {},
        hush: {
            bannedKills: ["fire", "consumed_poison"],
        },
        imogen_royce: {
            bannedKills: ["fire", "consumed_poison", "falling_object"],
        },
        don_yates: {
            bannedKills: ["consumed_poison", "fire"],
        },
        tamara_vidal: {
            bannedKills: ["consumed_poison", "falling_object", "fire"],
        },
    },
    conditions: {
        global: {
            killMethodsCantRepeat: true,
            disguisesCantRepeat: true,
            conditionCombosGroupsCantRepeat: [
                {
                    combos: [
                        {
                            disguises: [],
                            killMethods: [
                                "sniper_rifle",
                                "silenced_sniper_rifle",
                                "loud_sniper_rifle",
                                "assault_rifle",
                                "silenced_assault_rifle",
                                "loud_assault_rifle",
                                "shotgun",
                                "silenced_shotgun",
                                "loud_shotgun",
                            ],
                        },
                    ],
                },
            ],
        },
        missions: {
            paris: {
                conditionCombosGroupsCantRepeat: [
                    {
                        combos: [
                            {
                                disguises: [],
                                killMethods: [
                                    "loud_pistol",
                                    "pistol",
                                    "loud_smg",
                                    "smg",
                                    "loud_sniper_rifle",
                                    "sniper_rifle",
                                    "loud_assault_rifle",
                                    "assault_rifle",
                                    "loud_shotgun",
                                    "shotgun",
                                    "drowning",
                                    "falling_object",
                                    "fall",
                                    "fire",
                                    "electrocution",
                                    "explosion_accident",
                                    "consumed_poison",
                                    "injected_poison",
                                ],
                            },
                            {
                                disguises: [
                                    "suit",
                                    "auction_staff",
                                    "chef",
                                    "helmut_kruger",
                                    "palace_staff",
                                    "sheikh",
                                    "stylist",
                                    "tech_crew",
                                    "vampire_magician",
                                ],
                                killMethods: [
                                    "fire_axe",
                                    "hatchet",
                                    "battle_axe",
                                    "saber",
                                ],
                            },
                        ],
                    },
                ],
            },
            sapienza: {
                conditionCombosGroupsCantRepeat: [],
            },
            marrakesh: {
                conditionCombosGroupsCantRepeat: [],
            },
            bangkok: {
                conditionCombosGroupsCantRepeat: [],
            },
            colorado: {
                conditionCombosGroupsCantRepeat: [],
            },
            hokkaido: {
                conditionCombosGroupsCantRepeat: [
                    {
                        combos: [
                            {
                                disguises: [],
                                killMethods: [
                                    "remote_explosive",
                                    "loud_explosive",
                                    "impact_explosive",
                                    "explosion_accident",
                                    "explosion",
                                ],
                            },
                        ],
                    },
                ],
            },
            miami: {
                conditionCombosGroupsCantRepeat: [],
            },
            santa_fortuna: {
                conditionCombosGroupsCantRepeat: [],
            },
            mumbai: {
                conditionCombosGroupsCantRepeat: [],
            },
            whittleton_creek: {
                conditionCombosGroupsCantRepeat: [],
            },
            ambrose_island: {
                conditionCombosGroupsCantRepeat: [],
            },
            isle_of_sgail: {
                conditionCombosGroupsCantRepeat: [],
            },
            new_york: {
                conditionCombosGroupsCantRepeat: [],
            },
            haven_island: {
                conditionCombosGroupsCantRepeat: [],
            },
            dubai: {
                conditionCombosGroupsCantRepeat: [],
            },
            dartmoor: {
                conditionCombosGroupsCantRepeat: [],
            },
            berlin: {
                conditionCombosGroupsCantRepeat: [],
            },
            chongqing: {
                conditionCombosGroupsCantRepeat: [],
            },
            mendoza: {
                conditionCombosGroupsCantRepeat: [],
            },
        },
    },
    customKills: {},
    odds: {
        NTKO: 0.25,
    },
    ntkoValidKills: [
        ...MELEES,
        "pistol",
        "silenced_pistol",
        "loud_pistol",
        "sniper_rifle",
        "silenced_sniper_rifle",
        "loud_sniper_rifle",
        "assault_rifle",
        "silenced_assault_rifle",
        "loud_assault_rifle",
        "smg",
        "silenced_smg",
        "loud_smg",
        "shotgun",
        "silenced_shotgun",
        "loud_shotgun",
    ],
    remoteKillMethods: [
        "explosion_accident",
        "consumed_poison",
        "fire",
        "electrocution",
        "remote_explosive",
    ],
};

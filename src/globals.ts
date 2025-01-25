import { Mission, MissionTargets, Target, TargetImage } from "./types";

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

export const MissionTargetsList: MissionTargets = {
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
    "firearm",
    "poison_stem_cells",
    "robot_arms",
    "electrocution",
    "throw_heart_in_trash_can",
    "shoot_heart",
    "explosive",
];

export const TargetImageURLS: TargetImage = {
    viktor_novikov:
        "https://h67hwj4dua.ufs.sh/f/0hnOyldaAzQ630eLDz7hdbSDxNHntlIgf6PwVUqK7QyFeLmA",
    dalia_margolis:
        "https://h67hwj4dua.ufs.sh/f/0hnOyldaAzQ6VC7L2Ht1bVDomOF8NdpAjx5kIWKMa4XniJzS",
    silvio_caruso:
        "https://h67hwj4dua.ufs.sh/f/0hnOyldaAzQ6RDdxcAfPKFdux27c8WDb9CPLowQyYTXhiJns",
    francesca_de_santis:
        "https://h67hwj4dua.ufs.sh/f/0hnOyldaAzQ6b5t2xDO52Gai8pNnxBFjhDz0WQrT9Y1g7PtA",
    claus_strandberg:
        "https://h67hwj4dua.ufs.sh/f/0hnOyldaAzQ6Qma2HbfzDBF7K6tyARZN0vHEchOmpJ2qPCnb",
    reza_zaydan:
        "https://h67hwj4dua.ufs.sh/f/0hnOyldaAzQ6xdi8Ba21vLHrZickoFbsX4wSxC5hEtpuUVOA",
    jordan_cross:
        "https://h67hwj4dua.ufs.sh/f/0hnOyldaAzQ6b98Zh0O52Gai8pNnxBFjhDz0WQrT9Y1g7PtA",
    ken_morgan:
        "https://h67hwj4dua.ufs.sh/f/0hnOyldaAzQ6incPstFqTPk2L8fueJQZ9OBx74UlCS3MKbYA",
    sean_rose:
        "https://h67hwj4dua.ufs.sh/f/0hnOyldaAzQ6YGVK7EbSR97MV2L0831GwlFxe4ZNuXETzt5s",
    ezra_berg:
        "https://h67hwj4dua.ufs.sh/f/0hnOyldaAzQ6wqsEGrbjCNjvWDK73kuHOpbZQdmVLtqoFM0g",
    penelope_graves:
        "https://h67hwj4dua.ufs.sh/f/0hnOyldaAzQ676zrFkAEVlx4hGwyFUS7uq03e9o5aACQdKmW",
    maya_parvati:
        "https://h67hwj4dua.ufs.sh/f/0hnOyldaAzQ6hCC9McgoRFsgEcmWp5dCIJHwxQVAfBSGaT0l",
    erich_soders:
        "https://h67hwj4dua.ufs.sh/f/0hnOyldaAzQ6bI9DYJO52Gai8pNnxBFjhDz0WQrT9Y1g7PtA",
    yuki_yamazaki:
        "https://h67hwj4dua.ufs.sh/f/0hnOyldaAzQ61NzycAqQpXcGWNJHSyP3VmBKfDzRnAe27bl6",
    sierra_knox: "",
    robert_knox: "",
    rico_delgado: "",
    jorge_franco: "",
    andrea_martinez: "",
    dawood_rangan: "",
    vanya_shah: "",
    maelstrom: "",
    noel_crest: "",
    sinhi_venthan: "",
    janus: "",
    nolan_cassidy: "",
    zoe_washington: "",
    sophia_washington: "",
    athena_savalas: "",
    tyson_williams: "",
    ljudmila_vetrova: "",
    steven_bradley: "",
    carl_ingram: "",
    marcus_stuyvesant: "",
    alexa_carlisle: "",
    ica_agents: "",
    hush: "",
    imogen_royce: "",
    don_yates: "",
    tamara_vidal: "",
} as const;

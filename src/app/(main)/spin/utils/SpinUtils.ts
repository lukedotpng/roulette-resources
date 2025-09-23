import { Mission } from "@/types";
import { MISSIONS } from "@/utils/globals";
import { HitmapsSpin, Spin, SpinTarget } from "../types";

export function GetRandomMission(missionPool: Mission[]): Mission {
    if (!missionPool || missionPool.length === 0) {
        console.error("ERROR:", "Mission pool is empty");
        return MISSIONS[Math.floor(Math.random() * MISSIONS.length)];
    }

    const randomMission =
        missionPool[Math.floor(Math.random() * missionPool.length)];

    return randomMission;
}

export function GenerateRandomSeed(length?: number) {
    const charOptions =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const newQueueSeedLength = length ?? 20;
    let newQueueSeed = "";

    for (let i = 0; i < newQueueSeedLength; i++) {
        const randIndex = Math.floor(Math.random() * charOptions.length);
        newQueueSeed += charOptions[randIndex];
    }

    return newQueueSeed;
}

const HitmapsMissionDictionary = new Map<string, Mission>([
    ["the-showstopper", "paris"],
    ["world-of-tomorrow", "sapienza"],
    ["a-gilded-cage", "marrakesh"],
    ["club-27", "bangkok"],
    ["freedom-fighters", "colorado"],
    ["situs-inversus", "hokkaido"],
    ["finish-line", "miami"],
    ["three-headed-serpent", "santa_fortuna"],
    ["chasing-a-ghost", "mumbai"],
    ["another-life", "whittleton_creek"],
    ["shadows-in-the-water", "ambrose_island"],
    ["ark-society", "isle_of_sgail"],
    ["golden-handshake", "new_york"],
    ["the-last-resort", "haven_island"],
    ["on-top-of-the-world", "dubai"],
    ["death-in-the-family", "dartmoor"],
    ["apex-predator", "berlin"],
    ["end-of-an-era", "chongqing"],
    ["the-farewell", "mendoza"],
]);

const HitmapsTargetDictionary = new Map<string, SpinTarget>([
    ["Viktor Novikov", "viktor_novikov"],
    ["Dalia Margolis", "dalia_margolis"],
    ["Silvio Caruso", "silvio_caruso"],
    ["Francesca De Santis", "francesca_de_santis"],
    ["Reza Zaydan", "reza_zaydan"],
    ["Claus Hugo Strandberg", "claus_strandberg"],
    ["Jordan Cross", "jordan_cross"],
    ["Ken Morgan", "ken_morgan"],
    ["Sean Rose", "sean_rose"],
    ["Penelope Graves", "penelope_graves"],
    ["Ezra Berg", "ezra_berg"],
    ["Maya Parvati", "maya_parvati"],
    ["Erich Soders", "erich_soders"],
    ["Yuki Yamazaki", "yuki_yamazaki"],
    ["Sierra Knox", "sierra_knox"],
    ["Robert Knox", "robert_knox"],
    ["Rico Delgado", "rico_delgado"],
    ["Jorge Franco", "jorge_franco"],
    ["Andrea Martínez", "andrea_martinez"],
    ["Wazir Kale", "wazir_kale"],
    ["Vanya Shah", "vanya_shah"],
    ["Dawood Rangan", "dawood_rangan"],
    ["Janus", "janus"],
    ["Nolan Cassidy", "nolan_cassidy"],
    ["Noel Crest", "noel_crest"],
    ['Sinhi "Akka" Venthan', "sinhi_akka"],
    ["Zoe Washington", "zoe_washington"],
    ["Sophia Washington", "sophia_washington"],
    ["Athena Savalas", "athena_savalas"],
    ["Tyson Williams", "tyson_williams"],
    ["Steven Bradley", "steven_bradley"],
    ["Ljudmila Vetrova", "ljudmila_vetrova"],
    ["Carl Ingram", "carl_ingram"],
    ["Marcus Stuyvesant", "marcus_stuyvesant"],
    ["Alexa Carlisle", "alexa_carlisle"],
    ["ICA Agent #1", "ica_agent_#1"],
    ["ICA Agent #2", "ica_agent_#2"],
    ["ICA Agent #3", "ica_agent_#3"],
    ["ICA Agent #4", "ica_agent_#4"],
    ["ICA Agent #5", "ica_agent_#5"],
    ["Hush", "hush"],
    ["Imogen Royce", "imogen_royce"],
    ["Don Archibald Yates", "don_yates"],
    ["Tamara Vidal", "tamara_vidal"],
]);

function HitmapsKillMethodParse(killMethod: string, variant: string | null) {
    // Special kill method cases
    switch (killMethod) {
        // PARIS
        // SAPIENZA
        case "Destroy Silvio's Seaplane":
            return "destory_the_seaplane";
        // MARRAKESH
        // BANGKOK
        // COLORADO
        // HOKKAIDO
        case "Throw the Heart into the Trash Can":
            return "throw_the_heart_in_the_trash";
        case "Poison the Stem Cells":
            return "poison_stem_cells";
        // MIAMI
        // SANTA FORTUNA
        // MUMBAI
        // WHITTLETON CREEK
        case "Janus' Hammer & Sickle Sculpture":
            return "hammer_&_sickle_sculpture";
        // AMBROSE ISLAND
        // ISLE OF SGAIL
        // NEW YORK
        // HAVEN
        // DUBAI
        // DARTMOOR
        // BERLIN
        // CHONGQING
        // MENDOZA
    }

    let killMethodFormatted = killMethod.toLowerCase();
    killMethodFormatted = killMethodFormatted.replace(/[^0-9a-zA-Z ]+/g, "");
    killMethodFormatted = killMethodFormatted.replace(" ", "_");

    if (killMethodFormatted == "explosive_weapon") {
        killMethodFormatted = "explosive";
    }

    if (variant !== null) {
        killMethodFormatted = variant.toLowerCase() + "_" + killMethodFormatted;
    }

    return killMethodFormatted;
}

function HitmapsDisguiseParse(disguise: string) {
    // Special disguise cases
    switch (disguise) {
        // PARIS
        case "Tuxedo":
            return "suit";
        case "Sheikh Salman Al-Ghazali":
            return "sheikh";
        // SAPIENZA
        case "Italian Suit":
            return "suit";
        case "Dr. Oscar Lafayette":
            return "oscar_lafayette";
        case "Mansion Chef":
            return "chef";
        // MARRAKESH
        case "Summer Suit":
            return "suit";
        // BANGKOK
        case "Casual Suit":
            return "suit";
        // COLORADO
        case "Tactical Gear":
            return "suit";
        // HOKKAIDO
        case "VIP Patient":
            return "suit";
        case "VIP Patient (Amos Dexter)":
            return "amos_dexter";
        case "VIP Patient (Jason Portman)":
            return "jason_portman";
        // MIAMI
        case "Florida Fit":
            return "suit";
        case "Sheik":
            return "sheikh";
        // SANTA FORTUNA
        case "Casual Tourist":
            return "suit";
        case "Tattoo Artist (P-Power)":
            return "tattoo_artist";
        // MUMBAI
        case "Imperial Classic":
            return "suit";
        // WHITTLETON CREEK
        case "Suburban Suit":
            return "suit";
        case "Gunther Mueller":
            return "gunther";
        case 'Spencer "The Hammer" Green':
            return "spencer_green";
        // AMBROSE ISLAND
        case "Guerilla Wetsuit":
            return "suit";
        // ISLE OF SGAIL
        case "Tuxedo and Mask":
            return "suit";
        // NEW YORK
        case "The New Yorker":
            return "suit";
        // HAVEN
        case "The Tropical Islander":
            return "suit";
        case "Swimwear":
            return "suit";
        case "Life Guard":
            return "lifeguard";
        // DUBAI
        case "Ashen Suit":
            return "suit";
        case "The Assassin":
            return "assassin";
        // DARTMOOR
        case "Classic Cut Long Coat Suit":
            return "suit";
        // BERLIN
        case "Number Six":
            return "suit";
        case "Rolf Hirschmüller":
            return "rolf";
        // CHONGQING
        case "Neon City Suit":
            return "suit";
        case "The Board Member":
            return "board_member";
        // MENDOZA
        case "47's Signature Suit with Gloves":
            return "suit";
        case "Black & White Tuxedo":
            return "suit";
    }

    let disguiseFormatted = disguise.toLowerCase();
    disguiseFormatted = disguiseFormatted.replace(/[^0-9a-zA-Z ]+/, "");
    disguiseFormatted = disguiseFormatted.replace(" ", "_");

    return disguiseFormatted;
}

export function HitmapsSpinParse(spin: HitmapsSpin): Spin | null {
    const mission = HitmapsMissionDictionary.get(spin.mission.slug);
    if (mission === undefined) {
        return null;
    }

    const parsedSpin: Spin = { mission: mission, info: {} };

    for (const targetCondition of spin.targetConditions) {
        const target = HitmapsTargetDictionary.get(targetCondition.target.name);
        if (target === undefined) {
            return null;
        }

        const parsedKillMethod = HitmapsKillMethodParse(
            targetCondition.killMethod.name,
            targetCondition.killMethod.selectedVariant,
        );
        const parsedDisguise = HitmapsDisguiseParse(
            targetCondition.disguise.name,
        );

        const isNoTargetPacification =
            targetCondition.complications.length > 0 &&
            targetCondition.complications[0].name === "No Target Pacification";

        parsedSpin.info[target] = {
            killMethod: parsedKillMethod,
            disguise: parsedDisguise,
            ntko: isNoTargetPacification,
        };
    }

    return parsedSpin;
}

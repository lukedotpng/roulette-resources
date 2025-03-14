import { Mission, SpinTarget } from "@/types";

export function MissionIDToDisplayText(mission: string) {
    let missionDisplayText = "";
    const words = mission.split("_");

    for (const word of words) {
        let parsedWord = word.charAt(0).toUpperCase() + word.slice(1) + " ";
        if (parsedWord == "Of ") {
            parsedWord = parsedWord.toLowerCase();
        }
        missionDisplayText += parsedWord;
    }

    return missionDisplayText;
}

export function MissionIDToShortDisplayText(mission: string) {
    switch (mission) {
        case "paris":
            return "PAR";
        case "sapienza":
            return "SAP";
        case "marrakesh":
            return "MAR";
        case "bangkok":
            return "BKK";
        case "colorado":
            return "COL";
        case "hokkaido":
            return "HOK";
        case "miami":
            return "MIA";
        case "santa_fortuna":
            return "SFA";
        case "mumbai":
            return "MUM";
        case "whittleton_creek":
            return "WCK";
        case "ambrose_island":
            return "AMB";
        case "isle_of_sgail":
            return "SGA";
        case "new_york":
            return "NYC";
        case "haven_island":
            return "HAV";
        case "dubai":
            return "DUB";
        case "dartmoor":
            return "DAR";
        case "berlin":
            return "BER";
        case "chongqing":
            return "CHO";
        case "mendoza":
            return "MEN";
    }
}

export function MethodIDToDisplayText(item: string | undefined) {
    if (!item) {
        return "Err No Condition";
    }
    let itemDisplayText = "";
    // disguise ID example: paris-palace_staff
    const words = item.split("_"); // ["palace", "staff"]

    for (let word of words) {
        if (word.toLowerCase() === "smg") {
            word = "SMG";
        }
        itemDisplayText += word.charAt(0).toUpperCase() + word.slice(1) + " ";
    }

    return itemDisplayText.trim();
}

export function DisguiseIDToDisplayText(disguise: string | undefined) {
    if (!disguise) {
        return "Err No Disguise";
    }
    let disguiseDisplayText = "";
    const disguiseSplitFromMap = disguise.split("-")[1]; // palace_staff
    let words: string[] = [];
    if (!disguiseSplitFromMap) {
        words = disguise.split("_"); // ["palace", "staff"]
    } else {
        words = disguiseSplitFromMap.split("_");
    }

    for (const word of words) {
        if (word.toLowerCase() === "dj") {
            disguiseDisplayText += "DJ";
        } else {
            disguiseDisplayText +=
                word.charAt(0).toUpperCase() + word.slice(1) + " ";
        }
    }

    return disguiseDisplayText.trim();
}

export function TargetIDToDisplayText(target: string) {
    let targetDisplayText = "";
    const words = target.split("_");

    for (let word of words) {
        if (word.toLowerCase() === "ica") {
            word = "ICA";
        }
        targetDisplayText += word.charAt(0).toUpperCase() + word.slice(1) + " ";
    }
    targetDisplayText = targetDisplayText.trim();

    return targetDisplayText;
}

// IMAGE PATH FORMATTING

export function TargetImagePathFormatter(target: string) {
    if (target.startsWith("ica_agent")) {
        target = "ica_agent";
    }
    return "/targets/" + target + ".webp";
}

export function MethodImagePathFormatter(
    method: string | undefined,
    target: SpinTarget,
) {
    if (!method) {
        return "";
    }

    if (target === "erich_soders" && method === "electrocution") {
        return "/killmethods/" + "soders_electrocution" + ".webp";
    }

    if (method.startsWith("loud_")) {
        method = method.split("loud_")[1];
    } else if (method.startsWith("silenced_")) {
        method = method.split("silenced_")[1];
    }

    return "/killmethods/" + method + ".webp";
}

export function DisguiseImagePathFormatter(disguise: string, mission: Mission) {
    return "/disguises/" + mission + "-" + disguise + ".webp";
}

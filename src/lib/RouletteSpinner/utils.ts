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
        if (
            word.toLowerCase() === "dj" ||
            word.toLowerCase() === "bbq" ||
            word.toLowerCase() === "cicada"
        ) {
            disguiseDisplayText += word.toUpperCase() + " ";
        } else {
            disguiseDisplayText +=
                word.charAt(0).toUpperCase() + word.slice(1) + " ";
        }
    }

    return disguiseDisplayText.trim();
}

export function MethodIDToDisplayText(item: string | undefined) {
    if (item === undefined) {
        return "Err No Condition";
    }
    let itemDisplayText = "";
    // disguise ID example: paris-palace_staff
    const words = item.split("_"); // ["palace", "staff"]

    for (let word of words) {
        if (word.toLowerCase() === "smg" || word.toLowerCase() === "iv") {
            word = word.toUpperCase();
        }
        itemDisplayText += word.charAt(0).toUpperCase() + word.slice(1) + " ";
    }

    return itemDisplayText.trim();
}

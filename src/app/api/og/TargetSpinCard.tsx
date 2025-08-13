import { Spin, SpinTarget } from "@/app/(main)/spin/types";
import { Mission } from "@/types";

export default function TargetSpinCard({
    spin,
    target,
}: {
    spin: Spin;
    target: SpinTarget;
}) {
    const spinInfo = spin.info;
    const mission = spin.mission;

    const cardHeight = 154 + (spinInfo[target]?.ntko ? 40 : 0);

    return (
        <div
            style={{
                display: "flex",
                fontSize: "18px",
                width: "100%",
                height: cardHeight + "px",
                flexDirection: "column",
                border: "2px solid white",
                color: "white",
            }}
        >
            <div style={{ display: "flex", width: "100%", height: "150px" }}>
                <div
                    style={{
                        position: "relative",
                        display: "flex",
                        width: "200px",
                        borderRight: "1px solid white",
                    }}
                >
                    <img
                        src={TargetImagePathFormatter(target)}
                        alt={target}
                        width={693}
                        height={517}
                        style={{
                            height: "100%",
                            width: "200px",
                            objectFit: "cover",
                            objectPosition: "center",
                        }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            bottom: 0,
                            display: "flex",
                            justifyContent: "center",
                            width: "100%",
                            textAlign: "center",
                            fontWeight: "bold",
                            backgroundColor: "#18181bd9",
                        }}
                    >
                        <div>{TargetIDToDisplayText(target)}</div>
                    </div>
                </div>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        flex: 1,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "space-between",
                            backgroundColor: "#18181b",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                paddingLeft: "5px",
                            }}
                        >
                            <div
                                style={{
                                    fontSize: ".75em",
                                    fontWeight: "bold",
                                    textDecoration: "underline",
                                    textDecorationColor: "#fb2c36",
                                    textDecorationThickness: "1px",
                                }}
                            >
                                Method
                            </div>
                            <div
                                style={{
                                    fontSize: "1.1em",
                                    fontWeight: "bold",
                                }}
                            >
                                {ItemIDToDisplayText(
                                    spinInfo[target]?.killMethod,
                                )}
                            </div>
                        </div>

                        <img
                            src={MethodImagePathFormatter(
                                spinInfo[target]?.killMethod,
                                target,
                            )}
                            width={48}
                            height={48}
                            alt={spinInfo[target]?.killMethod ?? "No Condition"}
                            style={{
                                height: "100%",
                                width: "100px",
                                objectFit: "cover",
                                borderLeft: "1px solid white",
                            }}
                        />
                    </div>
                    <div
                        style={{
                            display: "flex",
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "space-between",
                            borderTop: "1px solid white",
                            backgroundColor: "#18181b",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                paddingLeft: "5px",
                            }}
                        >
                            <div
                                style={{
                                    fontSize: ".75em",
                                    fontWeight: "bold",
                                    textDecoration: "underline",
                                    textDecorationColor: "#fb2c36",
                                    textDecorationThickness: "1px",
                                }}
                            >
                                Disguise
                            </div>
                            <div
                                style={{
                                    fontSize: "1.1em",
                                    fontWeight: "bold",
                                }}
                            >
                                {DisguiseIDToDisplayText(
                                    spinInfo[target]?.disguise,
                                )}
                            </div>
                        </div>

                        <img
                            src={DisguiseImagePathFormatter(
                                spinInfo[target]?.disguise,
                                mission,
                            )}
                            width={48}
                            height={48}
                            alt={spinInfo[target]?.disguise ?? "No Disguise"}
                            style={{
                                height: "100%",
                                width: "100px",
                                objectFit: "cover",
                                borderLeft: "1px solid white",
                            }}
                        />
                    </div>
                </div>
            </div>
            {spinInfo[target]?.ntko && (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        height: "40px",
                        borderTop: "1px solid white",
                        backgroundColor: "#fb2c36",
                        fontWeight: "bold",
                    }}
                >
                    <div>No Target Pacification</div>
                </div>
            )}
        </div>
    );
}

function ItemIDToDisplayText(item: string | undefined) {
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

function DisguiseIDToDisplayText(disguise: string | undefined) {
    if (!disguise) {
        return "Err No Disguise";
    }
    let disguiseDisplayText = "";
    const words = disguise.split("_"); // ["palace", "staff"]

    for (const word of words) {
        disguiseDisplayText +=
            word.charAt(0).toUpperCase() + word.slice(1) + " ";
    }

    return disguiseDisplayText.trim();
}

function TargetIDToDisplayText(target: string) {
    let targetDisplayText = "";
    const words = target.split("_");

    for (let word of words) {
        if (word.toLowerCase() === "ica") {
            word = "ICA";
        }
        targetDisplayText += word.charAt(0).toUpperCase() + word.slice(1) + " ";
    }

    return targetDisplayText;
}

function TargetImagePathFormatter(target: string) {
    if (target.startsWith("ica_agent")) {
        target = "ica_agent";
    }
    return (
        "https://roulette.luke.town/_next/image?url=%2Ftargets%2F" +
        target +
        ".webp&w=750&q=75"
    );
}

function MethodImagePathFormatter(
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

    return (
        "https://roulette.luke.town/_next/image?url=%2Fkillmethods%2F" +
        method +
        ".webp&w=750&q=75"
    );
}

function DisguiseImagePathFormatter(
    disguise: string | undefined,
    mission: Mission,
) {
    return (
        "https://roulette.luke.town/_next/image?url=%2Fdisguises%2F" +
        mission +
        "-" +
        disguise +
        ".webp&w=750&q=75"
    );
}

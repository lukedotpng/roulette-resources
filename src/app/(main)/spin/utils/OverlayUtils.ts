import { OverlayUpdateRequest } from "../types";

export async function UpdateOverlay(
    requestBody: OverlayUpdateRequest,
): Promise<Response> {
    console.log("requestBody:", requestBody);

    const res = await fetch(
        "https://rouletteoverlay.luke.town/" + requestBody.id + "/update",
        {
            mode: "no-cors",
            method: "POST",
            body: JSON.stringify(requestBody),
        },
    );

    return res;
}

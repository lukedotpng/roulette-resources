import { OverlayUpdateRequest } from "../types";

export async function UpdateOverlay(
    requestBody: OverlayUpdateRequest,
): Promise<Response> {
    const overlayUpdateBody: Omit<OverlayUpdateRequest, "id"> = requestBody;

    console.log("requestBody:", requestBody);
    console.log("overlayUpdateBody:", overlayUpdateBody);
    const res = await fetch(
        "https://rouletteoverlay.luke.town/" + requestBody.id + "/update",
        {
            mode: "no-cors",
            method: "POST",
            body: JSON.stringify(overlayUpdateBody),
        },
    );

    console.log(res);

    return res;
}

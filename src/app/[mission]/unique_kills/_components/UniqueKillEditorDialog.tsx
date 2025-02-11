"use client";

import { UniqueKill } from "@/types";
import {
    Dialog,
    DialogPortal,
    DialogOverlay,
    DialogContent,
    DialogTitle,
} from "@radix-ui/react-dialog";

import { Dispatch, SetStateAction, useState, useEffect } from "react";
import {
    CreateUniqueKillAction,
    UpdateUniqueKillAction,
} from "../UniqueKillActions";

export default function UniqueKillEditorDialog({
    uniqueKill,
    isNew,
    editDialogActive,
    setEditDialogActive,
}: {
    uniqueKill: UniqueKill;
    isNew: boolean;
    editDialogActive: boolean;
    setEditDialogActive: Dispatch<SetStateAction<boolean>>;
}) {
    const [uniqueKillMethod, setUniqueKillMethod] = useState(
        uniqueKill.kill_method,
    );
    const [uniqueKillName, setUniqueKillName] = useState(uniqueKill.name || "");
    const [uniqueKillNotes, setUniqueKillNotes] = useState(
        uniqueKill.notes || "",
    );
    const [uniqueKillRequires, setUniqueKillRequires] = useState(
        uniqueKill.requires || "",
    );
    const [uniqueKillStarts, setUniqueKillStarts] = useState(
        uniqueKill.starts || "",
    );
    const [uniqueKillTimings, setUniqueKillTimings] = useState(
        uniqueKill.timings || "",
    );
    const [uniqueKillVideoLink, setUniqueKillVideoLink] = useState(
        uniqueKill.video_link || "",
    );

    const uniqueKillOptions = [
        "loud_kills",
        "drowning",
        "falling_object",
        "fall",
        "fire",
        "electrocution",
        "explosion_accident",
        "consumed_poison",
        "impact_explosive",
    ];

    switch (uniqueKill.target) {
        case "silvio_caruso":
            uniqueKillOptions.push("shoot_through_the_telescope");
            break;
        case "sean_rose":
            uniqueKillOptions.push("explosive_watch_battery");
            break;
        case "sierra_knox":
            uniqueKillOptions.push("shoot_the_car");
            break;
        case "athena_savalas":
            uniqueKillOptions.push("athena_savalas_award");
            break;
        case "steven_bradley":
            uniqueKillOptions.push("explosive_on_water_scooter");
            break;
        default:
            break;
    }

    const [hasBeenEdited, setHasBeenEdited] = useState(false);

    useEffect(() => {
        if (
            uniqueKillName !== (uniqueKill.name || "") ||
            uniqueKillNotes !== (uniqueKill.notes || "") ||
            uniqueKillRequires !== (uniqueKill.requires || "") ||
            uniqueKillStarts !== (uniqueKill.starts || "") ||
            uniqueKillTimings !== (uniqueKill.timings || "") ||
            uniqueKillVideoLink !== (uniqueKill.video_link || "")
        ) {
            setHasBeenEdited(true);
        } else {
            setHasBeenEdited(false);
        }
    }, [
        uniqueKillMethod,
        uniqueKillName,
        uniqueKillNotes,
        uniqueKillRequires,
        uniqueKillStarts,
        uniqueKillTimings,
        uniqueKillVideoLink,
        hasBeenEdited,
    ]);

    return (
        <Dialog open={editDialogActive} onOpenChange={setEditDialogActive}>
            <DialogPortal>
                <DialogOverlay className="fixed inset-0 bg-zinc-900 opacity-80" />
                <DialogContent className="fixed left-1/2 top-1/2 w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white sm:w-[30rem]">
                    <DialogTitle className="w-full p-3 text-center text-base font-bold sm:text-xl">
                        {`${isNew ? "Create" : "Edit"} Isolation`}
                    </DialogTitle>
                    <form
                        className="p-3 text-sm sm:text-xl"
                        action={async (formData: FormData) => {
                            if (isNew) {
                                await CreateUniqueKillAction(formData);
                            } else {
                                await UpdateUniqueKillAction(formData);
                            }
                            setEditDialogActive(false);
                        }}
                    >
                        {isNew ? (
                            <fieldset>
                                {/* Field for the isolation name */}
                                <label className="font-semibold">
                                    Kill Method:
                                </label>
                                <select
                                    required
                                    value={uniqueKillMethod}
                                    name="kill_method"
                                    onChange={(e) =>
                                        setUniqueKillMethod(e.target.value)
                                    }
                                >
                                    {uniqueKillOptions.map((uniqueKill) => (
                                        <option
                                            value={uniqueKill}
                                            key={uniqueKill}
                                        >
                                            {UniqueKillIDToDisplayText(
                                                uniqueKill,
                                            )}
                                        </option>
                                    ))}
                                </select>
                            </fieldset>
                        ) : (
                            <input
                                readOnly
                                hidden
                                name="kill_method"
                                value={uniqueKill.kill_method}
                            ></input>
                        )}
                        <fieldset className="">
                            {/* Field for the isolation name */}
                            <label className="font-semibold">Name:</label>
                            <input
                                type="text"
                                name="name"
                                value={uniqueKillName}
                                onChange={(e) =>
                                    setUniqueKillName(e.target.value)
                                }
                                className="w-full border-2 border-zinc-900 p-1"
                                id="name"
                            />
                        </fieldset>
                        <fieldset className="pt-2">
                            {/* Field for starts */}
                            <label className="font-semibold">Starts:</label>
                            <input
                                type="text"
                                name="starts"
                                value={uniqueKillStarts}
                                onChange={(e) =>
                                    setUniqueKillStarts(e.target.value)
                                }
                                className="w-full border-2 border-zinc-900 p-1"
                                id="starts"
                            />
                        </fieldset>
                        <fieldset className="pt-2">
                            {/* Field for isolation requirements */}
                            <label className="font-semibold">Requires:</label>
                            <input
                                type="text"
                                name="requires"
                                value={uniqueKillRequires}
                                onChange={(e) =>
                                    setUniqueKillRequires(e.target.value)
                                }
                                className="w-full border-2 border-zinc-900 p-1"
                                id="requires"
                            />
                        </fieldset>
                        <fieldset className="pt-2">
                            {/* Field for isolation timings */}
                            <label className="font-semibold">Timings:</label>
                            <input
                                type="text"
                                name="timings"
                                value={uniqueKillTimings}
                                onChange={(e) =>
                                    setUniqueKillTimings(e.target.value)
                                }
                                className="w-full border-2 border-zinc-900 p-1"
                                id="timings"
                            />
                        </fieldset>
                        <fieldset className="pt-2">
                            {/* Field for isolation notes */}
                            <label className="font-semibold">Notes:</label>
                            <input
                                type="text"
                                name="notes"
                                value={uniqueKillNotes}
                                onChange={(e) =>
                                    setUniqueKillNotes(e.target.value)
                                }
                                className="w-full border-2 border-zinc-900 p-1"
                                id="notes"
                            />
                        </fieldset>
                        <fieldset className="pt-2">
                            {/* Field for isolation video link */}
                            <label className="font-semibold">Video Link:</label>
                            <input
                                type="url"
                                name="video_link"
                                value={uniqueKillVideoLink}
                                onChange={(e) =>
                                    setUniqueKillVideoLink(e.target.value)
                                }
                                className="w-full border-2 border-zinc-900 p-1"
                                id="video_link"
                            />
                        </fieldset>
                        {/* Hidden field for Isolation ID */}
                        <input
                            hidden
                            readOnly
                            name="id"
                            value={uniqueKill.id}
                            id="id"
                        />
                        {/* Hidden field for Isolation Map */}
                        <input
                            hidden
                            readOnly
                            name="map"
                            value={uniqueKill.map}
                            id="map"
                        />
                        {/* Hidden field for Isolation Target */}
                        <input
                            hidden
                            readOnly
                            name="target"
                            value={uniqueKill.target}
                            id="target"
                        />

                        {hasBeenEdited && (
                            <button
                                type="submit"
                                className="mt-2 w-32 rounded-md border-2 border-red-500 bg-white p-1 text-sm font-bold text-zinc-900 hover:bg-red-500 hover:text-white sm:text-xl"
                            >
                                Save
                            </button>
                        )}
                    </form>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}

function UniqueKillIDToDisplayText(uniqueKill: string) {
    let uniqueKillDisplayText = "";
    const words = uniqueKill.split("_");

    for (const word of words) {
        uniqueKillDisplayText +=
            word.charAt(0).toUpperCase() + word.slice(1) + " ";
    }

    return uniqueKillDisplayText;
}

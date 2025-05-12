"use client";

import { Isolation } from "@/types";
import {
    Dialog,
    DialogPortal,
    DialogOverlay,
    DialogContent,
    DialogTitle,
} from "@radix-ui/react-dialog";

import { Dispatch, SetStateAction, useState, useEffect } from "react";
import {
    CreateIsolationAction,
    UpdateIsolationAction,
} from "../IsolationActions";

export default function IsolationEditorDialog({
    isolation,
    isNew,
    editDialogActive,
    setEditDialogActive,
}: {
    isolation: Isolation;
    isNew: boolean;
    editDialogActive: boolean;
    setEditDialogActive: Dispatch<SetStateAction<boolean>>;
}) {
    const [isolationName, setIsolationName] = useState(isolation.name);
    const [isolationNotes, setIsolationNotes] = useState(isolation.notes || "");
    const [isolationRequires, setIsolationRequires] = useState(
        isolation.requires || "",
    );
    const [isolationStarts, setIsolationStarts] = useState(
        isolation.starts || "",
    );
    const [isolationTimings, setIsolationTimings] = useState(
        isolation.timings || "",
    );
    const [isolationVideoLink, setIsolationVideoLink] = useState(
        isolation.video_link,
    );

    const [hasBeenEdited, setHasBeenEdited] = useState(false);

    useEffect(() => {
        if (
            isolationName !== isolation.name ||
            isolationNotes !== isolation.notes ||
            isolationRequires !== isolation.requires ||
            isolationStarts !== isolation.starts ||
            isolationTimings !== isolation.timings ||
            isolationVideoLink !== isolation.video_link
        ) {
            setHasBeenEdited(true);
        } else {
            setHasBeenEdited(false);
        }
    }, [
        isolationName,
        isolation.name,
        isolationNotes,
        isolation.notes,
        isolationRequires,
        isolation.requires,
        isolationStarts,
        isolation.starts,
        isolationTimings,
        isolation.timings,
        isolationVideoLink,
        isolation.video_link,
        hasBeenEdited,
    ]);

    return (
        <Dialog open={editDialogActive} onOpenChange={setEditDialogActive}>
            <DialogPortal>
                <DialogOverlay className="fixed inset-0 bg-zinc-900 opacity-80" />
                <DialogContent className="fixed top-1/2 left-1/2 w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white sm:w-[30rem]">
                    <DialogTitle className="w-full p-3 text-center font-bold">
                        {`${isNew ? "Create" : "Edit"} Isolation`}
                    </DialogTitle>
                    <form
                        className="p-3"
                        action={async (formData: FormData) => {
                            if (isNew) {
                                await CreateIsolationAction(formData);
                            } else {
                                await UpdateIsolationAction(formData);
                            }
                            setEditDialogActive(false);
                        }}
                    >
                        <fieldset className="">
                            {/* Field for the isolation name */}
                            <label className="font-semibold">Name:</label>
                            <input
                                required
                                type="text"
                                name="name"
                                value={isolationName}
                                onChange={(e) =>
                                    setIsolationName(e.target.value)
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
                                value={isolationStarts}
                                onChange={(e) =>
                                    setIsolationStarts(e.target.value)
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
                                value={isolationRequires}
                                onChange={(e) =>
                                    setIsolationRequires(e.target.value)
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
                                value={isolationTimings}
                                onChange={(e) =>
                                    setIsolationTimings(e.target.value)
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
                                value={isolationNotes}
                                onChange={(e) =>
                                    setIsolationNotes(e.target.value)
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
                                required
                                value={isolationVideoLink}
                                onChange={(e) =>
                                    setIsolationVideoLink(e.target.value)
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
                            value={isolation.id}
                            id="id"
                        />
                        {/* Hidden field for Isolation Map */}
                        <input
                            hidden
                            readOnly
                            name="map"
                            value={isolation.map}
                            id="map"
                        />
                        {/* Hidden field for Isolation Target */}
                        <input
                            hidden
                            readOnly
                            name="target"
                            value={isolation.target}
                            id="target"
                        />

                        {hasBeenEdited && (
                            <button
                                type="submit"
                                className="mt-2 w-32 rounded-md border-2 border-red-500 bg-white p-1 font-bold text-zinc-900 hover:bg-red-500 hover:text-white"
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

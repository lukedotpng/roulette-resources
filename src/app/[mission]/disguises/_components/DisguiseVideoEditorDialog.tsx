"use client";

import { Disguise } from "@/types";
import {
    Dialog,
    DialogPortal,
    DialogOverlay,
    DialogContent,
    DialogTitle,
} from "@radix-ui/react-dialog";

import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { NewDisguiseVideoAction } from "../DisguiseActions";
import { DisguiseIDToDisplayText } from "@/globals";

export default function DisguiseVideoEditorDialog({
    disguise,
    editDialogActive,
    setEditDialogActive,
}: {
    disguise: Disguise;
    editDialogActive: boolean;
    setEditDialogActive: Dispatch<SetStateAction<boolean>>;
}) {
    const [disguiseVideoLink, setDisguiseVideoLink] = useState("");

    const [canSave, setCanSave] = useState(false);

    useEffect(() => {
        if (disguiseVideoLink !== "") {
            setCanSave(true);
        } else {
            setCanSave(false);
        }
    }, [disguiseVideoLink, canSave]);

    return (
        <Dialog open={editDialogActive} onOpenChange={setEditDialogActive}>
            <DialogPortal>
                <DialogOverlay className="fixed inset-0 bg-zinc-900 opacity-80" />
                <DialogContent className="fixed left-1/2 top-1/2 w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-3 sm:w-[30rem]">
                    <DialogTitle className="w-full p-3 text-center text-base font-bold sm:text-xl">
                        {`Add New Video For "${DisguiseIDToDisplayText(disguise.id)}"`}
                    </DialogTitle>
                    <form
                        className="flex flex-col gap-2 text-sm sm:text-xl"
                        action={async (formData: FormData) => {
                            await NewDisguiseVideoAction(formData);
                            setEditDialogActive(false);
                        }}
                    >
                        <fieldset>
                            {/* Field for Video URL */}
                            <label className="font-semibold">Video Link:</label>
                            <input
                                type="url"
                                name="link"
                                value={disguiseVideoLink}
                                onChange={(e) =>
                                    setDisguiseVideoLink(e.target.value)
                                }
                                className="w-full border-2 border-zinc-900 p-1"
                                id="hitmaps_link"
                            />
                            {/* Hidden field for Disguise ID */}
                            <input
                                hidden
                                readOnly
                                name="id"
                                value={disguise.id}
                            />
                        </fieldset>

                        {canSave && (
                            <button
                                type="submit"
                                className="w-32 rounded-md border-2 border-red-500 bg-white p-1 text-sm font-bold text-zinc-900 hover:bg-red-500 hover:text-white sm:text-xl"
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

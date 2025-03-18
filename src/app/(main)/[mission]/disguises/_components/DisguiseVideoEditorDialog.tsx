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
import { DisguiseIDToDisplayText } from "@/utils/FormattingUtils";

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
                <DialogContent className="fixed top-1/2 left-1/2 w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-3 sm:w-[30rem]">
                    <DialogTitle className="w-full p-3 text-center font-bold">
                        {`Add New Video For "${DisguiseIDToDisplayText(disguise.id)}"`}
                    </DialogTitle>
                    <form
                        className="flex flex-col gap-2"
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
                                className="w-32 rounded-md border-2 border-red-500 bg-white p-1 font-bold text-zinc-900 hover:bg-red-500 hover:text-white"
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

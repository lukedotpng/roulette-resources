import { DisguiseSelect, DisguiseVideoInsert } from "@/types";
import {
    Dialog,
    DialogPortal,
    DialogOverlay,
    DialogContent,
    DialogTitle,
} from "@radix-ui/react-dialog";

import { Dispatch, SetStateAction, useState, useEffect } from "react";
import {
    NewDisguiseVideoAction,
    UpdateDisguiseVideoAction,
} from "../DisguiseActions";
import { DisguiseIDToDisplayText } from "@/utils/FormattingUtils";

export default function DisguiseVideoEditorDialog({
    disguise,
    disguiseVideo,
    isNew,
    editDialogActive,
    setEditDialogActive,
}: {
    disguise: DisguiseSelect;
    disguiseVideo: DisguiseVideoInsert;
    isNew: boolean;
    editDialogActive: boolean;
    setEditDialogActive: Dispatch<SetStateAction<boolean>>;
}) {
    const [disguiseVideoLink, setDisguiseVideoLink] = useState(
        disguiseVideo.link,
    );
    const [disguiseVideoNotes, setDisguiseVideoNotes] = useState(
        disguiseVideo.notes,
    );

    const [canSave, setCanSave] = useState(false);

    useEffect(() => {
        if (
            disguiseVideoLink !== disguiseVideo.link ||
            disguiseVideoNotes !== disguiseVideo.notes
        ) {
            setCanSave(true);
        } else {
            setCanSave(false);
        }
    }, [disguiseVideoLink, disguiseVideoNotes, canSave]);

    return (
        <Dialog open={editDialogActive} onOpenChange={setEditDialogActive}>
            <DialogPortal>
                <DialogOverlay className="fixed inset-0 bg-zinc-900 opacity-80" />
                <DialogContent className="fixed top-1/2 left-1/2 w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-3 sm:w-[30rem]">
                    <DialogTitle className="w-full p-3 text-center font-bold">
                        {`${isNew ? "Add New" : "Update"} Video For "${DisguiseIDToDisplayText(disguise.id)}"`}
                    </DialogTitle>
                    <form
                        className="flex flex-col gap-2"
                        action={async (formData: FormData) => {
                            if (isNew) {
                                await NewDisguiseVideoAction(formData);
                            } else {
                                await UpdateDisguiseVideoAction(formData);
                            }
                            setEditDialogActive(false);
                        }}
                    >
                        <fieldset>
                            {/* Field for Video notes */}
                            <label className="font-semibold">{"Notes:"}</label>
                            <input
                                type="text"
                                name="notes"
                                value={disguiseVideoNotes}
                                onChange={(e) =>
                                    setDisguiseVideoNotes(e.target.value)
                                }
                                className="w-full border-2 border-zinc-900 p-1"
                                id="notes"
                            />
                            {/* Field for Video URL */}
                            <label className="font-semibold">
                                {"Video Link:"}
                            </label>
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
                            {/* Hidden field for Disguise Video ID */}
                            <input
                                hidden
                                readOnly
                                name="video_id"
                                value={disguiseVideo.id}
                            />
                            {/* Hidden field for Disguise ID */}
                            <input
                                hidden
                                readOnly
                                name="disguise_id"
                                value={disguise.id}
                            />
                        </fieldset>

                        <div className="flex w-full justify-center">
                            <button
                                type="submit"
                                className="mt-2 w-32 rounded-md border-2 border-zinc-900 bg-white p-1 text-sm font-bold text-zinc-900 decoration-red-500 decoration-2 not-disabled:hover:border-red-500 not-disabled:hover:bg-red-500 not-disabled:hover:text-white disabled:cursor-not-allowed! disabled:opacity-30 sm:text-xl"
                                disabled={!canSave}
                            >
                                {"Save"}
                            </button>
                        </div>
                    </form>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}

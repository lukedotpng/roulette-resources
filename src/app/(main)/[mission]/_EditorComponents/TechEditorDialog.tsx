import { ActionResponse, TechInsert } from "@/types";
import {
    Dialog,
    DialogPortal,
    DialogOverlay,
    DialogContent,
    DialogTitle,
} from "@radix-ui/react-dialog";

import { Dispatch, SetStateAction, useState, useEffect } from "react";
import {
    CreateTechAction,
    UpdateTechAction,
} from "../_InfoActions/TechActions";
import FreeformInput from "../_components/FreeformInput";
import { useRouter } from "next/navigation";

export default function TechEditorDialog({
    tech,
    isNew,
    editDialogActive,
    setEditDialogActive,
}: {
    tech: TechInsert;
    isNew: boolean;
    editDialogActive: boolean;
    setEditDialogActive: Dispatch<SetStateAction<boolean>>;
}) {
    const router = useRouter();

    const [techName, setTechName] = useState(tech.name);
    const [techNotes, setTechNotes] = useState(tech.notes || "");
    const [techVideoLink, setTechVideoLink] = useState(tech.video_link);

    const [hasBeenEdited, setHasBeenEdited] = useState(false);

    useEffect(() => {
        if (
            techName !== tech.name ||
            techNotes !== tech.notes ||
            techVideoLink !== tech.video_link
        ) {
            setHasBeenEdited(true);
        } else {
            setHasBeenEdited(false);
        }
    }, [
        techName,
        tech.name,
        techNotes,
        tech.notes,
        techVideoLink,
        tech.video_link,
        hasBeenEdited,
    ]);

    return (
        <Dialog open={editDialogActive} onOpenChange={setEditDialogActive}>
            <DialogPortal>
                <DialogOverlay className="fixed inset-0 bg-zinc-900 opacity-80" />
                <DialogContent className="fixed top-1/2 left-1/2 w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white sm:max-w-[50rem]">
                    <DialogTitle className="w-full p-3 text-center font-bold">
                        {`${isNew ? "Create" : "Edit"} Tech`}
                    </DialogTitle>
                    <form
                        className="p-3"
                        action={async (formData: FormData) => {
                            let res: ActionResponse;
                            if (isNew) {
                                res = await CreateTechAction(formData);
                            } else {
                                res = await UpdateTechAction(formData);
                            }
                            if (!res.success) {
                                console.log("UPLOAD ERROR:", res.error);
                                window.alert(
                                    'Uh Oh! There was an error:\n"' +
                                        res.error +
                                        '"',
                                );
                            }
                            router.refresh();
                            setEditDialogActive(false);
                        }}
                    >
                        <fieldset className="">
                            {/* Field for the tech name */}
                            <label className="font-semibold">Name:</label>
                            <input
                                required
                                type="text"
                                name="name"
                                value={techName}
                                onChange={(e) => setTechName(e.target.value)}
                                className="w-full border-2 border-zinc-900 p-1"
                                id="name"
                            />
                        </fieldset>
                        <fieldset className="pt-2">
                            {/* Field for tech notes */}
                            <label className="font-semibold">Notes:</label>
                            <FreeformInput
                                value={techNotes}
                                onChange={(updateNotes: string) => {
                                    setTechNotes(updateNotes);
                                }}
                                id={"notes"}
                            />
                            {/*<input
                                type="text"
                                name="notes"
                                value={techNotes}
                                onChange={(e) => setTechNotes(e.target.value)}
                                className="w-full border-2 border-zinc-900 p-1"
                                id="notes"
                            />*/}
                        </fieldset>
                        <fieldset className="pt-2">
                            {/* Field for tech video link */}
                            <label className="font-semibold">Video Link:</label>
                            <input
                                type="url"
                                name="video_link"
                                required
                                value={techVideoLink}
                                onChange={(e) =>
                                    setTechVideoLink(e.target.value)
                                }
                                className="w-full border-2 border-zinc-900 p-1"
                                id="video_link"
                            />
                        </fieldset>
                        {/* Hidden field for Tech ID */}
                        <input
                            hidden
                            readOnly
                            name="id"
                            value={tech.id}
                            id="id"
                        />
                        {/* Hidden field for Tech Mission */}
                        <input
                            hidden
                            readOnly
                            name="mission"
                            value={tech.mission}
                            id="mission"
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

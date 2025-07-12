import { ActionResponse, ItemInsert } from "@/types";
import {
    Dialog,
    DialogPortal,
    DialogOverlay,
    DialogContent,
    DialogTitle,
} from "@radix-ui/react-dialog";

import { Dispatch, SetStateAction, useState, useEffect } from "react";
import {
    CreateItemAction,
    UpdateItemAction,
} from "../_InfoActions/ItemActions";
import {
    MethodDisplayTextToID,
    MethodIDToDisplayText,
} from "@/utils/FormattingUtils";

export default function ItemEditorDialog({
    item,
    editDialogActive,
    setEditDialogActive,
    isNew,
}: {
    item: ItemInsert;
    editDialogActive: boolean;
    setEditDialogActive: Dispatch<SetStateAction<boolean>>;
    isNew: boolean;
}) {
    const [itemName, setItemName] = useState(item.name);

    const hitmapsLinkAsString = item.hitmaps_link ?? "";
    const [itemHitmapsLink, setItemHitmapsLink] = useState(hitmapsLinkAsString);

    const [itemQuickLook, setItemQuickLook] = useState(item.quick_look);

    const [itemVisible, setItemVisible] = useState(!!item.visible || isNew);

    const [hasBeenEdited, setHasBeenEdited] = useState(false);

    const officialItemName = item.id.split("-")[1];

    const isNewUtility = isNew && item.id === `${item.mission}-new_utility`;

    useEffect(() => {
        if (typeof window === undefined) {
            return;
        }

        if (
            itemName !== item.name ||
            itemHitmapsLink !== hitmapsLinkAsString ||
            itemQuickLook !== item.quick_look ||
            itemVisible !== item.visible
        ) {
            setHasBeenEdited(true);
        } else {
            setHasBeenEdited(false);
        }
    }, [
        itemName,
        item.name,
        itemHitmapsLink,
        hitmapsLinkAsString,
        itemQuickLook,
        item.quick_look,
        itemVisible,
        item.visible,
        hasBeenEdited,
    ]);

    return (
        <Dialog open={editDialogActive} onOpenChange={setEditDialogActive}>
            <DialogPortal>
                <DialogOverlay className="fixed inset-0 bg-zinc-900 opacity-80" />
                <DialogContent className="fixed top-1/2 left-1/2 w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white sm:w-[30rem]">
                    <DialogTitle className="w-full p-3 text-center text-[1.1em] font-bold">
                        {`Edit "${isNewUtility ? itemName : MethodIDToDisplayText(officialItemName)}"`}
                    </DialogTitle>
                    <form
                        className="p-3"
                        action={async (formData: FormData) => {
                            if (formData.get("id") && isNewUtility) {
                                formData.set(
                                    "id",
                                    `${item.mission}-${MethodDisplayTextToID(itemName)}`,
                                );
                            }

                            let res: ActionResponse;
                            if (isNew) {
                                res = await CreateItemAction(formData);
                            } else {
                                res = await UpdateItemAction(formData);
                            }

                            if (!res.success) {
                                console.log("UPLOAD ERROR:", res.error);
                                window.alert(
                                    'Uh Oh! There was an error:\n"' +
                                        res.error +
                                        '"',
                                );
                            }

                            setEditDialogActive(false);
                        }}
                    >
                        <fieldset className="">
                            {/* Field for the item name */}
                            <label className="font-semibold">
                                Display Name:
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={itemName}
                                onChange={(e) => setItemName(e.target.value)}
                                className="w-full border-2 border-zinc-900 p-1"
                                id="name"
                            />
                        </fieldset>
                        <fieldset className="pt-2">
                            {/* Field for quick look*/}
                            <label className="font-semibold">Quick Look:</label>
                            <textarea
                                name="quick_look"
                                value={itemQuickLook}
                                onChange={(e) =>
                                    setItemQuickLook(e.target.value)
                                }
                                className="min-h-16 w-full border-2 border-zinc-900 p-1"
                                id="quick_look"
                                rows={3}
                                maxLength={500}
                            />
                        </fieldset>
                        <fieldset className="pt-2">
                            {/* Field for Hitmaps URL */}
                            <label className="font-semibold">
                                Hitmaps Link:
                            </label>
                            <input
                                type="url"
                                name="hitmaps_link"
                                value={itemHitmapsLink}
                                onChange={(e) =>
                                    setItemHitmapsLink(e.target.value)
                                }
                                className="w-full border-2 border-zinc-900 p-1"
                                id="hitmaps_link"
                            />
                        </fieldset>
                        {!isNew && (
                            <fieldset className="flex items-center gap-3 pt-2">
                                {/* Field for Hitmaps URL */}
                                <label className="font-semibold">
                                    Toggle Visibility
                                </label>
                                <input
                                    id="visible"
                                    name="visible"
                                    type="checkbox"
                                    checked={itemVisible}
                                    onChange={() =>
                                        setItemVisible(!itemVisible)
                                    }
                                    className="cursor-pointer border-2 border-zinc-900 p-1"
                                />
                            </fieldset>
                        )}
                        {/* Hidden field for Item ID */}
                        <input
                            hidden
                            readOnly
                            name="id"
                            value={item.id}
                            id="id"
                        />
                        {/* Hidden field for Item Mission */}
                        <input
                            hidden
                            readOnly
                            name="mission"
                            value={item.mission}
                            id="mission"
                        />
                        {/* Hidden field for Item type */}
                        <input
                            hidden
                            readOnly
                            name="type"
                            value={item.type}
                            id="type"
                        />
                        <div className="flex w-full justify-center">
                            <button
                                type="submit"
                                className="mt-2 w-32 rounded-md border-2 border-zinc-900 bg-white p-1 text-sm font-bold text-zinc-900 decoration-red-500 decoration-2 not-disabled:hover:border-red-500 not-disabled:hover:bg-red-500 not-disabled:hover:text-white disabled:cursor-not-allowed! disabled:opacity-30 sm:text-xl"
                                disabled={!hasBeenEdited}
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}

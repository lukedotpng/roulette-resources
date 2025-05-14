"use client";

import { Item } from "@/types";
import {
    Dialog,
    DialogPortal,
    DialogOverlay,
    DialogContent,
    DialogTitle,
} from "@radix-ui/react-dialog";

import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { UpdateItemAction } from "../ItemActions";
import { MethodIDToDisplayText } from "@/utils/FormattingUtils";

export default function ItemEditorDialog({
    item,
    editDialogActive,
    setEditDialogActive,
}: {
    item: Item;
    editDialogActive: boolean;
    setEditDialogActive: Dispatch<SetStateAction<boolean>>;
}) {
    const hitmapsLinkAsString = item.hitmaps_link ?? "";

    const [itemName, setItemName] = useState(item.name);
    const [itemHitmapsLink, setItemHitmapsLink] = useState(hitmapsLinkAsString);
    const [itemQuickLook, setItemQuickLook] = useState(item.quick_look);

    const [hasBeenEdited, setHasBeenEdited] = useState(false);

    const officialItemName = item.id.split("-")[1];

    useEffect(() => {
        if (
            itemName !== item.name ||
            itemHitmapsLink !== hitmapsLinkAsString ||
            itemQuickLook !== item.quick_look
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
        hasBeenEdited,
    ]);

    return (
        <Dialog open={editDialogActive} onOpenChange={setEditDialogActive}>
            <DialogPortal>
                <DialogOverlay className="fixed inset-0 bg-zinc-900 opacity-80" />
                <DialogContent className="fixed top-1/2 left-1/2 w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white sm:w-[30rem]">
                    <DialogTitle className="w-full p-3 text-center text-[1.1em] font-bold">
                        {`Edit "${MethodIDToDisplayText(officialItemName)}"`}
                    </DialogTitle>
                    <form
                        className="p-3"
                        action={async (formData: FormData) => {
                            await UpdateItemAction(formData);
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
                            <input
                                type="text"
                                name="quick_look"
                                value={itemQuickLook}
                                onChange={(e) =>
                                    setItemQuickLook(e.target.value)
                                }
                                className="w-full border-2 border-zinc-900 p-1"
                                id="quick_look"
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
                        {/* Hidden field for Item ID */}
                        <input
                            hidden
                            readOnly
                            name="id"
                            value={item.id}
                            id="id"
                        />
                        {/* Hidden field for Item Map */}
                        <input
                            hidden
                            readOnly
                            name="map"
                            value={item.mission}
                            id="map"
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

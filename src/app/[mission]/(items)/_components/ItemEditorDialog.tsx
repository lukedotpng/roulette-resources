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
    }, [itemName, itemHitmapsLink, itemQuickLook, hasBeenEdited]);

    return (
        <Dialog open={editDialogActive} onOpenChange={setEditDialogActive}>
            <DialogPortal>
                <DialogOverlay className="fixed inset-0 bg-zinc-900 opacity-80" />
                <DialogContent className="fixed left-1/2 top-1/2 w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white sm:w-[30rem]">
                    <DialogTitle className="w-full p-3 text-center text-base font-bold sm:text-xl">
                        Edit Item
                    </DialogTitle>
                    <form
                        className="p-3 text-sm sm:text-xl"
                        action={async (formData: FormData) => {
                            await UpdateItemAction(formData);
                            setEditDialogActive(false);
                        }}
                    >
                        <fieldset className="">
                            {/* Field for the item name */}
                            <label className="font-semibold">Name:</label>
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
                            value={item.map}
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

                        {hasBeenEdited && (
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

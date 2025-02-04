"use client";

import { Item } from "@/types";
import { useEffect, useState } from "react";
import { UpdateItemAction } from "./UpdateItemAction";

export default function Items({
    items,
    isAdmin,
}: {
    items: Item[];
    isAdmin: boolean;
}) {
    const [inEditMode, setInEditMode] = useState(false);

    return (
        <div className="flex flex-col items-center justify-center gap-3 p-3">
            <div className="flex flex-wrap justify-center gap-3 md:gap-5">
                <ItemCard
                    type="Melee"
                    items={items.filter((item) => item.type === "melee")}
                />
                <div className="flex flex-col gap-3 md:gap-5">
                    <ItemCard
                        type="Weapons"
                        items={items.filter((item) => item.type === "weapon")}
                    />
                    <ItemCard
                        type="Utility"
                        items={items.filter((item) => item.type === "utility")}
                    />
                </div>
            </div>

            {isAdmin && (
                <button
                    className="w-32 rounded-md bg-white p-1 text-xl font-bold text-zinc-900 hover:bg-red-500 hover:text-white"
                    onClick={() => setInEditMode(!inEditMode)}
                >
                    {inEditMode ? "View" : "Edit"}
                </button>
            )}
        </div>
    );
}

function ItemCard({ type, items }: { type: string; items: Item[] }) {
    if (items.length === 0) {
        return null;
    }

    return (
        <div className="h-fit w-80 bg-white p-3 pb-0 text-sm text-zinc-900 sm:w-80 sm:text-base md:w-96 md:text-base">
            <h2 className="text-base font-bold sm:text-lg md:text-xl">
                {type}
            </h2>
            {items.map((item) => {
                return (
                    <div
                        key={item.id}
                        className="border-b-2 border-zinc-900 py-1 last:border-0"
                    >
                        {item.hitmaps_link ? (
                            <a href={item.hitmaps_link} target="_blank">
                                <span className="font-semibold underline">
                                    {item.name}
                                </span>
                                <span className="text-[.7em] italic">
                                    Hitmaps
                                </span>
                            </a>
                        ) : (
                            <h2 className="font-semibold">{item.name}</h2>
                        )}

                        <p className="text-xs sm:text-sm">{item.quick_look}</p>
                    </div>
                );
            })}
        </div>
    );
}

function EditItem({ item }: { item: Item }) {
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
        <form
            action={UpdateItemAction}
            key={item.id}
            className="border-b-4 border-red-500 p-2"
        >
            <label htmlFor="name" className="font-semibold">
                {"Name"}
            </label>
            <input
                type="text"
                name="name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="w-full border-2 border-zinc-900"
                aria-label="Item Name"
                id="name"
            />
            <br />
            <label htmlFor="hitmaps_link" className="font-semibold">
                {"Hitmaps Link:"}
            </label>
            <input
                type="url"
                name="hitmaps_link"
                value={itemHitmapsLink}
                onChange={(e) => setItemHitmapsLink(e.target.value)}
                className="w-full border-2 border-zinc-900"
                aria-label="Hitmaps Link"
                id="hitmaps_link"
            />
            <br />
            <label htmlFor="quick_look" className="font-semibold">
                {"Quick Look"}
            </label>
            <textarea
                name="quick_look"
                value={itemQuickLook}
                onChange={(e) => setItemQuickLook(e.target.value)}
                className="w-full border-2 border-zinc-900"
                aria-label="Quick Look"
                id="quick_look"
            />
            {hasBeenEdited && (
                <button
                    type="submit"
                    className="w-32 rounded-md border-2 border-red-500 bg-white p-1 text-xl font-bold text-zinc-900 hover:bg-red-500 hover:text-white"
                >
                    Save
                </button>
            )}
        </form>
    );
}

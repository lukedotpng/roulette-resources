"use client";

import { Item, Mission } from "@/types";
import ItemCard from "./ItemCard";
import { useState } from "react";
import ItemEditorDialog from "./ItemEditorDialog";

export default function Items({
    items,
    mission,
}: {
    items: Item[];
    mission: Mission;
}) {
    const [editDialogActive, setEditDialogActive] = useState(false);
    const [currentItemToEdit, setCurrentItemToEdit] = useState<Item>({
        id: "",
        map: mission,
        name: "New Item",
        type: "Melee",
        quick_look: "",
        hitmaps_link: "",
    } as Item);

    function handleItemEditTrigger(item: Item, isNew: boolean) {
        if (editDialogActive && !isNew) {
            setEditDialogActive(false);
            return;
        }

        setEditDialogActive(true);
        setCurrentItemToEdit(item);
    }

    return (
        <div className="flex w-full max-w-[64rem] flex-col flex-wrap items-center gap-2 px-5 sm:p-0 md:max-h-[50rem]">
            <ItemCard
                type="Melee"
                items={items.filter((item) => item.type === "melee")}
                handleItemEditTrigger={handleItemEditTrigger}
            />
            <ItemCard
                type="Weapons"
                items={items.filter((item) => item.type === "weapon")}
                handleItemEditTrigger={handleItemEditTrigger}
            />
            <ItemCard
                type="Utility"
                items={items.filter((item) => item.type === "utility")}
                handleItemEditTrigger={handleItemEditTrigger}
            />
            {editDialogActive && (
                <ItemEditorDialog
                    item={currentItemToEdit}
                    editDialogActive={editDialogActive}
                    setEditDialogActive={setEditDialogActive}
                />
            )}
        </div>
    );
}

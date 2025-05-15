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
        mission: mission,
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
        <div
            id="item-card-wrapper"
            className="flex w-full flex-wrap items-start justify-center gap-3 px-2 sm:gap-5"
        >
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

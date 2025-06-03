"use client";

import { ItemInsert, ItemSelect, Mission } from "@/types";
import ItemCard from "./ItemCard";
import { useState } from "react";
import ItemEditorDialog from "./ItemEditorDialog";
import WeaponCard from "./WeaponCard";
import { MethodIDToDisplayText } from "@/utils/FormattingUtils";

export default function Items({
    items,
    mission,
}: {
    items: ItemSelect[];
    mission: Mission;
}) {
    const [editDialogActive, setEditDialogActive] = useState(false);
    const [currentItemToEdit, setCurrentItemToEdit] = useState<ItemInsert>({
        id: "",
        mission: mission,
        name: "New Item",
        type: "Melee",
        quick_look: "",
        hitmaps_link: "",
    } as ItemInsert);
    const [itemIsNew, setItemIsNew] = useState(false);

    function handleItemEditTrigger(item: ItemSelect | string, isNew: boolean) {
        if (editDialogActive && !isNew) {
            setEditDialogActive(false);
            return;
        }
        let itemToEdit: ItemInsert;

        if (typeof item === "string") {
            itemToEdit = {
                id: `${mission}-${item}`,
                mission: mission,
                name: MethodIDToDisplayText(item),
                type: "weapon",
                quick_look: "",
                hitmaps_link: null,
            };
        } else {
            itemToEdit = item;
        }
        setItemIsNew(isNew);

        setEditDialogActive(true);
        setCurrentItemToEdit(itemToEdit);
    }

    return (
        <div
            id="item-card-wrapper"
            className="flex w-full flex-wrap items-start justify-center gap-3 px-2 sm:gap-5"
        >
            <ItemCard
                type="Melees"
                items={items.filter((item) => item.type === "melee")}
                handleItemEditTrigger={handleItemEditTrigger}
            />
            <WeaponCard
                weapons={items.filter((item) => item.type === "weapon")}
                handleItemEditTrigger={handleItemEditTrigger}
            />
            <ItemCard
                type="Utilities"
                items={items.filter((item) => item.type === "utility")}
                handleItemEditTrigger={handleItemEditTrigger}
            />
            {editDialogActive && (
                <ItemEditorDialog
                    item={currentItemToEdit}
                    isNew={itemIsNew}
                    editDialogActive={editDialogActive}
                    setEditDialogActive={setEditDialogActive}
                />
            )}
        </div>
    );
}

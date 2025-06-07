"use client";

import { FlashcardSelect, ItemInsert, ItemSelect, Mission } from "@/types";
import { useState } from "react";
import ItemEditorDialog from "./ItemEditorDialog";
import WeaponCard from "./WeaponCard";
import { MethodIDToDisplayText } from "@/utils/FormattingUtils";
import UtilitiesCard from "./UtilitiesCard";
import MeleeCard from "./MeleeCard";
import Flashcards from "./Flashcards";

export default function Items({
    items,
    flashcards,
    mission,
}: {
    items: ItemSelect[];
    flashcards: FlashcardSelect[];
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
        <div className="flex w-full flex-row-reverse flex-wrap justify-center gap-3 px-2 sm:gap-5 sm:px-3">
            <Flashcards flashcards={flashcards} mission={mission} />
            <div
                id="item-card-wrapper"
                className="flex flex-1 flex-col items-center justify-start gap-3 sm:gap-5"
            >
                <MeleeCard
                    melees={items.filter((item) => item.type === "melee")}
                    handleItemEditTrigger={handleItemEditTrigger}
                />
                <WeaponCard
                    weapons={items.filter((item) => item.type === "weapon")}
                    handleItemEditTrigger={handleItemEditTrigger}
                />
                <UtilitiesCard
                    utilities={items.filter((item) => item.type === "utility")}
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
        </div>
    );
}

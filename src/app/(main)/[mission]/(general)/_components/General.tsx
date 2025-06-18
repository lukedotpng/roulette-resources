"use client";

import {
    ItemInsert,
    ItemSelect,
    ItemType,
    Mission,
    TimingsFlashcardSelect,
} from "@/types";
import { useState } from "react";
import ItemEditorDialog from "./ItemEditorDialog";
import WeaponCard from "./WeaponCard";
import { MethodIDToDisplayText } from "@/utils/FormattingUtils";
import UtilitiesCard from "./UtilitiesCard";
import MeleeCard from "./MeleeCard";
import TimingsCard from "./TimingsCard";

export default function Items({
    items,
    timingsFlashcard,
    mission,
}: {
    items: ItemSelect[];
    timingsFlashcard: TimingsFlashcardSelect | undefined;
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

    function handleItemEditTrigger(
        item: ItemSelect | string,
        isNew: boolean,
        type: ItemType,
    ) {
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
                type: type,
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
        <section className="px-3 sm:px-5 md:columns-2">
            <TimingsCard
                timingsFlashcard={timingsFlashcard}
                mission={mission}
            />
            <MeleeCard
                melees={items.filter((item) => item.type === "melee")}
                handleItemEditTrigger={(item: ItemSelect, isNew: boolean) =>
                    handleItemEditTrigger(item, isNew, "melee")
                }
            />
            <WeaponCard
                weapons={items.filter((item) => item.type === "weapon")}
                handleItemEditTrigger={(
                    item: ItemSelect | string,
                    isNew: boolean,
                ) => handleItemEditTrigger(item, isNew, "weapon")}
            />
            <UtilitiesCard
                utilities={items.filter((item) => item.type === "utility")}
                handleItemEditTrigger={(
                    item: ItemSelect | string,
                    isNew: boolean,
                ) => handleItemEditTrigger(item, isNew, "utility")}
            />
            {editDialogActive && (
                <ItemEditorDialog
                    item={currentItemToEdit}
                    isNew={itemIsNew}
                    editDialogActive={editDialogActive}
                    setEditDialogActive={setEditDialogActive}
                />
            )}
        </section>
    );
}

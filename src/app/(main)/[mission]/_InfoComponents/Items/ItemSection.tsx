"use client";

import { ItemInsert, ItemSelect, ItemType, Mission } from "@/types";
import { use, useState } from "react";
import ItemEditorDialog from "../../_EditorComponents/ItemEditorDialog";
import WeaponCard from "./WeaponCard";
import { MethodIDToDisplayText } from "@/utils/FormattingUtils";
import UtilitiesCard from "./UtilitiesCard";
import MeleeCard from "./MeleeCard";

export default function ItemSection({
    mission,
    itemsPromise,
}: {
    mission: Mission;
    itemsPromise: Promise<ItemSelect[]>;
}) {
    // ITEMS
    let items = use(itemsPromise);
    items = items.sort((a, b) => (a.name >= b.name ? 1 : -1));

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

    function HandleItemEditTrigger(
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
        <section className="flex w-full flex-col justify-center gap-2.5 px-2 sm:px-5">
            <h1 className="border-b-2 border-white text-[1.2em] font-bold">
                {"Items"}
            </h1>
            <div className="flex flex-wrap justify-center gap-2.5">
                <MeleeCard
                    melees={items.filter((item) => item.type === "melee")}
                    HandleItemEditTrigger={(item: ItemSelect, isNew: boolean) =>
                        HandleItemEditTrigger(item, isNew, "melee")
                    }
                    className="h-fit w-full min-w-[20rem] flex-1 break-inside-avoid overflow-y-scroll rounded-xl border-4 border-zinc-500 bg-white p-2 text-zinc-900"
                />
                <WeaponCard
                    weapons={items.filter((item) => item.type === "weapon")}
                    HandleItemEditTrigger={(
                        item: ItemSelect | string,
                        isNew: boolean,
                    ) => HandleItemEditTrigger(item, isNew, "weapon")}
                    className="h-fit w-full min-w-[20rem] flex-1 break-inside-avoid overflow-y-scroll rounded-xl border-4 border-zinc-500 bg-white p-2 text-zinc-900"
                />
                <UtilitiesCard
                    utilities={items.filter((item) => item.type === "utility")}
                    HandleItemEditTrigger={(
                        item: ItemSelect | string,
                        isNew: boolean,
                    ) => HandleItemEditTrigger(item, isNew, "utility")}
                    className="h-fit w-full min-w-[20rem] flex-1 break-inside-avoid overflow-y-scroll rounded-xl border-4 border-zinc-500 bg-white p-2 text-zinc-900"
                />
            </div>
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

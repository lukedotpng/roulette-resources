import { Item } from "@/types";

export default function Items({ items }: { items: Item[] }) {
    return (
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
    );
}

function ItemCard({ type, items }: { type: string; items: Item[] }) {
    if (items.length === 0) {
        return null;
    }

    return (
        <div className="h-fit w-80 bg-white p-3 text-sm text-zinc-900 sm:w-80 sm:text-base md:w-96 md:text-base">
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
                                <sub className="italic">Hitmaps</sub>
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

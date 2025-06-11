import { DisguiseSelect, DisguiseVideoSelect } from "@/types";

import DisguiseVideo from "./DisguiseVideo";

export default function DisguiseCard({
    disguise,
    SetEditDialogActive,
}: {
    disguise: DisguiseSelect;
    SetEditDialogActive: (
        updatedEditDialogActive: boolean,
        isNew: boolean,
        disguiseVideo: DisguiseVideoSelect,
    ) => void;
}) {
    const disguiseVideos = [...disguise.disguiseVideoSchema];
    disguiseVideos.sort((a, b) => a.id.localeCompare(b.id));

    return (
        <div className="w-80 rounded-xl border-4 border-zinc-500 bg-white p-2 text-zinc-900 sm:w-[25rem] md:w-[30rem] md:p-5 lg:w-[35rem]">
            <div className="flex flex-col gap-2">
                {disguise.hitmaps_link && (
                    <p className="font-bold">
                        {"Free Disguise - "}
                        <a href={disguise.hitmaps_link} target="_blank">
                            <span className="italic underline">
                                {"Hitmaps"}
                            </span>
                        </a>
                    </p>
                )}
                {disguise.notes && <p>{disguise.notes}</p>}
                <div className="flex flex-col gap-2 md:gap-5">
                    {disguiseVideos.map((disguiseVideo) => (
                        <DisguiseVideo
                            key={disguiseVideo.id}
                            disguiseVideo={disguiseVideo}
                            SetEditDialogActive={SetEditDialogActive}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

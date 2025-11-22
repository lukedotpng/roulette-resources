import { DisguiseSelect, DisguiseVideoSelect, Mission } from "@/types";

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
        <div className="w-full rounded-xl border-4 border-zinc-500 bg-white p-2 text-zinc-900 md:p-3">
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
                <div className="flex flex-row flex-wrap items-center justify-center gap-2">
                    {disguiseVideos.map((disguiseVideo) => (
                        <DisguiseVideo
                            key={disguiseVideo.id}
                            mission={disguise.mission as Mission}
                            disguiseVideo={disguiseVideo}
                            SetEditDialogActive={SetEditDialogActive}
                        />
                    ))}
                    {/* {disguiseVideos.length % 2 !== 0 && (
                        <div className="flex-1"></div>
                    )} */}
                </div>
            </div>
        </div>
    );
}

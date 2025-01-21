"use client";

import { Disguise } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Disguises({ disguises }: { disguises: Disguise[] }) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [activeDisguiseId, setActiveDisguiseId] = useState(
        searchParams.get("disguise") ?? disguises[0].disguise_id,
    );
    const [activeDisguise, setActiveDisguise] = useState(disguises[0]);

    useEffect(() => {
        for (const disguise of disguises) {
            if (disguise.disguise_id === activeDisguiseId) {
                setActiveDisguise(disguise);
            }
        }
    }, [activeDisguiseId, activeDisguise]);

    return (
        <section className="flex gap-5 text-xl">
            <ul className="h-96 overflow-scroll">
                {disguises.map((disguise) => (
                    <li key={disguise.disguise_id}>
                        <button
                            data-active={
                                disguise.disguise_id === activeDisguiseId
                            }
                            className="w-full bg-white px-4 py-3 text-left text-zinc-900 hover:bg-red-500 hover:text-white data-[active=true]:border-l-8 data-[active=true]:border-red-500 data-[active=true]:pl-2"
                            onClick={() => {
                                setActiveDisguiseId(disguise.disguise_id);
                                router.replace(
                                    `?disguise=${disguise.disguise_id}`,
                                );
                            }}
                        >
                            {disguise.name}
                        </button>
                    </li>
                ))}
            </ul>
            <div className="text-2xl">
                <DisguiseCard disguise={activeDisguise} />
            </div>
        </section>
    );
}

function DisguiseCard({ disguise }: { disguise: Disguise }) {
    return (
        <div className="bg-white p-5 text-zinc-900">
            {disguise.hitmaps_link !== "" ? (
                <a
                    href={disguise.hitmaps_link}
                    target="_blank"
                    className="font-bold underline"
                >
                    {disguise.name}
                </a>
            ) : (
                <p className="font-bold">{disguise.name}</p>
            )}

            <div className="flex flex-col">
                {disguise.notes && (
                    <p className="text-base">{disguise.notes}</p>
                )}
                <div className="flex w-[560px] flex-col gap-5">
                    {disguise.video_links.map((link) => {
                        const youtubeIdRegex =
                            /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/; // Regex found from on stack overflow https://stackoverflow.com/a/8260383

                        const videoIdMatch = link.match(youtubeIdRegex);
                        if (videoIdMatch === null || videoIdMatch.length < 8) {
                            return;
                        }

                        const videoId = videoIdMatch[7];

                        return (
                            <iframe
                                className="first:pt-5"
                                key={link}
                                width="560"
                                height="315"
                                src={`https://www.youtube.com/embed/${videoId}`}
                                allow="clipboard-write; picture-in-picture"
                                allowFullScreen
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

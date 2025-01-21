"use client";

import { Isolation, IsolationsGroup } from "@/types";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Isolations({
    targets,
    isolationsGroup,
}: {
    targets: readonly string[];
    isolationsGroup: IsolationsGroup;
}) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [activeTargetId, setActiveTargetId] = useState(
        searchParams.get("target") ?? targets[0],
    );
    const [activeIsolations, setActiveIsolations] = useState<Isolation[]>(
        isolationsGroup[targets[0]],
    );

    useEffect(() => {
        for (const target of targets) {
            if (target === activeTargetId) {
                setActiveIsolations(isolationsGroup[target]);
            }
        }
    }, [activeTargetId, activeIsolations]);

    return (
        <section className="flex gap-5 text-xl">
            <nav>
                <ul>
                    {targets.map((target) => (
                        <li key={target}>
                            <button
                                data-active={target === activeTargetId}
                                className="w-full bg-white px-4 py-3 text-left text-zinc-900 hover:bg-red-500 hover:text-white data-[active=true]:border-l-8 data-[active=true]:border-red-500 data-[active=true]:pl-2"
                                onClick={() => {
                                    setActiveTargetId(target);
                                    router.replace(`?target=${target}`);
                                }}
                            >
                                {TargetIDToDisplayText(target)}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="flex flex-col gap-2 text-2xl">
                {activeIsolations.map((isolation, index) => (
                    <IsolationCard key={index} isolation={isolation} />
                ))}
            </div>
        </section>
    );
}

function IsolationCard({ isolation }: { isolation: Isolation }) {
    const link = isolation.video_link;
    const youtubeIdRegex =
        /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/; // Regex found from on stack overflow https://stackoverflow.com/a/8260383

    const videoIdMatch = link.match(youtubeIdRegex);
    if (videoIdMatch === null || videoIdMatch.length < 8) {
        return;
    }

    const videoId = videoIdMatch[7];

    return (
        <div className="max-w-[600px] bg-white p-3 text-zinc-900">
            <div className="flex flex-col gap-2 text-base">
                <p className="text-xl font-bold">{isolation.name}</p>
                <p>
                    <strong>Starts: </strong>
                    {isolation.starts}
                </p>
                <p>
                    <strong>Requires: </strong>
                    {isolation.requires}
                </p>
                <p>
                    <strong>Timings: </strong>
                    {isolation.timings}
                </p>
                {isolation.notes && (
                    <p>
                        <strong>Notes: </strong>
                        {isolation.notes}
                    </p>
                )}
                <a
                    className="font-bold underline"
                    href={isolation.video_link}
                    target="_blank"
                >
                    Watch video here
                </a>
                <div className="flex w-[560px] flex-col gap-5">
                    {/* <iframe
                        className="first:pt-5"
                        key={link}
                        width="560"
                        height="315"
                        src={`https://www.youtube.com/embed/${videoId}`}
                        allow="clipboard-write; picture-in-picture"
                        allowFullScreen
                    /> */}
                </div>
            </div>
        </div>
    );
}
function TargetIDToDisplayText(target: string) {
    let targetDisplayText = "";
    const words = target.split("_");

    for (const word of words) {
        targetDisplayText += word.charAt(0).toUpperCase() + word.slice(1) + " ";
    }

    return targetDisplayText;
}

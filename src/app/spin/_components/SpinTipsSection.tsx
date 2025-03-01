import { MethodIDToDisplayText, TargetIDToDisplayText } from "@/lib/SpinUtils";
import { Mission, SpinResources, TargetSpinResources } from "@/types";
import Link from "next/link";
import useSWR from "swr";

export default function SpinTipsSection({
    query,
    mission,
}: {
    query: string;
    mission: Mission;
}) {
    const fetcher = (url: string) => fetch(url).then((res) => res.json());
    const { data, error, isLoading } = useSWR(
        "/api/spin/info?s=" + query,
        fetcher,
    );

    if (isLoading) {
        return (
            <section className="text-white">
                <h2 className="text-center text-2xl">{"Finding help..."}</h2>
            </section>
        );
    }

    if (error) {
        return (
            <section className="text-white">
                <h2 className="bg-white text-center text-2xl">
                    {"Error loading data...probably your fault :/"}
                </h2>
            </section>
        );
    }

    let lastMethodShown = "";

    console.log(data);

    return (
        <section className="flex w-full flex-wrap justify-center gap-3 text-xs text-zinc-900 sm:text-base">
            {(Object.keys(data) as (keyof TargetSpinResources)[]).map(
                (target) => (
                    <div
                        key={target}
                        className="h-fit max-w-[30rem] bg-white px-4 py-2"
                    >
                        <h2 className="text-[1.2em] font-bold">
                            {`${TargetIDToDisplayText(target)}:`}
                        </h2>
                        {(data[target] as SpinResources).items.length > 0 &&
                            (data[target] as SpinResources).items.map(
                                (item) => {
                                    return (
                                        <div
                                            key={item.name}
                                            className="flex flex-col py-1"
                                        >
                                            <h2 className="self-center text-[1.1em] font-bold underline decoration-red-500 decoration-2">
                                                {"Method"}
                                            </h2>
                                            <div>
                                                {item.hitmaps_link ? (
                                                    <a
                                                        href={item.hitmaps_link}
                                                        target="_blank"
                                                        className="font-bold underline"
                                                    >
                                                        {item.name}
                                                    </a>
                                                ) : (
                                                    <p className="inline font-bold">
                                                        {item.name}
                                                    </p>
                                                )}
                                                <span>{`: ${item.quick_look}`}</span>
                                            </div>
                                        </div>
                                    );
                                },
                            )}
                        {/* Disguises */}
                        {(data[target] as SpinResources).disguises.length > 0 &&
                            (data[target] as SpinResources).disguises.map(
                                (disguise) => {
                                    console.log(disguise.quick_look);

                                    const firstSeperatorIndex =
                                        disguise.quick_look.indexOf("|");
                                    console.log(
                                        disguise.id,
                                        firstSeperatorIndex,
                                    );
                                    let disguiseQuickLookName = "";
                                    if (firstSeperatorIndex === -1) {
                                        disguiseQuickLookName =
                                            disguise.quick_look;
                                    } else {
                                        disguiseQuickLookName = `${disguise.quick_look.slice(0, firstSeperatorIndex - 1)}`;
                                    }

                                    return (
                                        <div
                                            key={disguise.id}
                                            className="flex flex-col py-1"
                                        >
                                            <Link
                                                href={`/${mission}/disguises?disguise=${disguise.id}`}
                                                target="_blank"
                                                className="self-center text-[1.1em] font-bold underline decoration-red-500 decoration-2"
                                            >
                                                {"Disguise"}
                                            </Link>
                                            <div>
                                                {disguise.hitmaps_link ? (
                                                    <a
                                                        href={
                                                            disguise.hitmaps_link
                                                        }
                                                        target="_blank"
                                                        className="font-bold underline"
                                                    >
                                                        {disguiseQuickLookName}
                                                    </a>
                                                ) : (
                                                    <p className="inline font-bold">
                                                        {disguiseQuickLookName}
                                                    </p>
                                                )}
                                                {firstSeperatorIndex !== -1 && (
                                                    <span>{`: ${disguise.quick_look.slice(disguise.quick_look.indexOf("|") + 1)}`}</span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                },
                            )}
                        {/* Unique Kills */}
                        {(data[target] as SpinResources).uniqueKills.length >
                            0 &&
                            (data[target] as SpinResources).uniqueKills.map(
                                (method) => {
                                    if (!method) {
                                        return null;
                                    }

                                    const printMethodTitle =
                                        lastMethodShown !==
                                        method.kill_method + method.target;

                                    lastMethodShown =
                                        method.kill_method + method.target;

                                    return (
                                        <div key={method.id} className="py-1">
                                            <div
                                                key={method.id}
                                                className="flex flex-col py-1"
                                            >
                                                {printMethodTitle && (
                                                    <Link
                                                        href={`/${mission}/unique_kills?target=${target}`}
                                                        target="_blank"
                                                        className="self-center text-[1.1em] font-bold underline decoration-red-500 decoration-2"
                                                    >
                                                        {`${MethodIDToDisplayText(
                                                            method.kill_method,
                                                        )}`}
                                                    </Link>
                                                )}
                                                {method.name && (
                                                    <p className="font-bold">
                                                        {method.name}
                                                    </p>
                                                )}
                                                <ul className="list-disc px-5">
                                                    {method.starts && (
                                                        <li>
                                                            <strong>
                                                                Starts:{" "}
                                                            </strong>
                                                            {method.starts}
                                                        </li>
                                                    )}
                                                    {method.requires && (
                                                        <li>
                                                            <strong>
                                                                Requires:{" "}
                                                            </strong>
                                                            {method.requires}
                                                        </li>
                                                    )}
                                                    {method.timings && (
                                                        <li>
                                                            <strong>
                                                                Timings:{" "}
                                                            </strong>
                                                            {method.timings}
                                                        </li>
                                                    )}
                                                    {method.notes && (
                                                        <li>
                                                            <strong>
                                                                Notes:{" "}
                                                            </strong>
                                                            {method.notes}
                                                        </li>
                                                    )}
                                                    {method.video_link && (
                                                        <a
                                                            className="w-fit font-bold underline"
                                                            href={
                                                                method.video_link
                                                            }
                                                            target="_blank"
                                                        >
                                                            Watch video here
                                                        </a>
                                                    )}
                                                </ul>
                                                <span></span>
                                            </div>
                                        </div>
                                    );
                                },
                            )}
                    </div>
                ),
            )}
        </section>
    );
}

"use client";

import { Isolation, Mission, Target } from "@/types";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import IsolationEditorDialog from "./IsolationEditorDialog";
import IsolationCard from "./IsolationCard";

export default function Isolations({
    targets,
    mission,
    isolations,
}: {
    targets: readonly Target[];
    mission: Mission;
    isolations: Isolation[];
}) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const session = useSession();

    const [activeTargetId, setActiveTargetId] = useState<Target>(
        (searchParams.get("target") as Target) ?? targets[0],
    );

    const [editDialogActive, setEditDialogActive] = useState(false);
    const [createNewIsolation, setCreateNewIsolation] = useState(false);
    const [currentIsolationToEdit, setCurrentIsolationToEdit] =
        useState<Isolation>({
            id: "",
            target: "",
            map: mission,
            name: "New Isolation",
            requires: "",
            starts: "",
            timings: "",
            notes: "",
            video_link: "",
            visible: true,
        });

    function handleIsolationEditTrigger(isolation: Isolation, isNew: boolean) {
        setCreateNewIsolation(isNew);
        setEditDialogActive(true);
        setCurrentIsolationToEdit(isolation);
    }

    return (
        <section className="flex flex-col items-center gap-5 text-sm sm:text-lg md:flex-row md:items-start md:text-xl">
            <DropdownMenu modal={false}>
                <div className="flex flex-col">
                    <Image
                        src={`/targets/${activeTargetId}.webp`}
                        width={693}
                        height={517}
                        alt={TargetIDToDisplayText(activeTargetId)}
                        className="hidden w-60 border-4 border-b-0 border-white md:block"
                    />
                    <DropdownMenuTrigger asChild>
                        <button className="group flex h-fit w-60 items-center justify-between bg-white px-4 py-1 text-left text-zinc-900 group-data-[active=true]:border-l-8 group-data-[active=true]:border-red-500 group-data-[active=true]:pl-2 group-data-[state=open]:bg-red-500 group-data-[state=open]:text-white hover:bg-red-500 hover:text-white sm:py-3">
                            <p>{TargetIDToDisplayText(activeTargetId)}</p>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 320 512"
                                className="h-4 w-4 fill-zinc-900 group-hover:fill-white group-data-[state=open]:rotate-90 group-data-[state=open]:fill-white"
                            >
                                {/* Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2024 Fonticons, Inc. */}
                                <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
                            </svg>
                        </button>
                    </DropdownMenuTrigger>
                </div>
                <DropdownMenuContent
                    className="z-10 flex w-60 flex-col overflow-scroll shadow-lg shadow-black"
                    onCloseAutoFocus={(event: Event) => {
                        event.preventDefault();
                    }}
                >
                    {targets.map((target) => {
                        return (
                            <div key={target}>
                                <Image
                                    src={`/targets/${target}.webp`}
                                    width={693}
                                    height={517}
                                    quality={50}
                                    priority
                                    alt={TargetIDToDisplayText(target)}
                                    aria-hidden="true"
                                    className="invisible absolute h-0"
                                ></Image>
                                <DropdownMenuItem
                                    data-active={target === activeTargetId}
                                    className="w-full bg-white px-4 py-3 text-left text-zinc-900 hover:bg-red-500 hover:text-white data-[active=true]:border-l-8 data-[active=true]:border-red-500 data-[active=true]:pl-2"
                                    onClick={() => {
                                        setActiveTargetId(target);
                                        router.replace(`?disguise=${target}`);
                                    }}
                                >
                                    {TargetIDToDisplayText(target)}
                                </DropdownMenuItem>
                            </div>
                        );
                    })}
                </DropdownMenuContent>
            </DropdownMenu>
            <div className="flex flex-col gap-2 text-xs sm:text-sm md:text-base">
                {isolations.map((isolation, index) => {
                    if (
                        activeTargetId !== isolation.target ||
                        isolation.visible === false
                    ) {
                        return null;
                    }
                    return (
                        <IsolationCard
                            key={index}
                            isolation={isolation}
                            handleIsolationEditTrigger={
                                handleIsolationEditTrigger
                            }
                        />
                    );
                })}
                {session.data?.user?.admin && (
                    <button
                        className="w-full bg-white p-3 text-zinc-900 hover:bg-red-500 hover:text-white"
                        onClick={() =>
                            handleIsolationEditTrigger(
                                {
                                    id: "",
                                    target: activeTargetId,
                                    map: mission,
                                    name: "New Isolation",
                                    requires: "",
                                    starts: "",
                                    timings: "",
                                    notes: "",
                                    video_link: "",
                                    visible: true,
                                },
                                true,
                            )
                        }
                    >
                        Add New Isolation
                    </button>
                )}
            </div>
            {editDialogActive && (
                <IsolationEditorDialog
                    isolation={currentIsolationToEdit}
                    isNew={createNewIsolation}
                    editDialogActive={editDialogActive}
                    setEditDialogActive={setEditDialogActive}
                />
            )}
        </section>
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

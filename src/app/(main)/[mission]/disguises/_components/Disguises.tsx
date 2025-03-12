"use client";

import { Disguise } from "@/types";

import Image from "next/image";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import DisguiseCard from "./DisguiseCard";
import DisguiseVideoEditorDialog from "./DisguiseVideoEditorDialog";
import { DisguiseIDToDisplayText } from "@/lib/FormattingUtils";
import { useSession } from "next-auth/react";

export default function Disguises({ disguises }: { disguises: Disguise[] }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const session = useSession();

    const [activeDisguiseId, setActiveDisguiseId] = useState(
        searchParams.get("disguise") ?? disguises[0].id,
    );
    const [activeDisguise, setActiveDisguise] = useState(disguises[0]);

    const [editDialogActive, setEditDialogActive] = useState(false);

    useEffect(() => {
        for (const disguise of disguises) {
            if (disguise.id === activeDisguiseId) {
                setActiveDisguise(disguise);
            }
        }
    }, [activeDisguiseId, activeDisguise, disguises]);

    return (
        <section className="flex flex-col items-center gap-5 text-sm sm:flex-row sm:items-start sm:text-base md:text-xl">
            <DropdownMenu modal={false}>
                <div className="flex flex-col">
                    <Image
                        src={`/disguises/${activeDisguise.id}.webp`}
                        width={693}
                        height={517}
                        quality={50}
                        priority
                        alt={DisguiseIDToDisplayText(activeDisguise.id)}
                        className="hidden w-60 border-4 border-b-0 border-white sm:block"
                    />
                    <DropdownMenuTrigger asChild>
                        <button className="group flex h-fit w-60 items-center justify-between bg-white px-4 py-1 text-left text-zinc-900 group-data-[active=true]:border-l-8 group-data-[active=true]:border-red-500 group-data-[active=true]:pl-2 group-data-[state=open]:bg-red-500 group-data-[state=open]:text-white hover:bg-red-500 hover:text-white sm:py-3">
                            <p>{DisguiseIDToDisplayText(activeDisguise.id)}</p>
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
                    className="flex h-96 w-60 flex-col overflow-scroll shadow-lg shadow-black"
                    onCloseAutoFocus={(event: Event) => {
                        event.preventDefault();
                    }}
                >
                    {disguises.map((disguise) => {
                        return (
                            <div key={disguise.id}>
                                <Image
                                    src={`/disguises/${disguise.id}.webp`}
                                    width={693}
                                    height={517}
                                    quality={50}
                                    alt={DisguiseIDToDisplayText(disguise.id)}
                                    aria-hidden="true"
                                    className="invisible absolute h-0"
                                ></Image>
                                <DropdownMenuItem
                                    data-active={
                                        disguise.id === activeDisguiseId
                                    }
                                    className="w-full bg-white px-4 py-3 text-left text-zinc-900 hover:bg-red-500 hover:text-white data-[active=true]:border-l-8 data-[active=true]:border-red-500 data-[active=true]:pl-2"
                                    onClick={() => {
                                        setActiveDisguiseId(disguise.id);
                                        router.replace(
                                            `?disguise=${disguise.id}`,
                                        );
                                    }}
                                >
                                    {DisguiseIDToDisplayText(disguise.id)}
                                </DropdownMenuItem>
                            </div>
                        );
                    })}
                </DropdownMenuContent>
            </DropdownMenu>
            <div className="text-xs sm:text-sm md:text-base">
                <DisguiseCard disguise={activeDisguise} />
                {session.data?.user?.admin && (
                    <button
                        className="mt-1 w-full rounded-b-lg bg-white p-3 text-zinc-900 hover:bg-red-500 hover:text-white"
                        onClick={() => setEditDialogActive(true)}
                    >
                        Add New Video
                    </button>
                )}
            </div>
            {editDialogActive && (
                <DisguiseVideoEditorDialog
                    disguise={activeDisguise}
                    editDialogActive={editDialogActive}
                    setEditDialogActive={setEditDialogActive}
                />
            )}
        </section>
    );
}

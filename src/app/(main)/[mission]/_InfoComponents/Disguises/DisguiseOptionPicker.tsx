import { Mission } from "@/types";
import { DisguiseIDToDisplayText } from "@/utils/FormattingUtils";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import Image from "next/image";

export default function DisguiseOptionPicker({
    mission,
    activeDisguise,
    disguiseList,
    SetActiveDisguise,
}: {
    mission: Mission;
    activeDisguise: string;
    disguiseList: string[];
    SetActiveDisguise: (option: string) => void;
}) {
    return (
        <DropdownMenu modal={true}>
            <div className="flex w-full flex-col rounded-lg border-4 border-zinc-500">
                <Image
                    src={`/disguises/${mission}-${activeDisguise}.webp`}
                    width={693}
                    height={517}
                    quality={50}
                    priority
                    alt={DisguiseIDToDisplayText(activeDisguise)}
                    className="hidden w-full rounded-sm border-white md:block"
                />
                <DropdownMenuTrigger asChild>
                    <button className="group flex h-fit w-full items-center justify-between rounded-sm bg-white px-2 py-1 text-left text-zinc-900 group-data-[active=true]:border-l-8 group-data-[active=true]:border-red-500 group-data-[active=true]:pl-2 group-data-[state=open]:bg-red-500 group-data-[state=open]:text-white hover:bg-red-500 hover:text-white md:rounded-t-none md:rounded-b-sm">
                        <p>{DisguiseIDToDisplayText(activeDisguise)}</p>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 320 512"
                            className="h-3 w-3 fill-zinc-900 group-hover:fill-white group-data-[state=open]:rotate-90 sm:h-4 sm:w-4"
                        >
                            {/* Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2024 Fonticons, Inc. */}
                            <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
                        </svg>
                    </button>
                </DropdownMenuTrigger>
            </div>
            <DropdownMenuContent
                className="z-20 flex h-fit max-h-72 w-48 flex-col overflow-y-auto rounded-lg border-2 border-zinc-500 text-[.9em] shadow-[0_0_20px_0px] shadow-black"
                onCloseAutoFocus={(event: Event) => {
                    event.preventDefault();
                }}
            >
                {disguiseList.map((disguise, index) => {
                    return (
                        <div
                            key={disguise}
                            data-last={index === disguiseList.length - 1}
                            data-first={index === 0}
                            className="group relative"
                        >
                            <Image
                                src={`/disguises/${mission}-${disguise}.webp`}
                                width={693}
                                height={517}
                                quality={50}
                                priority
                                alt={DisguiseIDToDisplayText(disguise)}
                                aria-hidden="true"
                                className="invisible absolute h-0"
                            />
                            <DropdownMenuItem
                                data-active={disguise === activeDisguise}
                                className="border-t-1 border-zinc-900 bg-white p-1 text-zinc-900 group-first:border-t-0 hover:bg-red-500 hover:text-white"
                                onClick={() => {
                                    SetActiveDisguise(disguise);
                                }}
                            >
                                {DisguiseIDToDisplayText(disguise)}
                            </DropdownMenuItem>
                        </div>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

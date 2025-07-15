"use client";

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ImageDropdown({
    activeOption,
    optionImageRootPath,
    optionImagePrefix,
    optionList,
    optionQueryKey,
    SetActiveOption,
    OptionFormatter,
}: {
    activeOption: string;
    optionImageRootPath: string;
    optionImagePrefix?: string;
    optionList: string[] | readonly string[];
    optionQueryKey: string;
    SetActiveOption: (option: string) => void;
    OptionFormatter: (option: string) => string;
}) {
    const router = useRouter();

    return (
        <DropdownMenu modal={true}>
            <div className="flex w-full flex-col">
                <Image
                    src={`${optionImageRootPath}/${optionImagePrefix || ""}${activeOption}.webp`}
                    width={693}
                    height={517}
                    quality={50}
                    priority
                    alt={OptionFormatter(activeOption)}
                    className="hidden w-60 border-4 border-b-0 border-white md:block"
                />
                <DropdownMenuTrigger asChild>
                    <button className="group flex h-fit w-60 items-center justify-between bg-white px-4 py-1 text-left text-zinc-900 group-data-[active=true]:border-l-8 group-data-[active=true]:border-red-500 group-data-[active=true]:pl-2 group-data-[state=open]:bg-red-500 group-data-[state=open]:text-white hover:bg-red-500 hover:text-white">
                        <p>{OptionFormatter(activeOption)}</p>
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
                className="z-20 flex h-fit max-h-96 w-60 flex-col overflow-y-auto rounded-b-lg shadow-lg shadow-black"
                onCloseAutoFocus={(event: Event) => {
                    event.preventDefault();
                }}
            >
                <div className="pointer-events-none absolute top-0 z-10 h-2 w-full bg-gradient-to-b from-zinc-900/50 to-transparent"></div>
                {optionList.map((option, index) => {
                    return (
                        <div
                            key={option}
                            data-last={index === optionList.length - 1}
                            className="group relative"
                        >
                            <Image
                                src={`${optionImageRootPath}/${optionImagePrefix || ""}${activeOption}.webp`}
                                width={693}
                                height={517}
                                quality={50}
                                alt={OptionFormatter(option)}
                                aria-hidden="true"
                                className="invisible absolute h-0"
                            />
                            <DropdownMenuItem
                                data-active={option === activeOption}
                                className="w-full cursor-pointer bg-white px-4 py-3 text-left text-zinc-900 outline-none group-data-[last=true]:rounded-b-lg hover:bg-red-500 hover:text-white data-[active=true]:border-l-8 data-[active=true]:border-red-500 data-[active=true]:pl-2"
                                onClick={() => {
                                    SetActiveOption(option);
                                    router.push(
                                        `?${optionQueryKey}=${option}`,
                                        { scroll: false },
                                    );
                                }}
                            >
                                {OptionFormatter(option)}
                            </DropdownMenuItem>
                        </div>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

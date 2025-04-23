import { SpinOptions } from "@/types";
import Image from "next/image";
import { useState, useRef } from "react";

export default function TargetSpinCardRow({
    title,
    info,
    imageSrc,
    HandleSpinUpdate,
    EditSpin,
    LockCondition,
    conditionLocked,
    options,
}: {
    title: string;
    info: string;
    imageSrc: string;
    HandleSpinUpdate: () => void;
    EditSpin: () => void;
    LockCondition: () => void;
    conditionLocked: boolean;
    options: SpinOptions;
}) {
    const [spinAnimationActive, setSpinAnimationActive] = useState(false);

    const respinAnimationTimeout = useRef<NodeJS.Timeout>(undefined);

    function HandleSpinAnmition() {
        setSpinAnimationActive(true);

        clearTimeout(respinAnimationTimeout.current);
        respinAnimationTimeout.current = setTimeout(() => {
            setSpinAnimationActive(false);
        }, 150);
    }
    return (
        <div className="flex h-[50%] items-center justify-between border-t-[1px] border-white bg-zinc-900">
            <div className="mr-2 flex h-full w-full items-center justify-between">
                <div className="px-1">
                    <p className="text-[.75em] font-bold underline decoration-red-500 decoration-1 sm:text-[.85em] sm:decoration-2 md:text-[.95em]">
                        {title}
                    </p>
                    <h1 className="text-[0.95em] font-bold sm:text-[1.1em] md:text-[1.3em]">
                        {info}
                    </h1>
                </div>
                {!options.matchMode.val &&
                    !conditionLocked &&
                    (options.manualMode.val ? (
                        <button
                            className="w-4 fill-white hover:fill-red-500 sm:w-6"
                            onClick={EditSpin}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512"
                            >
                                {/* Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2024 Fonticons, Inc. */}
                                <path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152L0 424c0 48.6 39.4 88 88 88l272 0c48.6 0 88-39.4 88-88l0-112c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 112c0 22.1-17.9 40-40 40L88 464c-22.1 0-40-17.9-40-40l0-272c0-22.1 17.9-40 40-40l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24L88 64z" />
                            </svg>
                        </button>
                    ) : (
                        <button
                            className="w-4 fill-white hover:fill-red-500 data-[animationactive=true]:animate-[spin_300ms_linear_infinite] sm:w-6"
                            data-animationactive={spinAnimationActive}
                            onClick={() => {
                                HandleSpinUpdate();
                                HandleSpinAnmition();
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512"
                            >
                                {/* Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2024 Fonticons, Inc. */}
                                <path d="M105.1 202.6c7.7-21.8 20.2-42.3 37.8-59.8c62.5-62.5 163.8-62.5 226.3 0L386.3 160 352 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l111.5 0c0 0 0 0 0 0l.4 0c17.7 0 32-14.3 32-32l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 35.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5zM39 289.3c-5 1.5-9.8 4.2-13.7 8.2c-4 4-6.7 8.8-8.1 14c-.3 1.2-.6 2.5-.8 3.8c-.3 1.7-.4 3.4-.4 5.1L16 432c0 17.7 14.3 32 32 32s32-14.3 32-32l0-35.1 17.6 17.5c0 0 0 0 0 0c87.5 87.4 229.3 87.4 316.7 0c24.4-24.4 42.1-53.1 52.9-83.8c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.5 62.5-163.8 62.5-226.3 0l-.1-.1L125.6 352l34.4 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L48.4 288c-1.6 0-3.2 .1-4.8 .3s-3.1 .5-4.6 1z" />
                            </svg>
                        </button>
                    ))}
            </div>
            <div className="relative aspect-[693/517] h-full w-12 border-l-[1px] border-white sm:w-20 sm:border-l-2">
                <Image
                    src={imageSrc}
                    alt={title ?? "No Disguise"}
                    width={693}
                    height={517}
                    quality={10}
                    className="h-full w-full object-cover"
                />
                {!options.matchMode.val && (
                    <button
                        className="group absolute right-0 bottom-0 flex h-full w-full flex-col items-center justify-end fill-white p-1 hover:fill-red-500 data-[conditionlocked=true]:opacity-65 data-[conditionlocked=true]:hover:opacity-100"
                        onClick={() => {
                            LockCondition();
                        }}
                        data-conditionlocked={conditionLocked}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 576 512"
                            className="block w-4 self-end group-data-[conditionlocked=true]:hidden sm:w-6"
                        >
                            {/* Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2024 Fonticons, Inc. */}
                            <path d="M352 144c0-44.2 35.8-80 80-80s80 35.8 80 80l0 48c0 17.7 14.3 32 32 32s32-14.3 32-32l0-48C576 64.5 511.5 0 432 0S288 64.5 288 144l0 48L64 192c-35.3 0-64 28.7-64 64L0 448c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-192c0-35.3-28.7-64-64-64l-32 0 0-48z" />
                        </svg>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 448 512"
                            className="hidden w-10 stroke-black stroke-3 group-data-[conditionlocked=true]:block sm:w-10"
                        >
                            {/* Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2024 Fonticons, Inc. */}
                            <path d="M144 144l0 48 160 0 0-48c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192l0-48C80 64.5 144.5 0 224 0s144 64.5 144 144l0 48 16 0c35.3 0 64 28.7 64 64l0 192c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 256c0-35.3 28.7-64 64-64l16 0z" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
}

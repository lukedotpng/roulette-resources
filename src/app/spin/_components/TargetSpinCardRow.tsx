import { SpinTarget, SpinUpdateAction } from "@/types";
import Image from "next/image";
import { useState, useRef } from "react";

export default function TargetSpinCardRow({
    title,
    info,
    target,
    imageSrc,
    HandleSpinUpdate,
    spinUpdateAction,
}: {
    title: string;
    info: string;
    target: SpinTarget;
    imageSrc: string;
    HandleSpinUpdate: (target: SpinTarget, action: SpinUpdateAction) => void;
    spinUpdateAction: SpinUpdateAction;
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
            <div className="mr-2 flex w-full items-center justify-between">
                <div className="px-1">
                    <p className="text-[.75em] font-bold underline decoration-red-500 decoration-1 sm:text-[.85em] sm:decoration-2 md:text-[.95em]">
                        {title}
                    </p>
                    <h1 className="text-[0.95em] font-bold sm:text-[1.1em] md:text-[1.3em]">
                        {info}
                    </h1>
                </div>
                <button
                    className="aspect-square h-full"
                    onClick={() => {
                        HandleSpinUpdate(target, spinUpdateAction);
                        HandleSpinAnmition();
                    }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        data-animationactive={spinAnimationActive}
                        className="w-4 fill-white data-[animationactive=true]:animate-[spin_300ms_linear_infinite] sm:w-6"
                    >
                        {/* Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2024 Fonticons, Inc. */}
                        <path d="M105.1 202.6c7.7-21.8 20.2-42.3 37.8-59.8c62.5-62.5 163.8-62.5 226.3 0L386.3 160 352 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l111.5 0c0 0 0 0 0 0l.4 0c17.7 0 32-14.3 32-32l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 35.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5zM39 289.3c-5 1.5-9.8 4.2-13.7 8.2c-4 4-6.7 8.8-8.1 14c-.3 1.2-.6 2.5-.8 3.8c-.3 1.7-.4 3.4-.4 5.1L16 432c0 17.7 14.3 32 32 32s32-14.3 32-32l0-35.1 17.6 17.5c0 0 0 0 0 0c87.5 87.4 229.3 87.4 316.7 0c24.4-24.4 42.1-53.1 52.9-83.8c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.5 62.5-163.8 62.5-226.3 0l-.1-.1L125.6 352l34.4 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L48.4 288c-1.6 0-3.2 .1-4.8 .3s-3.1 .5-4.6 1z" />
                    </svg>
                </button>
            </div>

            <Image
                src={imageSrc}
                alt={title ?? "No Disguise"}
                width={693}
                height={517}
                quality={10}
                className="aspect-[693/517] h-full w-12 border-l-[1px] border-white object-cover sm:w-20 sm:border-l-2"
            />
        </div>
    );
}

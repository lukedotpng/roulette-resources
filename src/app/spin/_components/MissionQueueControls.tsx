export default function MissionQueueControls({
    GenerateNextSpin,
    GeneratePreviousSpin,
    RegenerateSpin,
}: {
    GenerateNextSpin: () => void;
    GeneratePreviousSpin: () => void;
    RegenerateSpin: () => void;
}) {
    return (
        <div className="flex items-center gap-1">
            <button
                className="group h-8 w-10 bg-white hover:bg-red-500 sm:h-10 sm:w-16"
                onClick={GeneratePreviousSpin}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                    className="h-full w-full fill-zinc-900 p-2 group-hover:fill-white"
                >
                    {/* Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2024 Fonticons, Inc. */}
                    <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
                </svg>
            </button>
            <button
                className="h-8 w-32 bg-white font-bold text-zinc-900 hover:bg-red-500 hover:text-white sm:h-10 sm:w-40"
                onClick={RegenerateSpin}
            >
                Respin
            </button>
            <button
                className="group h-8 w-10 bg-white hover:bg-red-500 sm:h-10 sm:w-16"
                onClick={GenerateNextSpin}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                    className="h-full w-full fill-zinc-900 p-2 group-hover:fill-white"
                >
                    {/* Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2024 Fonticons, Inc. */}
                    <path
                        xmlns="http://www.w3.org/2000/svg"
                        d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"
                    />
                </svg>
            </button>
        </div>
    );
}

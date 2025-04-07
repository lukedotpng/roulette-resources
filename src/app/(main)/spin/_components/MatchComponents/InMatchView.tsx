import { RefObject } from "react";

export default function InMatchView({
    OnSpinFinished,
    OnSpinCancel,
    matchTimerRef,
}: {
    OnSpinFinished: () => void;
    OnSpinCancel: () => void;
    matchTimerRef: RefObject<HTMLParagraphElement | null>;
}) {
    return (
        <div className="flex h-full w-full">
            <button
                onClick={OnSpinFinished}
                className="group flex h-full w-full flex-col items-center justify-center border-r-[.75rem] border-zinc-800"
            >
                <p
                    className="font-mono text-[1.4em] font-bold"
                    ref={matchTimerRef}
                ></p>
                <p className="text-[1.2em] font-bold underline decoration-transparent decoration-2 group-hover:decoration-red-500">
                    {"Done"}
                </p>
            </button>
            <button
                onClick={OnSpinCancel}
                className="w-8 text-[1.3em] font-bold hover:bg-red-500 hover:text-white"
            >
                {"X"}
            </button>
        </div>
    );
}

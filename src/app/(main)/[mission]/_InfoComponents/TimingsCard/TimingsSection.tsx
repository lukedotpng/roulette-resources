"use client";

import { Mission, TimingsFlashcardSelect } from "@/types";
import { use } from "react";
import TimingsCard from "./TimingsCard";

export default function TimingsCardSection({
    mission,
    timingsFlashcardPromise,
}: {
    mission: Mission;
    timingsFlashcardPromise: Promise<TimingsFlashcardSelect | undefined>;
}) {
    // TIMINGS FLASHCARD
    const timingsFlashcard = use(timingsFlashcardPromise);

    return (
        <section className="flex w-full flex-col justify-center gap-2.5 px-2 sm:px-5">
            <h1 className="border-b-2 border-white text-[1.5em] font-bold">
                {"Timings"}
            </h1>
            <TimingsCard
                mission={mission}
                timingsFlashcard={timingsFlashcard}
            />
        </section>
    );
}

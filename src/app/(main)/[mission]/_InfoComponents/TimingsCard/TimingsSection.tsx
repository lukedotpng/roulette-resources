"use client";

import { Mission, TimingsFlashcardSelect } from "@/types";
import { use } from "react";
import TimingsCard from "./TimingsCard";
import { useSession } from "next-auth/react";

export default function TimingsCardSection({
    mission,
    timingsFlashcardPromise,
}: {
    mission: Mission;
    timingsFlashcardPromise: Promise<TimingsFlashcardSelect | undefined>;
}) {
    // TIMINGS FLASHCARD
    const timingsFlashcard = use(timingsFlashcardPromise);

    const session = useSession();

    if (timingsFlashcard === undefined && !session.data?.user?.admin) {
        return null;
    }

    return (
        <section className="flex w-full flex-col justify-center gap-2.5 px-2 sm:px-5">
            <h1 className="border-b-2 border-white text-[1.2em] font-bold">
                {"Timings"}
            </h1>
            <TimingsCard
                mission={mission}
                timingsFlashcard={timingsFlashcard}
            />
        </section>
    );
}

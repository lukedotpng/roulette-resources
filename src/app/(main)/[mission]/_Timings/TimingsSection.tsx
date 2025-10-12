"use client";

import { Mission, TimingsFlashcardSelect } from "@/types";
import TimingsCard from "./TimingsCard";
import { useSession } from "next-auth/react";
import InfoSection from "../_components/InfoSection";

export default function TimingsCardSection({
    mission,
    timingsFlashcard,
}: {
    mission: Mission;
    timingsFlashcard: TimingsFlashcardSelect | undefined;
}) {
    const session = useSession();

    if (timingsFlashcard === undefined && !session.data?.user?.admin) {
        return null;
    }

    return (
        <InfoSection id="timings">
            <h1 className="border-b-2 border-white text-[1.2em] font-bold">
                {"Timings"}
            </h1>
            <TimingsCard
                mission={mission}
                timingsFlashcard={timingsFlashcard}
            />
        </InfoSection>
    );
}

import { FlashcardInsert, FlashcardSelect, Mission } from "@/types";
import { MISSION_TARGET_LIST } from "@/utils/globals";
import { useSession } from "next-auth/react";
import TargetFlashcard from "./TargetFlashcard";

export default function Flashcards({
    flashcards,
    mission,
}: {
    flashcards: FlashcardSelect[];
    mission: Mission;
}) {
    const session = useSession();

    const targets = mission === "berlin" ? [] : MISSION_TARGET_LIST[mission];

    if (flashcards.length === 0 && !session.data?.user?.admin) {
        return null;
    }

    return (
        <div className="flex flex-1 flex-col items-center justify-start gap-3 sm:gap-5">
            {targets.map((target) => {
                const targetFlashcard = flashcards.find(
                    (fc: FlashcardSelect) => {
                        return fc.target === target;
                    },
                );

                if (
                    targetFlashcard === undefined &&
                    !session.data?.user?.admin
                ) {
                    return;
                }

                const templateFlashcard: FlashcardInsert = {
                    mission: mission,
                    target: target,
                    info: "",
                };

                return (
                    <TargetFlashcard
                        key={target}
                        flashcard={
                            targetFlashcard === undefined
                                ? templateFlashcard
                                : targetFlashcard
                        }
                        isDefined={targetFlashcard !== undefined}
                    />
                );
            })}
        </div>
    );
}

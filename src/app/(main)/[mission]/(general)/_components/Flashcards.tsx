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

    const targets = MISSION_TARGET_LIST[mission];

    return (
        <div className="flex w-full flex-wrap justify-center gap-3 px-5 sm:gap-5">
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

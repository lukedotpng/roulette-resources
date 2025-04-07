import { Mission } from "@/types";
import { MissionIDToDisplayText } from "@/utils/FormattingUtils";

export default function QueueList({
    queueIndex,
    UpdateQueueIndex,
    missionQueue,
}: {
    queueIndex: number;
    UpdateQueueIndex: (index: number) => void;
    missionQueue: Mission[];
}) {
    if (missionQueue.length === 0) {
        return;
    }
    const prevMission = queueIndex > 0 ? missionQueue[queueIndex - 1] : null;
    const currentMission = missionQueue[queueIndex];
    const nextMission =
        queueIndex < missionQueue.length - 1
            ? missionQueue[queueIndex + 1]
            : null;

    return (
        <section className="flex h-5 w-full max-w-[48rem] justify-center gap-1 sm:h-8 sm:gap-2">
            {prevMission ? (
                <button
                    onClick={() => {
                        UpdateQueueIndex(queueIndex - 1);
                    }}
                    className="relative h-4 w-20 self-end text-right text-[.8em] text-white sm:h-6 sm:w-28"
                >
                    {MissionIDToDisplayText(prevMission)}
                </button>
            ) : (
                <div className="h-4 w-20 self-end sm:h-6 sm:w-28"></div>
            )}
            <p className="h-full px-2 font-bold text-white">
                {MissionIDToDisplayText(currentMission)}
            </p>
            {nextMission ? (
                <button
                    onClick={() => {
                        UpdateQueueIndex(queueIndex + 1);
                    }}
                    className="h-4 w-20 self-end text-left text-[.8em] text-white sm:h-6 sm:w-28"
                >
                    {MissionIDToDisplayText(nextMission)}
                </button>
            ) : (
                <div className="h-4 w-20 self-end sm:h-6 sm:w-28"></div>
            )}
        </section>
    );
}

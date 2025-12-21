import { MillisecondsToTimeString } from "@/utils/FormattingUtils";
import { useEffect, useRef } from "react";

export default function DefaultThemeTimer({
    startTime,
    showSpinTimer,
}: {
    startTime: number;
    showSpinTimer: boolean;
}) {
    const intervalRef = useRef<NodeJS.Timeout>(null);

    const exactTime = useRef<number>(null);
    const matchTimerRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        if (!showSpinTimer) {
            exactTime.current = Date.now() - startTime;
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            return;
        }

        exactTime.current = null;
        // Time in ms
        const intervalTime = 100;
        const id = setInterval(() => {
            exactTime.current = Date.now() - startTime;

            if (matchTimerRef.current) {
                if (startTime < 0 || exactTime.current < 0) {
                    matchTimerRef.current.innerHTML = "00:00";
                } else {
                    matchTimerRef.current.innerHTML = MillisecondsToTimeString(
                        exactTime.current,
                        false,
                    );
                }
            }
        }, intervalTime);
        intervalRef.current = id;

        return () => {
            clearInterval(id);
        };
    }, [showSpinTimer, startTime]);

    if (!showSpinTimer) {
        return;
    }

    return (
        <p
            ref={matchTimerRef}
            className="h-10 w-full border-t-2 border-white bg-zinc-900 text-center font-mono text-4xl font-bold text-white"
        >
            {"00:00"}
        </p>
    );
}

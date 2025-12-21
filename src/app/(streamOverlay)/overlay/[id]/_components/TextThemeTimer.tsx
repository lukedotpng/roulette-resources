import { MillisecondsToTimeString } from "@/utils/FormattingUtils";
import { useEffect, useRef } from "react";

export default function TextThemeTimer({
    startTime,
    showSpinTimer,
}: {
    startTime: number;
    showSpinTimer: boolean;
}) {
    const intervalRef = useRef<NodeJS.Timeout>(null);

    const exactTime = useRef<number>(null);
    const matchTimerRef = useRef<HTMLElement>(null);

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
        <p>
            <span>{"[ "}</span>
            <span ref={matchTimerRef}>{"00:00"}</span>
            <span>{" ]"}</span>
        </p>
    );
}

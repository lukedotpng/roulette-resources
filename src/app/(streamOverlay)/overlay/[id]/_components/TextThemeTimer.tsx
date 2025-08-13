import { MillisecondsToTimeString } from "@/utils/FormattingUtils";
import { useEffect, useRef } from "react";

export default function TextThemeTimer({
    startTime,
    matchActive,
}: {
    startTime: number;
    matchActive: boolean;
}) {
    const intervalRef = useRef<NodeJS.Timeout>(null);

    const exactTime = useRef<number>(null);
    const matchTimerRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        if (startTime === -1) {
            return;
        }

        if (!matchActive) {
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
            if (startTime > -1) {
                exactTime.current = Date.now() - startTime;

                if (matchTimerRef.current) {
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
    }, [matchActive, startTime]);

    if (startTime === -1) {
        return;
    }

    return (
        <div className="w-full pr-2">
            <p ref={matchTimerRef} className="text-right font-mono">
                {"00:00"}
            </p>
        </div>
    );
}

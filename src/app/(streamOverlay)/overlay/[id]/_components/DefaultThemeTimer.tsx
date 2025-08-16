import { MillisecondsToTimeString } from "@/utils/FormattingUtils";
import { useEffect, useRef } from "react";

export default function DefaultThemeTimer({
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

    if (startTime === -1 || !matchActive) {
        return;
    }

    return (
        <div className="absolute right-0 -bottom-[50px] flex h-[50px] w-[1300px] items-center justify-center bg-zinc-900">
            <p ref={matchTimerRef} className="font-mono text-4xl text-white">
                {"00:00"}
            </p>
        </div>
    );
}

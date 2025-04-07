import { useState, useRef, useEffect } from "react";

export default function CountdownText({
    active,
    OnCountdownEnd,
}: {
    active: boolean;
    OnCountdownEnd: () => void;
}) {
    useEffect(() => {
        if (active) {
            OnTimerStart();
        }
    }, [active]);

    const [countdownTime, setCountdownTime] = useState(3000);
    const intervalRef = useRef<NodeJS.Timeout>(null);

    function OnTimerStart() {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        setCountdownTime(3000);
        let intervalLoops = 0;
        const id = setInterval(() => {
            const currentCountdownTime = 3000 - 250 * intervalLoops;
            intervalLoops++;

            if (currentCountdownTime < 0) {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                }
                OnCountdownEnd();
            }
            setCountdownTime(currentCountdownTime);
        }, 250);
        intervalRef.current = id;
    }

    return (
        <div className="flex w-full items-center justify-center text-[1.5em] font-bold">
            <span
                data-active={countdownTime <= 3000 && countdownTime > 2000}
                className="data-[active=false]:opacity-50"
            >
                {"3"}
            </span>
            <span
                data-active={countdownTime <= 2750 && countdownTime > 2000}
                className="data-[active=false]:opacity-50"
            >
                {"."}
            </span>
            <span
                data-active={countdownTime <= 2500 && countdownTime > 2000}
                className="data-[active=false]:opacity-50"
            >
                {"."}
            </span>
            <span
                data-active={countdownTime <= 2250 && countdownTime > 2000}
                className="data-[active=false]:opacity-50"
            >
                {"."}
            </span>
            <span
                data-active={countdownTime <= 2000 && countdownTime > 1000}
                className="data-[active=false]:opacity-50"
            >
                {"2"}
            </span>
            <span
                data-active={countdownTime <= 1750 && countdownTime > 1000}
                className="data-[active=false]:opacity-50"
            >
                {"."}
            </span>
            <span
                data-active={countdownTime <= 1500 && countdownTime > 1000}
                className="data-[active=false]:opacity-50"
            >
                {"."}
            </span>
            <span
                data-active={countdownTime <= 1250 && countdownTime > 1000}
                className="data-[active=false]:opacity-50"
            >
                {"."}
            </span>
            <span
                data-active={countdownTime <= 1000 && countdownTime > 100}
                className="data-[active=false]:opacity-50"
            >
                {"1"}
            </span>
            <span
                data-active={countdownTime <= 750 && countdownTime > 100}
                className="data-[active=false]:opacity-50"
            >
                {"."}
            </span>
            <span
                data-active={countdownTime <= 500 && countdownTime > 100}
                className="data-[active=false]:opacity-50"
            >
                {"."}
            </span>
            <span
                data-active={countdownTime <= 250 && countdownTime > 100}
                className="data-[active=false]:opacity-50"
            >
                {"."}
            </span>
            <span
                data-active={countdownTime <= 100}
                className="data-[active=false]:opacity-50"
            >
                {"Go!"}
            </span>
        </div>
    );
}

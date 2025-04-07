import { useEffect, useRef, useState } from "react";
import CountdownText from "./CountdownText";
import { Spin, SpinOptions } from "@/types";
import { MillisecondsToTimeString } from "@/utils/FormattingUtils";
import PreMatchView from "./PreMatchView";
import InMatchView from "./InMatchView";
import PostMatchView from "./PostMatchView";
import { CreateSpinQuery } from "../../utils/SpinQueryUtils";
import { UpdateSpinOverlayMatchStatus } from "@/app/(streamOverlay)/OverlayActions";

export default function MatchTimerSection({
    matchActive,
    currentSpin,
    StartMatch,
    StopMatch,
    overlayId,
    overlayKey,
    options,
}: {
    matchActive: boolean;
    currentSpin: Spin;
    StartMatch: () => void;
    StopMatch: () => void;
    overlayId: string;
    overlayKey: number;
    options: SpinOptions;
}) {
    const [countdownActive, setCountdownActive] = useState(false);
    const [spinFinished, setSpinFinished] = useState(false);

    const startTime = useRef<number>(null);
    const exactTime = useRef<number>(null);

    const matchTimerRef = useRef<HTMLParagraphElement>(null);
    const intervalRef = useRef<NodeJS.Timeout>(null);

    function OnStartMatch() {
        StartMatch();
        setCountdownActive(false);
    }

    function OnSpinFinished() {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        if (startTime.current) {
            exactTime.current = Date.now() - startTime.current;
        }

        setSpinFinished(true);

        const query = CreateSpinQuery(currentSpin);

        UpdateSpinOverlayMatchStatus(overlayId, overlayKey, query, false);

        if (!exactTime.current) {
            console.error("ERROR SAVING TIME");
            return;
        }

        const updatedSimRecords =
            options.simRecords.val.length > 0
                ? [...options.simRecords.val]
                : [];
        updatedSimRecords.push({
            mission: currentSpin.mission,
            spinId: CreateSpinQuery(currentSpin),
            time: exactTime.current,
            date: Date.now(),
        });
        options.simRecords.Set(updatedSimRecords);
    }

    function OnSpinCancel() {
        StopMatch();
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        setSpinFinished(false);
        setCountdownActive(false);
    }

    useEffect(() => {
        if (!matchActive) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            setSpinFinished(false);
            setCountdownActive(false);
            return;
        }

        startTime.current = Date.now();
        exactTime.current = null;
        // Time in ms
        const intervalTime = 10;
        const id = setInterval(() => {
            if (startTime.current) {
                exactTime.current = Date.now() - startTime.current;

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
    }, [matchActive]);

    return (
        <section className="flex h-16 w-full max-w-[48rem] items-center justify-center bg-white text-zinc-900 sm:h-20">
            {/* BEFORE MATCH STARTS */}
            {!matchActive && !countdownActive && !spinFinished && (
                <PreMatchView OnReady={() => setCountdownActive(true)} />
            )}
            {/* MATCH STARTING COUNTDOWN */}
            {!matchActive && countdownActive && !spinFinished && (
                <CountdownText
                    active={countdownActive}
                    OnCountdownEnd={OnStartMatch}
                />
            )}
            {/* DURING MATCH */}
            {matchActive && !countdownActive && !spinFinished && (
                <InMatchView
                    OnSpinFinished={OnSpinFinished}
                    OnSpinCancel={OnSpinCancel}
                    matchTimerRef={matchTimerRef}
                />
            )}
            {/* POST MATCH */}
            {spinFinished && (
                <PostMatchView
                    time={exactTime.current ?? 0}
                    spin={currentSpin}
                    simRecords={options.simRecords.val}
                />
            )}
        </section>
    );
}

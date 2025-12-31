import { useEffect, useRef, useState } from "react";
import CountdownText from "./CountdownText";
import { MillisecondsToTimeString } from "@/utils/FormattingUtils";
import PreMatchView from "./PreMatchView";
import InMatchView from "./InMatchView";
import PostMatchView from "./PostMatchView";
import { SpinManager } from "../../types";
import { CreateSpinQuery } from "@/lib/RouletteSpinner/queryParser";
import { UpdateOverlay } from "../../utils/OverlayUtils";

export default function MatchTimerSection({
    spinManager,
}: {
    spinManager: SpinManager;
}) {
    const [countdownActive, setCountdownActive] = useState(false);
    const [spinFinished, setSpinFinished] = useState(false);

    const startTime = useRef<number>(null);
    const exactTime = useRef<number>(null);

    const matchTimerRef = useRef<HTMLParagraphElement>(null);
    const intervalRef = useRef<NodeJS.Timeout>(null);

    function OnStartMatch() {
        spinManager.StartMatch();
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

        // Should never happen but who knows
        if (spinManager.currentSpin === null) {
            return;
        }

        const spinQuery = CreateSpinQuery(spinManager.currentSpin);

        UpdateOverlay({
            id: spinManager.options.streamOverlay.id,
            key: spinManager.options.streamOverlay.key,
            spin_query: spinQuery,
            show_spin_timer: false,
        });

        if (!exactTime.current) {
            console.error("ERROR SAVING TIME");
            return;
        }

        const updatedSimRecords =
            spinManager.matchModeManager.simRecords.length > 0
                ? [...spinManager.matchModeManager.simRecords]
                : [];
        updatedSimRecords.push({
            mission: spinManager.currentSpin.mission,
            spinId: spinQuery,
            time: exactTime.current,
            date: Date.now(),
        });
        spinManager.matchModeManager.SetSimRecords(updatedSimRecords);
    }

    function OnSpinCancel() {
        spinManager.StopMatch();
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        setSpinFinished(false);
        setCountdownActive(false);
    }

    useEffect(() => {
        if (!spinManager.matchModeManager.matchActive) {
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
    }, [spinManager.matchModeManager.matchActive]);

    useEffect(() => {
        setCountdownActive(false);
    }, [spinManager.currentSpin, spinManager.spinMode]);

    return (
        <section className="flex h-16 w-full max-w-[48rem] items-center justify-center bg-white text-zinc-900 sm:h-20">
            {/* BEFORE MATCH STARTS */}
            {!spinManager.matchModeManager.matchActive &&
                !countdownActive &&
                !spinFinished && (
                    <PreMatchView OnReady={() => setCountdownActive(true)} />
                )}
            {/* MATCH STARTING COUNTDOWN */}
            {!spinManager.matchModeManager.matchActive &&
                countdownActive &&
                !spinFinished && (
                    <CountdownText
                        active={countdownActive}
                        OnCountdownEnd={OnStartMatch}
                    />
                )}
            {/* DURING MATCH */}
            {spinManager.matchModeManager.matchActive &&
                !countdownActive &&
                !spinFinished && (
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
                    spin={spinManager.currentSpin}
                    simRecords={spinManager.matchModeManager.simRecords}
                />
            )}
        </section>
    );
}

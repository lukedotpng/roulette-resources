import { Missions } from "@/utils/globals";
import { useLocalState } from "@/utils/useLocalState";
import { MatchSimRecord, Mission, Spin, SpinOptions } from "@/types";
import { useState } from "react";
import { GenerateSpin } from "./utils/SpinGenerationUtils";

export function useSpinOptions(
    currentSpin: Spin | null,
    setCurrentSpin: (spin: Spin | null) => void,
) {
    // Options
    const [missionPool, setMissionPool] = useLocalState<Mission[]>(
        "pool",
        Missions,
    );
    function SetMissionPool(updatedPool: Mission[]) {
        setMissionPool(updatedPool);
    }
    const [missionQueue, setMissionQueue] = useLocalState<Mission[]>(
        "queue",
        [],
    );
    function SetMissionQueue(updatedQueue: Mission[]) {
        if (updatedQueue.length === 0) {
            setCurrentSpin(null);
        } else {
            setCurrentSpin(GenerateSpin(updatedQueue[0]));
        }
        setQueueIndex(0);
        setMissionQueue(updatedQueue);
    }
    const [queueIndex, setQueueIndex] = useLocalState("queueIndex", 0);
    function SetQueueIndex(updatedQueueIndex: number) {
        setQueueIndex(updatedQueueIndex);
    }

    const [queueMode, setQueueMode] = useLocalState("queueActive", false);
    function ToggleQueueMode() {
        const updatedQueueMode = !queueMode;

        if (updatedQueueMode) {
            if (missionQueue.length === 0) {
                setMissionQueue(Missions);
                setCurrentSpin(GenerateSpin("paris"));
            } else {
                setCurrentSpin(GenerateSpin(missionQueue[0]));
            }
            setQueueIndex(0);
        } else {
            if (!currentSpin) {
                const mission =
                    missionPool.length > 0
                        ? missionPool[
                              Math.floor(Math.random() * missionPool.length)
                          ]
                        : "paris";
                setCurrentSpin(GenerateSpin(mission));
            }
        }

        setQueueMode(updatedQueueMode);
    }
    const [matchMode, setMatchMode] = useState(false);
    function ToggleMatchMode() {
        const updatedMatchMode = !matchMode;
        setMatchMode(updatedMatchMode);
    }
    const [simRecords, setSimRecords] = useLocalState<MatchSimRecord[]>(
        "simRecords",
        [],
    );
    function SetSimRecords(updatedRecords: MatchSimRecord[]) {
        setSimRecords(updatedRecords);
    }

    const [dontRepeatMission, setDontRepeatMission] = useLocalState(
        "noRepeat",
        false,
    );
    function ToggleDontRepeatMission() {
        setDontRepeatMission(!dontRepeatMission);
    }
    const [warnForIllegalSpins, setWarnForIllegalSpins] = useLocalState(
        "warnIllegal",
        true,
    );
    function ToggleWarnForIllegalSpins() {
        setWarnForIllegalSpins(!warnForIllegalSpins);
    }
    const [showTips, setShowTips] = useLocalState("showTips", false);
    function ToggleShowTips() {
        setShowTips(!showTips);
    }
    const [layoutMode, setLayoutMode] = useLocalState("layout", "row");
    function SetLayoutMode(layoutMode: string) {
        setLayoutMode(layoutMode);
    }
    const [manualMode, setManualMode] = useState(false);
    function ToggleManualMode() {
        setManualMode(!manualMode);
    }
    const [canAlwaysEditNTKO, setCanAlwaysEditNTKO] = useState(false);
    function ToggleCanAlwaysEditNTKO() {
        setCanAlwaysEditNTKO(!canAlwaysEditNTKO);
    }
    const [showQueueList, setShowQueueList] = useLocalState("showQueue", false);
    function ToggleShowQueueList() {
        setShowQueueList(!showQueueList);
    }
    const [updateQuery, setUpdateQuery] = useLocalState("updateURL", true);
    function ToggleUpdateQuery() {
        setUpdateQuery(!updateQuery);
    }
    const [streamOverlayActive, setStreamOverlayActive] = useState(false);
    function ToggleStreamOverlayActive() {
        setStreamOverlayActive(!streamOverlayActive);
    }
    const [overlayTheme, setOverlayTheme] = useLocalState(
        "overlayTheme",
        "default",
    );
    function SetOverlayTheme(theme: string) {
        setOverlayTheme(theme);
    }

    const settings: SpinOptions = {
        missionPool: {
            val: missionPool,
            Set: SetMissionPool,
        },
        missionQueue: {
            val: missionQueue,
            Set: SetMissionQueue,
        },
        queueIndex: {
            val: queueIndex,
            Set: SetQueueIndex,
        },
        queueMode: {
            val: queueMode,
            Toggle: ToggleQueueMode,
        },
        matchMode: {
            val: matchMode,
            Toggle: ToggleMatchMode,
        },
        simRecords: {
            val: simRecords,
            Set: SetSimRecords,
        },
        dontRepeatMissions: {
            val: dontRepeatMission,
            Toggle: ToggleDontRepeatMission,
        },
        warnForIllegalSpins: {
            val: warnForIllegalSpins,
            Toggle: ToggleWarnForIllegalSpins,
        },
        showTips: { val: showTips, Toggle: ToggleShowTips },
        layoutMode: { val: layoutMode, Set: SetLayoutMode },
        manualMode: { val: manualMode, Toggle: ToggleManualMode },
        canAlwaysEditNTKO: {
            val: canAlwaysEditNTKO,
            Toggle: ToggleCanAlwaysEditNTKO,
        },
        showQueueList: { val: showQueueList, Toggle: ToggleShowQueueList },
        updateQuery: { val: updateQuery, Toggle: ToggleUpdateQuery },
        streamOverlayActive: {
            val: streamOverlayActive,
            Toggle: ToggleStreamOverlayActive,
        },
        overlayTheme: { val: overlayTheme, Set: SetOverlayTheme },
    };
    return settings;
}

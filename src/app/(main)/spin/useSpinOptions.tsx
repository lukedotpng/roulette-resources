import { Missions } from "@/utils/globals";
import { useLocalState } from "@/utils/useLocalState";
import {
    LockedTargetConditions,
    MatchSimRecord,
    Mission,
    Spin,
    SpinOptions,
    SpinTarget,
} from "@/types";
import { useState } from "react";
import { GenerateSpin } from "./utils/SpinGeneration";

export function useSpinOptions(
    currentSpin: Spin | null,
    SetCurrentSpin: (spin: Spin | null) => void,
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
            SetCurrentSpin(null);
        } else {
            SetCurrentSpin(GenerateSpin(updatedQueue[0]));
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
                SetCurrentSpin(GenerateSpin("paris"));
            } else {
                SetCurrentSpin(GenerateSpin(missionQueue[0]));
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
                SetCurrentSpin(GenerateSpin(mission));
            }
        }

        setQueueMode(updatedQueueMode);
    }
    const [matchMode, setMatchMode] = useState(false);
    function ToggleMatchMode() {
        const updatedMatchMode = !matchMode;

        if (updatedMatchMode) {
            setLockedConditions({});
        }

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

    const [lockedConditions, setLockedConditions] =
        useState<LockedTargetConditions>({});
    function SetLockedConditions(
        updatedLockedConditions: LockedTargetConditions,
    ) {
        const filteredLockedConditions: LockedTargetConditions = {};
        const targets = Object.keys(updatedLockedConditions) as SpinTarget[];
        for (const target of targets) {
            if (updatedLockedConditions[target] === undefined) {
                console.log(target);
                continue;
            }

            // Remove newly blank locked conditions
            if (
                updatedLockedConditions[target].killMethod !== "" ||
                updatedLockedConditions[target].disguise !== ""
            ) {
                filteredLockedConditions[target] =
                    updatedLockedConditions[target];
            }
        }
        setLockedConditions(filteredLockedConditions);
    }

    const [playCustomRules, setPlayCustomRules] = useLocalState(
        "playCustomRules",
        false,
    );
    function TogglePlayCustomRules() {
        setPlayCustomRules(!playCustomRules);
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
        lockedConditions: {
            val: lockedConditions,
            Set: SetLockedConditions,
        },
        playCustomRules: {
            val: playCustomRules,
            Toggle: TogglePlayCustomRules,
        },
    };
    return settings;
}

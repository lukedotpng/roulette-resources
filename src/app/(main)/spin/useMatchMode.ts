import { useState } from "react";
import { MatchModeManager, MatchSimRecord } from "./types";
import { useLocalState } from "@/utils/useLocalState";

export function useMatchModeManager(): MatchModeManager {
    const [enabled, setEnabled] = useState(false);
    function SetEnabled(updatedState: boolean) {
        setEnabled(updatedState);
    }
    const [matchActive, setMatchActive] = useState(false);
    function SetMatchActive(updatedState: boolean) {
        setMatchActive(updatedState);
    }

    const [simRecords, setSimRecords] = useLocalState<MatchSimRecord[]>(
        "simRecords",
        [],
    );
    function SetSimRecords(updatedRecords: MatchSimRecord[]) {
        setSimRecords(updatedRecords);
    }

    const matchModeManager: MatchModeManager = {
        enabled: enabled,
        SetEnabled: SetEnabled,
        matchActive: matchActive,
        SetMatchActive: SetMatchActive,
        simRecords: simRecords,
        SetSimRecords: SetSimRecords,
    };

    return matchModeManager;
}

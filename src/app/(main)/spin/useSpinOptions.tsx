import { useLocalState } from "@/utils/useLocalState";
import { useState } from "react";
import { SpinOptions, SpinTheme, OverlayTheme, StreamOverlay } from "./types";
import { InitializeSpinOverlay } from "@/app/(streamOverlay)/OverlayActions";

export function useSpinOptions(): SpinOptions {
    // General
    const [dontRepeatMission, setDontRepeatMission] = useLocalState(
        "noRepeat",
        false,
    );
    function ToggleDontRepeatMission() {
        setDontRepeatMission(!dontRepeatMission);
    }
    const [updateUrlOnSpin, setUpdateUrlOnSpin] = useLocalState(
        "updateURL",
        true,
    );
    function ToggleUpdateUrlOnSpin() {
        setUpdateUrlOnSpin(!updateUrlOnSpin);
    }
    const [canAlwaysEditNTKO, setCanAlwaysEditNTKO] = useState(false);
    function ToggleCanAlwaysEditNTKO() {
        setCanAlwaysEditNTKO(!canAlwaysEditNTKO);
    }
    const [showQueueList, setShowQueueList] = useLocalState("showQueue", false);
    function ToggleShowQueueList() {
        setShowQueueList(!showQueueList);
    }
    const [spinTheme, setSpinTheme] = useLocalState<SpinTheme>("layout", "row");
    function SetSpinTheme(spinTheme: SpinTheme) {
        setSpinTheme(spinTheme);
    }

    // Help
    const [showTips, setShowTips] = useLocalState("showTips", false);
    function ToggleShowTips() {
        setShowTips(!showTips);
    }
    const [warnForIllegalSpins, setWarnForIllegalSpins] = useLocalState(
        "warnIllegal",
        true,
    );
    function ToggleWarnForIllegalSpins() {
        setWarnForIllegalSpins(!warnForIllegalSpins);
    }

    // Stream Overlay
    const [overlayId, setOverlayId] = useLocalState(
        "overlayId",
        crypto.randomUUID(),
    );
    const [overlayKey, setOverlayKey] = useLocalState("overlayKey", Date.now());
    async function RegenerateOverlayId(newId: string, spinQuery: string) {
        setOverlayId(newId);
        const newKey = Date.now();
        setOverlayKey(newKey);
        await InitializeSpinOverlay(newId, newKey, spinQuery);
    }
    const [streamOverlayActive, setStreamOverlayActive] = useState(false);
    function ToggleStreamOverlayActive() {
        setStreamOverlayActive(!streamOverlayActive);
    }
    const [overlayTheme, setOverlayTheme] = useLocalState<OverlayTheme>(
        "overlayTheme",
        "default",
    );
    function SetOverlayTheme(newTheme: OverlayTheme) {
        setOverlayTheme(newTheme);
    }
    const streamOverlay: StreamOverlay = {
        id: overlayId,
        RegenerateId: RegenerateOverlayId,
        key: overlayKey,
        active: streamOverlayActive,
        ToggleActive: ToggleStreamOverlayActive,
        theme: overlayTheme,
        SetTheme: SetOverlayTheme,
    };

    const settings: SpinOptions = {
        dontRepeatMissions: {
            value: dontRepeatMission,
            Toggle: ToggleDontRepeatMission,
        },
        updateUrlOnSpin: {
            value: updateUrlOnSpin,
            Toggle: ToggleUpdateUrlOnSpin,
        },
        canAlwaysEditNTKO: {
            value: canAlwaysEditNTKO,
            Toggle: ToggleCanAlwaysEditNTKO,
        },
        showQueueList: { value: showQueueList, Toggle: ToggleShowQueueList },
        spinTheme: { value: spinTheme, Set: SetSpinTheme },
        // Help
        showTips: { value: showTips, Toggle: ToggleShowTips },
        warnForIllegalSpins: {
            value: warnForIllegalSpins,
            Toggle: ToggleWarnForIllegalSpins,
        },
        streamOverlay: streamOverlay,
    };
    return settings;
}

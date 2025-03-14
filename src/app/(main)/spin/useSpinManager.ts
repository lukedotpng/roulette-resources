import { Missions } from "@/lib/globals";
import {
    Mission,
    OverlayTheme,
    Spin,
    SpinSettings,
    SpinTarget,
    SpinUpdateAction,
} from "@/types";
import { useEffect, useState } from "react";
import { useSpinQuery } from "./useSpinQuery";
import {
    GenerateSpin,
    RegenerateCondition,
    RegenerateDisguise,
} from "./SpinManager";
import { GetRandomMission } from "@/lib/SpinUtils";
import { useLocalState } from "@/lib/useLocalState";
import {
    InitializeSpinOverlay,
    UpdateSpinOverlay,
} from "../../(streamOverlay)/OverlayActions";
import { CreateSpinQuery } from "@/lib/SpinQueryUtils";

export function useSpinManager() {
    const [currentSpin, setCurrentSpin] = useState<Spin>();

    const [spinLegal] = useState(false);

    // Options
    const [missionPool, setMissionPool] = useLocalState<Mission[]>(
        "pool",
        Missions,
    );
    const [queueMode, setQueueMode] = useLocalState("queueActive", false);
    const [missionQueue, setMissionQueue] = useLocalState<Mission[]>(
        "queue",
        [],
    );
    const [queueIndex, setQueueIndex] = useLocalState("queueIndex", 0);
    const [lastMissionSpun, setLastMissionSpun] = useState<Mission>();
    const [overlayId] = useLocalState("overlayId", crypto.randomUUID());

    // Settings
    const [dontRepeatMission, setDontRepeatMission] = useLocalState(
        "noRepeat",
        false,
    );
    function ToggleDontRepeatMission() {
        setDontRepeatMission(!dontRepeatMission);
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
        if (!streamOverlayActive) {
            InitializeSpinOverlay(overlayId, query);
            UpdateSpinOverlay(overlayId, query, overlayTheme);
        }
    }
    const [overlayTheme, setOverlayTheme] = useLocalState<OverlayTheme>(
        "overlayTheme",
        "default",
    );
    function SetOverlayTheme(theme: OverlayTheme) {
        setOverlayTheme(theme);
        if (streamOverlayActive) {
            UpdateSpinOverlay(overlayId, query, theme);
        }
    }

    const settings: SpinSettings = {
        dontRepeatMissions: dontRepeatMission,
        ToggleDontRepeatMissions: ToggleDontRepeatMission,
        showTips: showTips,
        ToggleShowTips: ToggleShowTips,
        layoutMode: layoutMode,
        SetLayoutMode: SetLayoutMode,
        manualMode: manualMode,
        ToggleManualMode,
        canAlwaysEditNTKO,
        ToggleCanAlwaysEditNTKO,
        showQueueList,
        ToggleShowQueueList,
        updateQuery,
        ToggleUpdateQuery,
        streamOverlayActive,
        ToggleStreamOverlayActive,
        overlayTheme,
        SetOverlayTheme,
    };

    // Utilities
    const [noMissionsSelectedAlertActive, setNoMissionsSelectedAlertActive] =
        useState(false);

    useEffect(() => {
        if (queueMode) {
            if (missionQueue.length === 0) {
                setCurrentSpin(undefined);
                setQueueIndex(0);
            } else {
                setCurrentSpin(GenerateSpin(missionQueue[0]));
            }
        }
    }, [missionQueue, setMissionQueue]);

    function GenerateRandomSpin() {
        if (missionPool.length === 0) {
            setNoMissionsSelectedAlertActive(true);

            if (!noMissionsSelectedAlertActive) {
                setTimeout(() => {
                    setNoMissionsSelectedAlertActive(false);
                }, 1500);
            }
            return;
        }

        let randomMission = GetRandomMission(missionPool);
        while (
            lastMissionSpun === randomMission &&
            dontRepeatMission &&
            missionPool.length > 1
        ) {
            randomMission = GetRandomMission(missionPool);
        }

        const spin: Spin = GenerateSpin(randomMission);

        setLastMissionSpun(spin.mission);
        setCurrentSpin(spin);
    }
    function HandleSpinUpdate(target: SpinTarget, action: SpinUpdateAction) {
        if (!currentSpin) {
            return;
        }

        if (action === "condition") {
            const res = RegenerateCondition(currentSpin, target);
            const updatedSpin = structuredClone(currentSpin);
            if (updatedSpin.info[target]) {
                updatedSpin.info[target].condition = res.condition;
                updatedSpin.info[target].ntko = res.isNoKO;
            }

            setCurrentSpin(updatedSpin);
            return;
        }
        if (action === "disguise") {
            const disguise = RegenerateDisguise(currentSpin, target);
            const updatedSpin = structuredClone(currentSpin);
            if (updatedSpin.info[target]) {
                updatedSpin.info[target].disguise = disguise;
            }
            setCurrentSpin(updatedSpin);
            return;
        }
        if (action === "toggle_ntko") {
            const updatedSpin = structuredClone(currentSpin);
            if (updatedSpin.info[target]) {
                updatedSpin.info[target].ntko = !updatedSpin.info[target].ntko;
            }
            setCurrentSpin(updatedSpin);
            return;
        }
    }
    function HandleSpinEdit(
        target: SpinTarget,
        action: SpinUpdateAction,
        newValue: string,
    ) {
        if (!currentSpin) {
            return;
        }

        if (action === "condition") {
            const updatedSpin = structuredClone(currentSpin);
            if (updatedSpin.info[target]) {
                updatedSpin.info[target].condition = newValue;
            }

            setCurrentSpin(updatedSpin);
            return;
        }
        if (action === "disguise") {
            const updatedSpin = structuredClone(currentSpin);
            if (updatedSpin.info[target]) {
                updatedSpin.info[target].disguise = newValue;
            }
            setCurrentSpin(updatedSpin);
            return;
        }
        if (action === "toggle_ntko") {
            const updatedSpin = structuredClone(currentSpin);
            if (updatedSpin.info[target]) {
                updatedSpin.info[target].ntko = !updatedSpin.info[target].ntko;
            }
            setCurrentSpin(updatedSpin);
            return;
        }
    }

    function ToggleQueueMode() {
        const updatedQueueMode = !queueMode;
        setQueueMode(updatedQueueMode);

        if (updatedQueueMode) {
            if (missionQueue.length === 0) {
                setMissionQueue(["paris"]);
                setQueueIndex(0);
                setCurrentSpin(GenerateSpin("paris"));
            } else {
                setCurrentSpin(GenerateSpin(missionQueue[0]));
            }
        }
    }

    function RegenerateSpin() {
        if (!currentSpin) {
            return;
        }
        const newSpin = GenerateSpin(currentSpin.mission);
        setCurrentSpin(newSpin);
    }
    function GenerateNextSpin() {
        const nextIndex = queueIndex + 1;
        if (nextIndex >= missionQueue.length) {
            return;
        }
        setQueueIndex(nextIndex);
        setCurrentSpin(GenerateSpin(missionQueue[nextIndex]));
    }
    function GeneratePreviousSpin() {
        const prevIndex = queueIndex - 1;
        if (prevIndex < 0) {
            return;
        }
        setQueueIndex(prevIndex);
        setCurrentSpin(GenerateSpin(missionQueue[prevIndex]));
    }
    function UpdateQueueIndex(index: number) {
        setQueueIndex(index);
        setCurrentSpin(GenerateSpin(missionQueue[index]));
    }

    function UpdateSpin(spin: Spin) {
        setCurrentSpin(spin);
    }
    const query = useSpinQuery(currentSpin, UpdateSpin, settings);

    useEffect(() => {
        if (!currentSpin && !query) {
            if (queueMode) {
                if (missionQueue.length > 0) {
                    setQueueIndex(0);
                    setCurrentSpin(GenerateSpin(missionQueue[0]));
                }
            } else if (missionPool.length === 0) {
                setCurrentSpin(
                    GenerateSpin(
                        Missions[Math.floor(Missions.length * Math.random())],
                    ),
                );
            } else {
                GenerateRandomSpin();
            }
        }

        if (!currentSpin) {
            return;
        }

        const newQuery = CreateSpinQuery(currentSpin);

        if (streamOverlayActive) {
            UpdateSpinOverlay(overlayId, newQuery, overlayTheme);
        }
    }, [currentSpin]);

    return {
        currentSpin,
        GenerateRandomSpin,
        HandleSpinUpdate,
        HandleSpinEdit,
        RegenerateSpin,
        GenerateNextSpin,
        GeneratePreviousSpin,
        UpdateQueueIndex,
        spinLegal,
        queueMode,
        ToggleQueueMode,
        missionQueue,
        setMissionQueue,
        queueIndex,
        missionPool,
        setMissionPool,
        settings,
        noMissionsSelectedAlertActive,
        query,
        overlayId,
    };
}

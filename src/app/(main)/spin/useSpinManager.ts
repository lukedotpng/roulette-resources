import { Missions } from "@/globals";
import {
    Mission,
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
import { InitializeSpinOverlay } from "../../(streamOverlay)/OverlayActions";
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
    const [queueIndex, setQueueIndex] = useState(0);
    const [lastMissionSpun, setLastMissionSpun] = useState<Mission>();
    const [overlayId, setOverlayId] = useLocalState(
        "overlayId",
        crypto.randomUUID(),
    );

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
    const [updateQuery, setUpdateQuery] = useLocalState("updateURL", true);
    function ToggleUpdateQuery() {
        setUpdateQuery(!updateQuery);
    }
    const [streamOverlayActive, setStreamOverlayActive] = useState(false);
    function ToggleStreamOverlayActive() {
        setStreamOverlayActive(!streamOverlayActive);
        if (!streamOverlayActive) {
            InitializeSpinOverlay(overlayId);
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
        updateQuery,
        ToggleUpdateQuery,
        streamOverlayActive,
        ToggleStreamOverlayActive,
    };

    // Utilities
    const [noMissionsSelectedAlertActive, setNoMissionsSelectedAlertActive] =
        useState(false);

    useEffect(() => {
        if (queueMode) {
            if (missionQueue.length === 0) {
                setMissionQueue(["paris"]);
                setQueueIndex(0);
                setCurrentSpin(GenerateSpin("paris"));
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
        if (nextIndex === missionQueue.length) {
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

    function UpdateSpin(spin: Spin) {
        setCurrentSpin(spin);
    }
    const query = useSpinQuery(currentSpin, UpdateSpin, settings);

    useEffect(() => {
        if (!currentSpin && !query) {
            if (missionPool.length === 0) {
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
            fetch(`/api/spin/overlay/${overlayId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query: newQuery }),
            });
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
        spinLegal,
        queueMode,
        ToggleQueueMode,
        missionQueue,
        setMissionQueue,
        missionPool,
        setMissionPool,
        settings,
        noMissionsSelectedAlertActive,
        query,
    };
}

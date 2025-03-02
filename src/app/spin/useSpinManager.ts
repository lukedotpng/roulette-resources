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

export function useSpinManager() {
    const [currentSpin, setCurrentSpin] = useState<Spin>(
        GenerateSpin(GetRandomMission(Missions)),
    );
    function UpdateSpin(spin: Spin) {
        setCurrentSpin(spin);
    }

    const query = useSpinQuery(currentSpin, UpdateSpin);

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

    // Settings
    const [dontRepeatMission, setDontRepeatMission] = useLocalState(
        "noRepeat",
        false,
    );
    const [showTips, setShowTips] = useLocalState("showTips", false);
    const [layoutMode, setLayoutMode] = useLocalState("layout", "row");

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
        if (action === "respin_condition") {
            const res = RegenerateCondition(currentSpin, target);
            const updatedSpin = structuredClone(currentSpin);
            if (updatedSpin.info[target]) {
                updatedSpin.info[target].condition = res.condition;
                updatedSpin.info[target].ntko = res.isNoKO;
            }

            setCurrentSpin(updatedSpin);
            return;
        }
        if (action === "respin_disguise") {
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

    function ToggleDontRepeatMission() {
        setDontRepeatMission(!dontRepeatMission);
    }
    function SetLayoutMode(layoutMode: string) {
        setLayoutMode(layoutMode);
    }
    function ToggleShowTips() {
        setShowTips(!showTips);
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

    const settings: SpinSettings = {
        dontRepeatMissions: dontRepeatMission,
        ToggleDontRepeatMissions: ToggleDontRepeatMission,
        showTips: showTips,
        ToggleShowTips: ToggleShowTips,
        layoutMode: layoutMode,
        SetLayoutMode: SetLayoutMode,
    };

    return {
        currentSpin,
        GenerateRandomSpin,
        HandleSpinUpdate,
        RegenerateSpin,
        GenerateNextSpin,
        GeneratePreviousSpin,
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

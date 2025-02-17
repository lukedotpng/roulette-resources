import { Missions } from "@/globals";
import { Mission, Spin } from "@/types";
import { useEffect, useState } from "react";
import { useSpinQuery } from "./useSpinQuery";
import { GenerateSpin } from "./SpinManager";
import { GetRandomMission } from "@/lib/SpinUtils";

export function useSpinManager() {
    const [currentSpin, setCurrentSpin] = useState<Spin>(
        GenerateSpin(GetRandomMission(Missions)),
    );
    function UpdateSpin(spin: Spin) {
        setCurrentSpin(spin);
    }

    useSpinQuery(currentSpin, UpdateSpin);

    // Options
    const [missionPool, setMissionPool] = useState<Mission[]>(Missions);
    const [queueMode, setQueueMode] = useState(false);
    const [missionQueue, setMissionQueue] = useState<Mission[]>([]);
    const [queueIndex, setQueueIndex] = useState(0);
    const [dontRepeatMission, setDontRepeatMission] = useState(false);
    const [lastMissionSpun, setLastMissionSpun] = useState<Mission>();

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
    function ToggleDontRepeatMission() {
        setDontRepeatMission(!dontRepeatMission);
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

    return {
        currentSpin,
        GenerateRandomSpin,
        RegenerateSpin,
        GenerateNextSpin,
        GeneratePreviousSpin,
        queueMode,
        ToggleQueueMode,
        missionQueue,
        setMissionQueue,
        missionPool,
        setMissionPool,
        dontRepeatMission,
        ToggleDontRepeatMission,
        noMissionsSelectedAlertActive,
    };
}

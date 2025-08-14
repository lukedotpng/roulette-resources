import { useCallback, useEffect, useState } from "react";
import { useSpinQuery } from "./useSpinQuery";
import {
    GenerateSpin,
    RegenerateDisguise,
    RegenerateKillMethod,
} from "./utils/SpinGeneration";
import { GetRandomMission } from "@/app/(main)/spin/utils/SpinUtils";
import {
    InitializeSpinOverlay,
    UpdateSpinOverlay,
    UpdateSpinOverlayMatchStatus,
} from "../../(streamOverlay)/OverlayActions";
import { CreateSpinQuery } from "@/app/(main)/spin/utils/SpinQuery";
import { useSpinOptions } from "./useSpinOptions";
import { SpinIsLegal } from "./utils/SpinCheck";
import { SPIN_MISSION_TARGETS_LIST } from "./utils/SpinGlobals";
import { useMatchModeManager } from "./useMatchMode";
import {
    LockedTargetConditions,
    Spin,
    SpinCheckResult,
    SpinManager,
    SpinMode,
    SpinTarget,
    SpinUpdateAction,
} from "./types";
import { Mission } from "@/types";
import { useLocalState } from "@/utils/useLocalState";

export function useSpinManager(): SpinManager {
    const options = useSpinOptions();
    const matchModeManager = useMatchModeManager();

    const [currentSpin, setCurrentSpin] = useState<Spin | null>(null);
    const SetCurrentSpin = useCallback(
        (updatedSpin: Spin | null) => {
            if (
                (updatedSpin !== null &&
                    currentSpin !== null &&
                    updatedSpin.mission !== currentSpin.mission) ||
                matchModeManager.enabled
            ) {
                setLockedConditions({});
            }

            setCurrentSpin(updatedSpin);
        },
        [matchModeManager.enabled],
    );

    const [spinMode, setSpinMode] = useState<SpinMode>("pool");
    function SetSpinMode(updatedSpinMode: SpinMode) {
        setSpinMode(updatedSpinMode);
    }

    const [manualMode, setManualMode] = useState(false);
    function SetManualMode(newState: boolean) {
        setManualMode(newState);
    }

    const [missionPool, setMissionPool] = useLocalState<Mission[]>("pool", []);
    function SetMissionPool(updatedMissionPool: Mission[]) {
        setMissionPool(updatedMissionPool);
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

    const [spinIsLegal, setSpinIsLegal] = useState<SpinCheckResult>({
        legal: true,
    });

    function StartMatch() {
        if (matchModeManager.enabled) {
            matchModeManager.SetMatchActive(true);
        }
    }
    function StopMatch() {
        Respin();
        matchModeManager.SetMatchActive(false);
    }

    const [noMissionsSelectedAlertActive, setNoMissionsSelectedAlertActive] =
        useState(false);
    function AlertNoMissionsInPool() {
        setNoMissionsSelectedAlertActive(true);

        if (!noMissionsSelectedAlertActive) {
            setTimeout(() => {
                setNoMissionsSelectedAlertActive(false);
            }, 1500);
        }
        return;
    }

    // General Spin Management
    function NewSpin(mission?: Mission) {
        if (missionPool.length === 0) {
            AlertNoMissionsInPool();
            return;
        }

        let missionToSpin =
            mission !== undefined ? mission : GetRandomMission(missionPool);

        while (
            mission === undefined &&
            currentSpin &&
            options.dontRepeatMissions.value &&
            missionPool.length > 1 &&
            currentSpin.mission === missionToSpin
        ) {
            missionToSpin = GetRandomMission(missionPool);
        }

        if (missionToSpin === currentSpin?.mission) {
            Respin();
            return;
        }

        const spin: Spin = GenerateSpin(missionToSpin);
        SetCurrentSpin(spin);
    }
    const Respin = useCallback(() => {
        if (currentSpin === null) {
            return;
        }

        const targetsWithLockedConditions = Object.keys(lockedConditions);

        if (targetsWithLockedConditions.length === 0) {
            const spin: Spin = GenerateSpin(currentSpin.mission);
            SetCurrentSpin(spin);
        } else {
            const targets = SPIN_MISSION_TARGETS_LIST[currentSpin.mission];
            let updatedSpin: Spin = structuredClone(currentSpin);

            for (const target of targets) {
                const lockedTargetConditions =
                    lockedConditions[target as keyof LockedTargetConditions];
                const targetKillMethodLocked =
                    lockedTargetConditions !== undefined &&
                    lockedTargetConditions.killMethod !== "";
                const targetDisguiseLocked =
                    lockedTargetConditions !== undefined &&
                    lockedTargetConditions.disguise !== "";

                if (!targetKillMethodLocked) {
                    updatedSpin = RegenerateKillMethod(updatedSpin, target);
                }
                if (!targetDisguiseLocked) {
                    updatedSpin = RegenerateDisguise(updatedSpin, target);
                }
            }

            SetCurrentSpin(updatedSpin);
        }
    }, [SetCurrentSpin, currentSpin, lockedConditions]);

    function RespinCondition(target: SpinTarget, action: SpinUpdateAction) {
        if (!currentSpin) {
            return;
        }

        if (action === "killMethod") {
            const updatedSpin = RegenerateKillMethod(currentSpin, target);
            SetCurrentSpin(updatedSpin);
            return;
        }
        if (action === "disguise") {
            const updatedSpin = RegenerateDisguise(currentSpin, target);
            SetCurrentSpin(updatedSpin);
            return;
        }
        if (action === "toggle_ntko") {
            const updatedSpin = structuredClone(currentSpin);
            if (updatedSpin.info[target]) {
                updatedSpin.info[target].ntko = !updatedSpin.info[target].ntko;
            }
            SetCurrentSpin(updatedSpin);
            return;
        }
    }

    // Editing Management
    function EditSpin(
        target: SpinTarget,
        action: SpinUpdateAction,
        newValue: string,
    ) {
        if (!currentSpin) {
            return;
        }

        if (action === "killMethod") {
            const updatedSpin = structuredClone(currentSpin);
            if (updatedSpin.info[target]) {
                updatedSpin.info[target].killMethod = newValue;
            }

            SetCurrentSpin(updatedSpin);
            return;
        }
        if (action === "disguise") {
            const updatedSpin = structuredClone(currentSpin);
            if (updatedSpin.info[target]) {
                updatedSpin.info[target].disguise = newValue;
            }
            SetCurrentSpin(updatedSpin);
            return;
        }
        if (action === "toggle_ntko") {
            const updatedSpin = structuredClone(currentSpin);
            if (updatedSpin.info[target]) {
                updatedSpin.info[target].ntko = !updatedSpin.info[target].ntko;
            }
            SetCurrentSpin(updatedSpin);
            return;
        }
    }

    // Queue Management
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
    const [queueIndex, setQueueIndex] = useState(0);
    function SetQueueIndex(updatedIndex: number) {
        setQueueIndex(updatedIndex);
        SetCurrentSpin(GenerateSpin(missionQueue[updatedIndex]));
    }

    function NextSpin() {
        const nextIndex = queueIndex + 1;
        if (nextIndex >= missionQueue.length) {
            return;
        }
        SetQueueIndex(nextIndex);
    }
    function PreviousSpin() {
        const prevIndex = queueIndex - 1;
        if (prevIndex < 0) {
            return;
        }
        SetQueueIndex(prevIndex);
    }

    const spinQuery = useSpinQuery(
        currentSpin,
        SetCurrentSpin,
        matchModeManager,
        options,
    );

    // Update overlay on spin/query or theme change
    // function UpdateOverlay() {}
    useEffect(() => {
        if (!options.streamOverlay.active) {
            return;
        }

        if (
            !matchModeManager.enabled ||
            (matchModeManager.enabled && matchModeManager.matchActive)
        ) {
            InitializeSpinOverlay(
                options.streamOverlay.id,
                options.streamOverlay.key,
                spinQuery,
            );
            UpdateSpinOverlay(
                options.streamOverlay.id,
                options.streamOverlay.key,
                spinQuery,
                options.streamOverlay.theme,
            );
        }
    }, [
        options.streamOverlay.active,
        options.streamOverlay.theme,
        options.streamOverlay.id,
        options.streamOverlay.key,
        matchModeManager.enabled,
        matchModeManager.matchActive,
        spinQuery,
    ]);

    // // Respin when match mode is enabled to prevent controlling the spin
    useEffect(() => {
        if (matchModeManager.enabled) {
            Respin();
        }
    }, [matchModeManager.enabled, Respin]);

    // // Update overlay when match is active
    useEffect(() => {
        if (!options.streamOverlay.active) {
            return;
        }

        if (!matchModeManager.enabled) {
            UpdateSpinOverlayMatchStatus(
                options.streamOverlay.id,
                options.streamOverlay.key,
                spinQuery,
                matchModeManager.enabled,
                -1,
            );
            return;
        }
        if (currentSpin) {
            if (matchModeManager.matchActive) {
                UpdateSpinOverlayMatchStatus(
                    options.streamOverlay.id,
                    options.streamOverlay.key,
                    spinQuery,
                    matchModeManager.matchActive,
                    Date.now(),
                );
            } else {
                UpdateSpinOverlayMatchStatus(
                    options.streamOverlay.id,
                    options.streamOverlay.key,
                    spinQuery,
                    matchModeManager.matchActive,
                );
            }
        }
    }, [
        currentSpin,
        spinQuery,
        matchModeManager.enabled,
        matchModeManager.matchActive,
        options.streamOverlay.active,
        options.streamOverlay.id,
        options.streamOverlay.key,
    ]);

    useEffect(() => {
        if (!currentSpin) {
            return;
        }

        const newQuery = CreateSpinQuery(currentSpin);
        setSpinIsLegal(SpinIsLegal(currentSpin));

        if (matchModeManager.enabled) {
            matchModeManager.SetMatchActive(false);
        }

        if (options.streamOverlay.active && !matchModeManager.enabled) {
            UpdateSpinOverlay(
                options.streamOverlay.id,
                options.streamOverlay.key,
                newQuery,
                options.streamOverlay.theme,
            );
        }
    }, [
        currentSpin,
        options.streamOverlay.id,
        options.streamOverlay.key,
        options.streamOverlay.active,
        options.streamOverlay.theme,
    ]);

    const spinManager: SpinManager = {
        currentSpin: currentSpin,
        spinQuery: spinQuery,
        missionPool: missionPool,
        SetMissionPool: SetMissionPool,
        noMissionsSelectedAlertActive: noMissionsSelectedAlertActive,
        missionQueue: missionQueue,
        SetMissionQueue: SetMissionQueue,
        spinMode: spinMode,
        SetSpinMode: SetSpinMode,
        manualMode: manualMode,
        SetManualMode: SetManualMode,
        NewSpin: NewSpin,
        Respin: Respin,
        RespinCondition: RespinCondition,
        NextSpin: NextSpin,
        PreviousSpin: PreviousSpin,
        queueIndex: queueIndex,
        SetQueueIndex: SetQueueIndex,
        EditSpin: EditSpin,
        lockedConditions: lockedConditions,
        SetLockedConditions: SetLockedConditions,
        spinIsLegal: spinIsLegal,
        options: options,
        matchModeManager: matchModeManager,
        StartMatch: StartMatch,
        StopMatch: StopMatch,
    };

    return spinManager;
}

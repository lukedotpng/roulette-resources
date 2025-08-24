import { useEffect, useState } from "react";
import { useSpinQuery } from "./useSpinQuery";
import {
    GenerateSpin,
    RegenerateDisguise,
    RegenerateKillMethod,
} from "./utils/SpinGeneration";
import { GenerateSpin as GenerateSeededSpin } from "./utils/SeededSpinGeneration";
import {
    GenerateRandomSeed,
    GetRandomMission,
} from "@/app/(main)/spin/utils/SpinUtils";
import {
    InitializeSpinOverlay,
    UpdateSpinOverlay,
    UpdateSpinOverlayMatchStatus,
} from "../../(streamOverlay)/OverlayActions";
import { useSpinOptions } from "./useSpinOptions";
import { SpinIsLegal } from "./utils/SpinCheck";
import { SPIN_MISSION_TARGETS_LIST } from "./utils/SpinGlobals";
import {
    LockedTargetConditions,
    MatchModeManager,
    MatchSimRecord,
    Spin,
    SpinCheckResult,
    SpinManager,
    SpinMode,
    SpinTarget,
    SpinUpdateAction,
} from "./types";
import { Mission } from "@/types";
import { useLocalState } from "@/utils/useLocalState";
import { CreateSpinQuery } from "./utils/SpinQuery";
import Rand from "rand-seed";

export function useSpinManager(): SpinManager {
    const options = useSpinOptions();

    // MATCH MODE MANAGER
    const [matchModeEnabled, setMatchModeEnabled] = useState(false);
    const [matchActive, setMatchActive] = useState(false);
    function EnableMatchMode() {
        setMatchModeEnabled(true);
    }
    function DisableMatchMode() {
        setMatchModeEnabled(false);
        setMatchActive(false);
    }
    function StartMatch() {
        if (!currentSpin) {
            return;
        }

        setMatchActive(true);

        const newSpin = GenerateSpin(currentSpin.mission);
        SetCurrentSpin(newSpin);

        if (options.streamOverlay.active) {
            UpdateSpinOverlayMatchStatus(
                options.streamOverlay.id,
                options.streamOverlay.key,
                CreateSpinQuery(newSpin),
                true,
                Date.now(),
            );
        }
    }
    function StopMatch() {
        setMatchActive(false);

        UpdateSpinOverlayMatchStatus(
            options.streamOverlay.id,
            options.streamOverlay.key,
            spinQuery.query,
            false,
        );
    }
    const [simRecords, setSimRecords] = useLocalState<MatchSimRecord[]>(
        "simRecords",
        [],
    );
    function SetSimRecords(updatedSimRecords: MatchSimRecord[]) {
        setSimRecords(updatedSimRecords);
    }
    const matchModeManager: MatchModeManager = {
        enabled: matchModeEnabled,
        matchActive: matchActive,
        EnableMatchMode: EnableMatchMode,
        DisableMatchMode: DisableMatchMode,
        StartMatch: StartMatch,
        EndMatch: StopMatch,
        simRecords: simRecords,
        SetSimRecords: SetSimRecords,
    };

    const [currentSpin, setCurrentSpin] = useState<Spin | null>(null);
    function SetCurrentSpin(updatedSpin: Spin | null) {
        setCurrentSpin(updatedSpin);
        if (updatedSpin) {
            setSpinIsLegal(SpinIsLegal(updatedSpin));

            spinQuery.UpdateQuery(updatedSpin);

            if (matchActive) {
                StopMatch();
            }
        }
    }

    const [missionPool, setMissionPool] = useLocalState<Mission[]>("pool", []);
    function SetMissionPool(updatedMissionPool: Mission[]) {
        setMissionPool(updatedMissionPool);
    }

    const spinQuery = useSpinQuery(SetCurrentSpin, options, missionPool);

    const [spinMode, setSpinMode] = useState<SpinMode>("pool");
    function SetSpinMode(updatedSpinMode: SpinMode) {
        if (updatedSpinMode !== spinMode) {
            StopMatch();
        }
        setSpinMode(updatedSpinMode);

        if (updatedSpinMode === "queue" || updatedSpinMode === "seeded_queue") {
            if (missionQueue.length > 0) {
                SetQueueIndex(0, updatedSpinMode);
            }
        }
    }

    const [manualMode, setManualMode] = useState(false);
    function SetManualMode(updatedManualMode: boolean) {
        setManualMode(updatedManualMode);
    }

    const [lockedConditions, setLockedConditions] =
        useState<LockedTargetConditions>({});
    function SetLockedConditions(
        updatedLockedConditions: LockedTargetConditions,
    ) {
        setLockedConditions(updatedLockedConditions);
    }

    const [spinIsLegal, setSpinIsLegal] = useState<SpinCheckResult>({
        legal: true,
    });

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
    function Respin() {
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
    }
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
        }
        setQueueIndex(0);
        setMissionQueue(updatedQueue);
    }
    const [queueIndex, setQueueIndex] = useState(0);
    function SetQueueIndex(updatedIndex: number, queueMode?: SpinMode) {
        setQueueIndex(updatedIndex);

        if (queueMode === undefined) {
            queueMode = spinMode;
        }

        if (queueMode === "queue") {
            SetCurrentSpin(GenerateSpin(missionQueue[updatedIndex]));
        } else if (queueMode === "seeded_queue") {
            SetCurrentSpin(seededQueueSpins[updatedIndex]);
        }
    }

    const [queueSeed, setQueueSeed] = useState(GenerateRandomSeed());
    function SetQueueSeed(updatedQueueSeed: string) {
        setQueueSeed(updatedQueueSeed);
    }

    const [seededQueueSpins, setSeededQueueSpins] = useState<Spin[]>([]);
    function SetSeededQueueSpins(updatedSeededQueueSpins: Spin[]) {
        setSeededQueueSpins([...updatedSeededQueueSpins]);
        SetCurrentSpin(updatedSeededQueueSpins[0]);
        // Call directly to avoid resetting current spin
        setQueueIndex(0);
    }
    useEffect(() => {
        const seededRandom = new Rand(queueSeed + missionQueue.length);

        const updatedSeededQueueSpins: Spin[] = [];
        for (const mission of missionQueue) {
            updatedSeededQueueSpins.push(
                GenerateSeededSpin(mission, seededRandom),
            );
        }
        SetSeededQueueSpins([...updatedSeededQueueSpins]);
    }, [queueSeed, missionQueue]);

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

    // Stream Overlay
    const [streamOverlayInitialized, setStreamOverlayInitialized] = useState({
        initialized: false,
        id: "",
    });

    useEffect(() => {
        if (!streamOverlayInitialized.initialized) {
            InitializeSpinOverlay(
                options.streamOverlay.id,
                options.streamOverlay.key,
                spinQuery.query,
            );
            setStreamOverlayInitialized({
                initialized: true,
                id: options.streamOverlay.id,
            });
        } else {
            if (streamOverlayInitialized.id !== options.streamOverlay.id) {
                InitializeSpinOverlay(
                    options.streamOverlay.id,
                    options.streamOverlay.key,
                    spinQuery.query,
                );
                setStreamOverlayInitialized({
                    initialized: true,
                    id: options.streamOverlay.id,
                });
            }
            UpdateSpinOverlay(
                options.streamOverlay.id,
                options.streamOverlay.key,
                spinQuery.query,
                options.streamOverlay.theme,
            );
        }
    }, [
        spinQuery.query,
        options.streamOverlay.id,
        options.streamOverlay.key,
        options.streamOverlay.active,
        options.streamOverlay.theme,
        streamOverlayInitialized,
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
        queueSeed: queueSeed,
        SetQueueSeed: SetQueueSeed,
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

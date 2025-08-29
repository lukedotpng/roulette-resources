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
import {
    SEASON_ONE_MISSIONS,
    SEASON_THREE_MISSIONS,
    SEASON_TWO_MISSIONS,
    SPIN_MISSION_TARGETS_LIST,
} from "./utils/SpinGlobals";
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
        setLockedConditions({});

        setMatchModeEnabled(true);
    }
    function DisableMatchMode() {
        setMatchModeEnabled(false);
        setMatchActive(false);
    }
    function StartMatch() {
        setMatchActive(true);
    }
    function StopMatch() {
        Respin();
        setMatchActive(false);
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
        if (
            !updatedSpin ||
            !currentSpin ||
            updatedSpin.mission !== currentSpin.mission
        ) {
            setLockedConditions({});
        }

        setCurrentSpin(updatedSpin);
    }
    useEffect(() => {
        if (!currentSpin) {
            return;
        }

        setSpinIsLegal(SpinIsLegal(currentSpin));

        if (matchModeEnabled) {
            setMatchActive(false);

            if (options.streamOverlay.active) {
                UpdateSpinOverlayMatchStatus(
                    options.streamOverlay.id,
                    options.streamOverlay.key,
                    spinQuery,
                    false,
                );
            }
        }

        const updatedSpinQuery = CreateSpinQuery(currentSpin);

        if (options.streamOverlay.active && !matchModeEnabled) {
            UpdateSpinOverlay(
                options.streamOverlay.id,
                options.streamOverlay.key,
                updatedSpinQuery,
                options.streamOverlay.theme,
            );
        }
    }, [currentSpin]);
    // Respin when match mode is enabled to prevent controlling the spin
    useEffect(() => {
        if (matchModeEnabled) {
            Respin();
        }
    }, [matchModeEnabled]);

    const [missionPool, setMissionPool] = useLocalState<Mission[]>("pool", []);
    function SetMissionPool(updatedMissionPool: Mission[]) {
        setMissionPool(updatedMissionPool);
    }

    const spinQuery = useSpinQuery(
        currentSpin,
        SetCurrentSpin,
        options,
        matchModeManager,
        missionPool,
    );

    const [spinMode, setSpinMode] = useState<SpinMode>("pool");
    function SetSpinMode(updatedSpinMode: SpinMode) {
        if (
            options.useSeededQueues.value === true &&
            updatedSpinMode === "queue"
        ) {
            updatedSpinMode = "seeded_queue";
        }
        setSpinMode(updatedSpinMode);
    }
    useEffect(() => {
        if (matchModeEnabled) {
            StopMatch();
        }

        if (spinMode === "queue" || spinMode === "seeded_queue") {
            if (missionQueue.length > 0) {
                setQueueIndex(0);
            }
        }

        if (spinMode === "seeded_queue") {
            if (options.canAlwaysEditNTKO.value) {
                options.canAlwaysEditNTKO.Toggle();
            }
            SetManualMode(false);
            setMatchModeEnabled(false);
        }
    }, [spinMode]);
    useEffect(() => {
        if (spinMode === "queue" || spinMode === "seeded_queue") {
            const updatedSpinMode: SpinMode = options.useSeededQueues.value
                ? "seeded_queue"
                : "queue";
            SetSpinMode(updatedSpinMode);
        }
    }, [options.useSeededQueues.value]);

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
            currentSpin !== null &&
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
    const [missionQueue, setMissionQueue] = useLocalState<Mission[]>("queue", [
        ...SEASON_ONE_MISSIONS,
        ...SEASON_TWO_MISSIONS,
        ...SEASON_THREE_MISSIONS,
    ]);
    function SetMissionQueue(updatedQueue: Mission[]) {
        if (updatedQueue.length === 0) {
            SetCurrentSpin(null);
        }
        setQueueIndex(0);
        setMissionQueue(updatedQueue);
    }
    const [queueIndex, setQueueIndex] = useState(0);
    function SetQueueIndex(updatedIndex: number) {
        setQueueIndex(updatedIndex);
    }
    const [queueSeed, setQueueSeed] = useLocalState(
        "queueSeed",
        GenerateRandomSeed(),
    );
    function SetQueueSeed(updatedQueueSeed: string) {
        setQueueSeed(updatedQueueSeed);
    }
    const [seededQueueSpins, setSeededQueueSpins] = useState<Spin[]>([]);
    function SetSeededQueueSpins(updatedSeededQueueSpins: Spin[]) {
        setSeededQueueSpins([...updatedSeededQueueSpins]);

        if (spinMode === "seeded_queue") {
            setQueueIndex(0);
        }
    }
    useEffect(() => {
        if (spinMode === "queue") {
            if (missionQueue.length > 0) {
                SetCurrentSpin(GenerateSpin(missionQueue[queueIndex]));
            } else {
                SetCurrentSpin(null);
            }
        } else if (spinMode === "seeded_queue") {
            if (missionQueue.length > 0) {
                SetCurrentSpin(seededQueueSpins[queueIndex]);
            } else {
                SetCurrentSpin(null);
            }
        }
    }, [spinMode, queueIndex, missionQueue, seededQueueSpins]);

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
        setQueueIndex(nextIndex);
    }
    function PreviousSpin() {
        const prevIndex = queueIndex - 1;
        if (prevIndex < 0) {
            return;
        }
        setQueueIndex(prevIndex);
    }

    // Stream Overlay
    const [streamOverlayInitialized, setStreamOverlayInitialized] = useState({
        initialized: false,
        id: "",
    });

    useEffect(() => {
        if (!options.streamOverlay.active) {
            return;
        }

        if (matchModeEnabled && matchActive) {
            return;
        }

        if (!streamOverlayInitialized.initialized) {
            InitializeSpinOverlay(
                options.streamOverlay.id,
                options.streamOverlay.key,
                spinQuery,
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
                    spinQuery,
                );
                setStreamOverlayInitialized({
                    initialized: true,
                    id: options.streamOverlay.id,
                });
            }
            UpdateSpinOverlay(
                options.streamOverlay.id,
                options.streamOverlay.key,
                spinQuery,
                options.streamOverlay.theme,
            );
        }
    }, [
        options.streamOverlay.id,
        options.streamOverlay.key,
        options.streamOverlay.active,
        options.streamOverlay.theme,
    ]);

    useEffect(() => {
        if (!options.streamOverlay.active) {
            return;
        }

        if (!matchModeEnabled) {
            UpdateSpinOverlayMatchStatus(
                options.streamOverlay.id,
                options.streamOverlay.key,
                spinQuery,
                false, // Match status
                -1,
            );
            return;
        }
        if (currentSpin) {
            if (matchActive) {
                UpdateSpinOverlayMatchStatus(
                    options.streamOverlay.id,
                    options.streamOverlay.key,
                    spinQuery,
                    matchActive,
                    Date.now(),
                );
            } else if (!matchModeEnabled) {
                UpdateSpinOverlayMatchStatus(
                    options.streamOverlay.id,
                    options.streamOverlay.key,
                    spinQuery,
                    matchActive,
                );
            }
        }
    }, [matchModeEnabled, matchActive, options.streamOverlay.active]);

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

import { Missions } from "@/utils/globals";
import {
    Mission,
    Spin,
    SpinCheckResult,
    SpinTarget,
    SpinUpdateAction,
} from "@/types";
import { useEffect, useState } from "react";
import { useSpinQuery } from "./useSpinQuery";
import {
    GenerateSpin,
    RegenerateCondition,
    RegenerateDisguise,
} from "./utils/SpinGenerationUtils";
import { GetRandomMission } from "@/app/(main)/spin/utils/SpinUtils";
import { useLocalState } from "@/utils/useLocalState";
import {
    InitializeSpinOverlay,
    UpdateSpinOverlay,
} from "../../(streamOverlay)/OverlayActions";
import {
    CreateSpinQuery,
    GetSpinFromQuery,
} from "@/app/(main)/spin/utils/SpinQueryUtils";
import { useSpinOptions } from "./useSpinOptions";
import { SpinIsLegal } from "./utils/SpinCheckUtils";

export function useSpinManager() {
    const [currentSpin, setCurrentSpin] = useState<Spin>();

    const [spinLegal, setSpinLegal] = useState<SpinCheckResult>({
        legal: true,
    });

    const options = useSpinOptions();

    // State
    const [queueIndex, setQueueIndex] = useLocalState("queueIndex", 0);
    const [overlayId, setOverlayId] = useLocalState(
        "overlayId",
        crypto.randomUUID(),
    );
    async function RegenerateOverlayId(newId: string) {
        setOverlayId(newId);
        await InitializeSpinOverlay(newId, query);
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
        if (options.missionPool.val.length === 0) {
            AlertNoMissionsInPool();
        }

        let missionToSpin =
            mission !== undefined
                ? mission
                : GetRandomMission(options.missionPool.val);

        while (
            mission === undefined &&
            currentSpin !== undefined &&
            options.dontRepeatMissions.val &&
            options.missionPool.val.length > 1 &&
            currentSpin.mission === missionToSpin
        ) {
            missionToSpin = GetRandomMission(options.missionPool.val);
        }

        const spin: Spin = GenerateSpin(missionToSpin);

        setCurrentSpin(spin);
    }
    function Respin() {
        if (currentSpin) {
            setCurrentSpin(GenerateSpin(currentSpin.mission));
        }
    }
    function RespinCondition(target: SpinTarget, action: SpinUpdateAction) {
        if (!currentSpin) {
            return;
        }

        if (action === "condition") {
            const updatedSpin = RegenerateCondition(currentSpin, target);
            setCurrentSpin(updatedSpin);
            return;
        }
        if (action === "disguise") {
            const updatedSpin = RegenerateDisguise(currentSpin, target);
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

    // Editing Management
    function EditSpin(
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

    // Queue Management
    function GenerateNextSpin() {
        const nextIndex = queueIndex + 1;
        if (nextIndex >= options.missionQueue.val.length) {
            return;
        }
        setQueueIndex(nextIndex);
        setCurrentSpin(GenerateSpin(options.missionQueue.val[nextIndex]));
    }
    function GeneratePreviousSpin() {
        const prevIndex = queueIndex - 1;
        if (prevIndex < 0) {
            return;
        }
        setQueueIndex(prevIndex);
        setCurrentSpin(GenerateSpin(options.missionQueue.val[prevIndex]));
    }
    function UpdateQueueIndex(index: number) {
        setQueueIndex(index);
        setCurrentSpin(GenerateSpin(options.missionQueue.val[index]));
    }

    function UpdateSpin(spin: Spin) {
        setCurrentSpin(spin);
    }
    const query = useSpinQuery(currentSpin, UpdateSpin, options);

    // Update overlay on spin/query or theme change
    useEffect(() => {
        if (options.streamOverlayActive.val) {
            InitializeSpinOverlay(overlayId, query);
            UpdateSpinOverlay(overlayId, query, options.overlayTheme.val);
        }
    }, [options.streamOverlayActive.val, options.overlayTheme.val]);

    // Restart queue index when mission queue is updated
    useEffect(() => {
        if (options.queueMode) {
            if (options.missionQueue.val.length === 0) {
                setCurrentSpin(undefined);
                setQueueIndex(0);
            } else {
                setCurrentSpin(
                    GenerateSpin(options.missionQueue.val[queueIndex]),
                );
            }
        }
    }, [options.missionQueue.val]);

    // Restart queue when Queue Mode is turned on, and sets mission queue to trilogy if empty
    useEffect(() => {
        if (options.queueMode.val) {
            if (options.missionQueue.val.length === 0) {
                options.missionQueue.Set(Missions);
                setQueueIndex(0);
                setCurrentSpin(GenerateSpin("paris"));
            } else {
                setCurrentSpin(
                    GenerateSpin(options.missionQueue.val[queueIndex]),
                );
            }
        }
    }, [options.queueMode.val]);

    useEffect(() => {
        if (!currentSpin && !query) {
            if (options.queueMode.val) {
                if (options.missionQueue.val.length > 0) {
                    setQueueIndex(0);
                    setCurrentSpin(GenerateSpin(options.missionQueue.val[0]));
                }
            } else if (options.missionPool.val.length === 0) {
                setCurrentSpin(
                    GenerateSpin(
                        Missions[Math.floor(Missions.length * Math.random())],
                    ),
                );
            } else {
                NewSpin();
            }
        }

        if (!currentSpin) {
            if (query && !options.queueMode.val) {
                setCurrentSpin(GetSpinFromQuery(query, false));
            }
            return;
        }

        const newQuery = CreateSpinQuery(currentSpin);
        setSpinLegal(SpinIsLegal(currentSpin));

        if (options.streamOverlayActive.val) {
            UpdateSpinOverlay(overlayId, newQuery, options.overlayTheme.val);
        }
    }, [currentSpin]);

    return {
        currentSpin,
        NewSpin,
        Respin,
        RespinCondition,
        EditSpin,
        GenerateNextSpin,
        GeneratePreviousSpin,
        UpdateQueueIndex,
        spinLegal,
        queueIndex,
        options,
        noMissionsSelectedAlertActive,
        query,
        overlayId,
        RegenerateOverlayId,
    };
}

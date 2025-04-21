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
    UpdateSpinOverlayMatchStatus,
} from "../../(streamOverlay)/OverlayActions";
import { CreateSpinQuery } from "@/app/(main)/spin/utils/SpinQueryUtils";
import { useSpinOptions } from "./useSpinOptions";
import { SpinIsLegal } from "./utils/SpinCheckUtils";
import { SpinMissionTargetsList } from "./utils/SpinGlobals";

export function useSpinManager() {
    const [currentSpin, setCurrentSpin] = useState<Spin | null>(null);

    const [spinLegal, setSpinLegal] = useState<SpinCheckResult>({
        legal: true,
    });

    const options = useSpinOptions(currentSpin, setCurrentSpin);

    // State
    const [matchActive, setMatchActive] = useState(false);
    function StartMatch() {
        setMatchActive(true);
    }
    function StopMatch() {
        Respin();
        setMatchActive(false);
    }

    const [overlayId, setOverlayId] = useLocalState(
        "overlayId",
        crypto.randomUUID(),
    );
    const [overlayKey, setOverlayKey] = useLocalState("overlayKey", Date.now());

    async function RegenerateOverlayId(newId: string) {
        setOverlayId(newId);
        const newKey = Date.now();
        setOverlayKey(newKey);
        await InitializeSpinOverlay(newId, newKey, query);
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
            return;
        }

        let missionToSpin =
            mission !== undefined
                ? mission
                : GetRandomMission(options.missionPool.val);

        while (
            mission === undefined &&
            currentSpin &&
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
        if (currentSpin === null) {
            return;
        }

        const targetsWithLockedConditions = Object.keys(
            options.lockedConditions.val,
        );

        if (targetsWithLockedConditions.length === 0) {
            setCurrentSpin(GenerateSpin(currentSpin.mission));
        } else {
            const targets = SpinMissionTargetsList[currentSpin.mission];
            for (const target of targets) {
                const targetKillMethodLocked =
                    options.lockedConditions.val[target] &&
                    options.lockedConditions.val[target].killMethod !== "";
                const targetDisguiseLocked =
                    options.lockedConditions.val[target] &&
                    options.lockedConditions.val[target].disguise !== "";

                if (!targetKillMethodLocked) {
                    RespinCondition(target, "killMethod");
                }
                if (!targetDisguiseLocked) {
                    RespinCondition(target, "disguise");
                }
            }
        }
    }
    function RespinCondition(target: SpinTarget, action: SpinUpdateAction) {
        if (!currentSpin) {
            return;
        }

        if (action === "killMethod") {
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

        if (action === "killMethod") {
            const updatedSpin = structuredClone(currentSpin);
            if (updatedSpin.info[target]) {
                updatedSpin.info[target].killMethod = newValue;
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
        const nextIndex = options.queueIndex.val + 1;
        if (nextIndex >= options.missionQueue.val.length) {
            return;
        }
        options.queueIndex.Set(nextIndex);
        setCurrentSpin(GenerateSpin(options.missionQueue.val[nextIndex]));
    }
    function GeneratePreviousSpin() {
        const prevIndex = options.queueIndex.val - 1;
        if (prevIndex < 0) {
            return;
        }
        options.queueIndex.Set(prevIndex);
        setCurrentSpin(GenerateSpin(options.missionQueue.val[prevIndex]));
    }
    function UpdateQueueIndex(index: number) {
        options.queueIndex.Set(index);
        setCurrentSpin(GenerateSpin(options.missionQueue.val[index]));
    }

    function UpdateSpin(spin: Spin) {
        setCurrentSpin(spin);
    }
    const query = useSpinQuery(currentSpin, UpdateSpin, matchActive, options);

    // Update overlay on spin/query or theme change
    useEffect(() => {
        if (!options.streamOverlayActive.val) {
            return;
        }

        if (!options.matchMode.val || (options.matchMode.val && matchActive)) {
            InitializeSpinOverlay(overlayId, overlayKey, query);
            UpdateSpinOverlay(
                overlayId,
                overlayKey,
                query,
                options.overlayTheme.val,
            );
        }
    }, [options.streamOverlayActive.val, options.overlayTheme.val]);

    // Respin when match mode is enabled to prevent controlling the spin
    useEffect(() => {
        if (options.matchMode.val) {
            Respin();
        }
    }, [options.matchMode.val]);

    // Update overlay when match is active
    useEffect(() => {
        if (!options.streamOverlayActive.val) {
            return;
        }

        if (!options.matchMode.val) {
            UpdateSpinOverlayMatchStatus(
                overlayId,
                overlayKey,
                query,
                options.matchMode.val,
                -1,
            );
            return;
        }
        if (currentSpin) {
            if (matchActive) {
                UpdateSpinOverlayMatchStatus(
                    overlayId,
                    overlayKey,
                    query,
                    matchActive,
                    Date.now(),
                );
            } else {
                UpdateSpinOverlayMatchStatus(
                    overlayId,
                    overlayKey,
                    query,
                    matchActive,
                );
            }
        }
    }, [matchActive, options.matchMode.val]);

    useEffect(() => {
        if (!currentSpin) {
            return;
        }

        const newQuery = CreateSpinQuery(currentSpin);
        setSpinLegal(SpinIsLegal(currentSpin));

        if (options.matchMode.val) {
            setMatchActive(false);
        }

        if (options.streamOverlayActive.val && !options.matchMode.val) {
            UpdateSpinOverlay(
                overlayId,
                overlayKey,
                newQuery,
                options.overlayTheme.val,
            );
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
        matchActive,
        StartMatch,
        StopMatch,
        options,
        noMissionsSelectedAlertActive,
        query,
        overlayId,
        overlayKey,
        RegenerateOverlayId,
    };
}

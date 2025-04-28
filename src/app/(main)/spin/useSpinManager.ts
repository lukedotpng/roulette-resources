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
    RegenerateDisguise,
    RegenerateKillMethod,
} from "./utils/SpinGeneration";
import { GenerateSpin as CustomRulesGenerateSpin } from "@/app/(main)/spin/_components/CustomRulesComponents/CustomRuleSpinGenerator";
import { GetRandomMission } from "@/app/(main)/spin/utils/SpinUtils";
import { useLocalState } from "@/utils/useLocalState";
import {
    InitializeSpinOverlay,
    UpdateSpinOverlay,
    UpdateSpinOverlayMatchStatus,
} from "../../(streamOverlay)/OverlayActions";
import { CreateSpinQuery } from "@/app/(main)/spin/utils/SpinQuery";
import { useSpinOptions } from "./useSpinOptions";
import { SpinIsLegal } from "./utils/SpinCheck";
import { SpinMissionTargetsList } from "./utils/SpinGlobals";

export function useSpinManager() {
    const [currentSpin, setCurrentSpin] = useState<Spin | null>(null);
    function SetCurrentSpin(updatedSpin: Spin | null) {
        if (
            (updatedSpin !== null &&
                currentSpin !== null &&
                updatedSpin.mission !== currentSpin.mission) ||
            options.matchMode.val
        ) {
            options.lockedConditions.Set({});
        }

        setCurrentSpin(updatedSpin);
    }

    const [spinLegal, setSpinLegal] = useState<SpinCheckResult>({
        legal: true,
    });

    const options = useSpinOptions(currentSpin, SetCurrentSpin);

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

        if (missionToSpin === currentSpin?.mission) {
            Respin();
            return;
        }

        if (options.playCustomRules.val) {
            const spin: Spin = CustomRulesGenerateSpin(missionToSpin);
            SetCurrentSpin(spin);
        } else {
            const spin: Spin = GenerateSpin(missionToSpin);
            SetCurrentSpin(spin);
        }
    }
    function Respin() {
        if (currentSpin === null) {
            return;
        }

        const targetsWithLockedConditions = Object.keys(
            options.lockedConditions.val,
        );

        if (targetsWithLockedConditions.length === 0) {
            if (options.playCustomRules.val) {
                const spin: Spin = CustomRulesGenerateSpin(currentSpin.mission);
                SetCurrentSpin(spin);
            } else {
                const spin: Spin = GenerateSpin(currentSpin.mission);
                SetCurrentSpin(spin);
            }
        } else {
            const targets = SpinMissionTargetsList[currentSpin.mission];
            let updatedSpin: Spin = structuredClone(currentSpin);

            for (const target of targets) {
                const lockedTargetConditions =
                    options.lockedConditions.val[target];
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
    function GenerateNextSpin() {
        const nextIndex = options.queueIndex.val + 1;
        if (nextIndex >= options.missionQueue.val.length) {
            return;
        }
        options.queueIndex.Set(nextIndex);
        SetCurrentSpin(GenerateSpin(options.missionQueue.val[nextIndex]));
    }
    function GeneratePreviousSpin() {
        const prevIndex = options.queueIndex.val - 1;
        if (prevIndex < 0) {
            return;
        }
        options.queueIndex.Set(prevIndex);
        SetCurrentSpin(GenerateSpin(options.missionQueue.val[prevIndex]));
    }
    function UpdateQueueIndex(index: number) {
        options.queueIndex.Set(index);
        SetCurrentSpin(GenerateSpin(options.missionQueue.val[index]));
    }

    function UpdateSpin(spin: Spin) {
        SetCurrentSpin(spin);
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

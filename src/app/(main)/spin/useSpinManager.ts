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
import {
    CreateSpinQuery,
    GetSpinFromQuery,
} from "@/app/(main)/spin/utils/SpinQueryUtils";
import { useSpinOptions } from "./useSpinOptions";
import { SpinIsLegal } from "./utils/SpinCheckUtils";

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
        if (
            options.streamOverlayActive.val &&
            (!options.matchMode.val || (options.matchMode.val && matchActive))
        ) {
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
        if (currentSpin && options.streamOverlayActive.val) {
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
        // if (!currentSpin && !query) {
        //     if (options.queueMode.val) {
        //         if (options.missionQueue.val.length > 0) {
        //             options.queueIndex.Set(0);
        //             setCurrentSpin(GenerateSpin(options.missionQueue.val[0]));
        //         }
        //     } else if (options.missionPool.val.length === 0) {
        //         // setCurrentSpin(
        //         //     GenerateSpin(
        //         //         Missions[Math.floor(Missions.length * Math.random())],
        //         //     ),
        //         // );
        //     } else {
        //         NewSpin();
        //     }
        // }

        if (!currentSpin) {
            if (query && !options.queueMode.val) {
                setCurrentSpin(GetSpinFromQuery(query, false));
            }
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

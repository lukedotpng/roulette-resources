import { Spin, SpinOptions } from "@/types";
import {
    Dialog,
    DialogTrigger,
    DialogPortal,
    DialogOverlay,
    DialogContent,
    DialogTitle,
} from "@radix-ui/react-dialog";
import { useState } from "react";
import SpinOptionsToggle from "./SpinOptionsToggle";
import SpinOptionsChoiceSelector from "./SpinOptionsChoiceSelector";
import MissionPoolSelection from "../PoolComponents/MissionPoolSelection";
import MissionQueueSelection from "../QueueComponents/MissionQueueSelection";
import MatchSimLog from "../MatchComponents/MatchSimLog";
import CustomRuleEditorDialog from "../CustomRulesComponents/CustomRuleEditorDialog";

export default function SpinOptionsSection({
    options,
    currentSpin,
    overlayId,
    RegenerateOverlayId,
}: {
    options: SpinOptions;
    currentSpin: Spin | null;
    overlayId: string;
    RegenerateOverlayId: (newId: string) => void;
}) {
    const [copiedToClipboardAlertActive, setCopiedToClipboardAlertActive] =
        useState(false);
    const [
        newLinkCopiedToClipboardAlertActive,
        setNewLinkCopiedToClipboardAlertActive,
    ] = useState(false);

    function EnableCopiedToClipboardAlert() {
        if (!copiedToClipboardAlertActive) {
            setCopiedToClipboardAlertActive(true);
            setTimeout(() => {
                setCopiedToClipboardAlertActive(false);
            }, 1500);
        }
    }
    function EnableNewLinkCopiedToClipboardAlert() {
        if (!newLinkCopiedToClipboardAlertActive) {
            setNewLinkCopiedToClipboardAlertActive(true);
            setTimeout(() => {
                setNewLinkCopiedToClipboardAlertActive(false);
            }, 1500);
        }
    }

    return (
        <div className="flex h-5 w-full max-w-[48rem] flex-wrap justify-center gap-1 text-[.9em] sm:h-8 sm:gap-2 sm:text-[1em]">
            <div className="flex w-28 sm:w-40">
                <button
                    className="group flex-1 border-red-500 bg-white text-zinc-900 hover:bg-red-500 hover:text-white data-[active=true]:border-b-2 sm:data-[active=true]:border-b-4"
                    onClick={() => {
                        if (options.queueMode.val) {
                            options.queueMode.Toggle();
                        }
                    }}
                    data-active={!options.queueMode.val}
                >
                    {"Pool"}
                </button>
                <button
                    className="group flex-1 border-red-500 bg-white text-zinc-900 hover:bg-red-500 hover:text-white data-[active=true]:border-b-2 sm:data-[active=true]:border-b-4"
                    onClick={() => {
                        if (!options.queueMode.val) {
                            options.queueMode.Toggle();
                        }
                    }}
                    data-active={options.queueMode.val}
                >
                    {"Queue"}
                </button>
            </div>
            {options.queueMode.val ? (
                <MissionQueueSelection
                    className="group aspect-square h-full bg-white text-zinc-900 hover:bg-red-500 hover:text-white"
                    missionQueue={options.missionQueue}
                />
            ) : (
                <MissionPoolSelection
                    className="group aspect-square h-full bg-white text-zinc-900 hover:bg-red-500 hover:text-white"
                    missionPool={options.missionPool}
                />
            )}
            {options.playCustomRules.val && (
                <CustomRuleEditorDialog
                    ruleset={options.ruleset.val}
                    SetRuleset={options.ruleset.Set}
                />
            )}
            <div className="flex-1"></div>
            <button
                className="group w-16 border-red-500 bg-white text-zinc-900 hover:bg-red-500 hover:text-white data-[active=true]:border-b-2 sm:w-24 sm:data-[active=true]:border-b-4"
                onClick={options.matchMode.Toggle}
                data-active={options.matchMode.val}
            >
                {"Match Sim"}
            </button>
            {options.matchMode.val ? (
                <MatchSimLog options={options} currentSpin={currentSpin} />
            ) : (
                <button
                    className="group aspect-square h-full border-white bg-white text-zinc-900 hover:border-red-500 hover:bg-red-500 hover:text-white data-[active=true]:border-b-2 data-[active=true]:border-red-500 sm:data-[active=true]:border-b-4"
                    onClick={options.manualMode.Toggle}
                    data-active={options.manualMode.val}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        className="h-[.875rem] w-full fill-zinc-900 group-hover:fill-white sm:h-[1.4rem]"
                    >
                        {/* Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2024 Fonticons, Inc. */}
                        <path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152L0 424c0 48.6 39.4 88 88 88l272 0c48.6 0 88-39.4 88-88l0-112c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 112c0 22.1-17.9 40-40 40L88 464c-22.1 0-40-17.9-40-40l0-272c0-22.1 17.9-40 40-40l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24L88 64z" />
                    </svg>
                </button>
            )}
            <Dialog>
                <DialogTrigger className="group aspect-square h-full bg-white text-zinc-900 hover:bg-red-500 hover:text-white">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        className="h-[.875rem] w-full fill-zinc-900 group-hover:fill-white sm:h-[1.4rem]"
                    >
                        {/* Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2024 Fonticons, Inc. */}
                        <path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z" />
                    </svg>
                </DialogTrigger>
                <DialogPortal>
                    <DialogOverlay className="fixed inset-0 bg-zinc-900 opacity-80" />
                    <DialogContent className="fixed top-1/2 left-1/2 max-h-[50rem] w-[90%] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg bg-white px-4 py-2 sm:w-[30rem]">
                        <DialogTitle className="w-full pb-2 text-left text-[1.1em] font-bold">
                            {"Options"}
                        </DialogTitle>
                        <section className="flex flex-col gap-2">
                            <div className="flex flex-col gap-2 rounded-md border-2 px-2 py-1">
                                <h2 className="text-center text-[1.05em] font-bold">
                                    {"General"}
                                </h2>
                                <SpinOptionsToggle
                                    label={"Don't Repeat Maps"}
                                    onClickHandler={
                                        options.dontRepeatMissions.Toggle
                                    }
                                    activeState={options.dontRepeatMissions.val}
                                />
                                <SpinOptionsToggle
                                    label={"Update URL On Spin"}
                                    onClickHandler={options.updateQuery.Toggle}
                                    activeState={options.updateQuery.val}
                                />
                                <SpinOptionsToggle
                                    label={"Can Always Edit No Target KO"}
                                    onClickHandler={
                                        options.canAlwaysEditNTKO.Toggle
                                    }
                                    activeState={options.canAlwaysEditNTKO.val}
                                />
                                <SpinOptionsToggle
                                    label={"Show Full Queue List"}
                                    onClickHandler={
                                        options.showQueueList.Toggle
                                    }
                                    activeState={options.showQueueList.val}
                                />
                                <SpinOptionsChoiceSelector
                                    label="Layout Mode"
                                    options={[
                                        { id: "row", display: "Row" },
                                        { id: "col", display: "Column" },
                                    ]}
                                    onClickHandler={options.layoutMode.Set}
                                    activeOption={options.layoutMode.val}
                                />
                                {/* <SpinOptionsToggle
                                    label={"Use Custom Rules"}
                                    onClickHandler={
                                        options.playCustomRules.Toggle
                                    }
                                    activeState={options.playCustomRules.val}
                                /> */}
                            </div>
                            <div className="flex flex-col gap-2 rounded-md border-2 px-2 py-1">
                                <h2 className="text-center text-[1.05em] font-bold">
                                    {"Help"}
                                </h2>
                                <SpinOptionsToggle
                                    label={"Show Tips"}
                                    onClickHandler={options.showTips.Toggle}
                                    activeState={options.showTips.val}
                                />
                                <SpinOptionsToggle
                                    label={"Show Warning On Illegal Spins"}
                                    onClickHandler={
                                        options.warnForIllegalSpins.Toggle
                                    }
                                    activeState={
                                        options.warnForIllegalSpins.val
                                    }
                                />
                            </div>
                            <div className="flex flex-col gap-2 rounded-md border-2 px-2 py-1">
                                <h2 className="text-center text-[1.05em] font-bold">
                                    {"Stream Overlay"}
                                </h2>
                                <SpinOptionsToggle
                                    label={"Enable Stream Overlay (1300x650)"}
                                    onClickHandler={
                                        options.streamOverlayActive.Toggle
                                    }
                                    activeState={
                                        options.streamOverlayActive.val
                                    }
                                />
                                <div className="flex w-full gap-2">
                                    <button
                                        className="group w-full items-center border-1 border-zinc-900 bg-white py-0.5 text-center text-zinc-900 sm:border-2"
                                        data-copyalertactive={
                                            copiedToClipboardAlertActive
                                        }
                                        onClick={() => {
                                            EnableCopiedToClipboardAlert();
                                            navigator.clipboard.writeText(
                                                `https://roulette.luke.town/overlay/${overlayId}`,
                                            );
                                        }}
                                    >
                                        <span className="inline w-full decoration-red-500 decoration-2 group-hover:underline group-data-[copyalertactive=true]:hidden">
                                            {"Copy Link"}
                                        </span>
                                        <span className="hidden w-full group-data-[copyalertactive=true]:inline">
                                            {"Copied!"}
                                        </span>
                                    </button>
                                    <button
                                        className="group w-full items-center border-1 border-zinc-900 bg-white py-0.5 text-center text-zinc-900 sm:border-2"
                                        data-copyalertactive={
                                            newLinkCopiedToClipboardAlertActive
                                        }
                                        onClick={() => {
                                            const newId = crypto.randomUUID();
                                            RegenerateOverlayId(newId);
                                            EnableNewLinkCopiedToClipboardAlert();
                                            navigator.clipboard.writeText(
                                                `https://roulette.luke.town/overlay/${newId}`,
                                            );
                                        }}
                                    >
                                        <span className="inline w-full decoration-red-500 decoration-2 group-hover:underline group-data-[copyalertactive=true]:hidden">
                                            {"Regenerate Link"}
                                        </span>
                                        <span className="hidden w-full group-data-[copyalertactive=true]:inline">
                                            {"New Link Copied!"}
                                        </span>
                                    </button>
                                </div>
                                <SpinOptionsChoiceSelector
                                    label="Theme"
                                    options={[
                                        { id: "default", display: "Default" },
                                        {
                                            id: "text_only",
                                            display: "Text Only",
                                        },
                                    ]}
                                    onClickHandler={options.overlayTheme.Set}
                                    activeOption={options.overlayTheme.val}
                                />
                            </div>
                        </section>
                    </DialogContent>
                </DialogPortal>
            </Dialog>
        </div>
    );
}

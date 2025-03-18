import { SpinOptions } from "@/types";
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
import MissionPoolSelection from "./MissionPoolSelection";
import MissionQueueSelection from "./MissionQueueSelection";

export default function SpinOptionsSection({
    options,
    overlayId,
    RegenerateOverlayId,
}: {
    options: SpinOptions;
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
        <div className="flex h-5 w-full flex-wrap justify-center gap-2 sm:h-8 sm:gap-4">
            <button
                className="group flex w-24 items-center justify-center bg-white text-zinc-900 sm:w-36"
                onClick={options.queueMode.Toggle}
                data-active={options.queueMode.val}
            >
                <div className="ml-1 aspect-square h-3 border-1 border-zinc-900 bg-white group-data-[active=true]:bg-red-500 sm:ml-2 sm:h-4 sm:border-2"></div>
                <span className="flex-1 text-nowrap underline decoration-transparent decoration-2 group-hover:decoration-red-500">
                    {"Queue Mode"}
                </span>
            </button>
            {options.queueMode.val ? (
                <MissionQueueSelection missionQueue={options.missionQueue} />
            ) : (
                <MissionPoolSelection missionPool={options.missionPool} />
            )}
            <button
                className="group flex w-20 items-center justify-center bg-white text-zinc-900 sm:w-28"
                onClick={options.manualMode.Toggle}
                data-active={options.manualMode.val}
            >
                <div className="ml-1 aspect-square h-3 border-1 border-zinc-900 bg-white group-data-[active=true]:bg-red-500 sm:ml-2 sm:h-4 sm:border-2"></div>
                <span className="flex-1 text-nowrap underline decoration-transparent decoration-2 group-hover:decoration-red-500">
                    {"Edit Spin"}
                </span>
            </button>
            <Dialog>
                <DialogTrigger className="group h-full bg-white p-1 text-zinc-900 hover:bg-red-500 hover:text-white">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        className="aspect-square h-full group-hover:fill-white"
                    >
                        {/* Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2024 Fonticons, Inc. */}
                        <path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z" />
                    </svg>
                </DialogTrigger>
                <DialogPortal>
                    <DialogOverlay className="fixed inset-0 bg-zinc-900 opacity-80" />
                    <DialogContent className="fixed top-1/2 left-1/2 max-h-[30rem] w-[90%] -translate-x-1/2 -translate-y-1/2 overflow-scroll rounded-lg bg-white sm:w-[30rem]">
                        <DialogTitle className="mt-2 w-full text-center text-[1.1em] font-bold">
                            {"Options"}
                        </DialogTitle>
                        <section className="mx-4 my-2 flex flex-col gap-2">
                            <SpinOptionsToggle
                                label={"Don't Repeat Maps"}
                                onClickHandler={
                                    options.dontRepeatMissions.Toggle
                                }
                                activeState={options.dontRepeatMissions.val}
                            />
                            <SpinOptionsToggle
                                label={"Show Warning On Illegal Spins"}
                                onClickHandler={
                                    options.warnForIllegalSpins.Toggle
                                }
                                activeState={options.warnForIllegalSpins.val}
                            />
                            <SpinOptionsToggle
                                label={"Update URL On Spin"}
                                onClickHandler={options.updateQuery.Toggle}
                                activeState={options.updateQuery.val}
                            />
                            <SpinOptionsToggle
                                label={"Show Tips"}
                                onClickHandler={options.showTips.Toggle}
                                activeState={options.showTips.val}
                            />
                            <SpinOptionsToggle
                                label={"Can Always Edit No Target KO"}
                                onClickHandler={
                                    options.canAlwaysEditNTKO.Toggle
                                }
                                activeState={options.canAlwaysEditNTKO.val}
                            />
                            <SpinOptionsToggle
                                label={"Show Queue List"}
                                onClickHandler={options.showQueueList.Toggle}
                                activeState={options.showQueueList.val}
                            />
                            <SpinOptionsToggle
                                label={"Enable Stream Overlay (1300x600)"}
                                onClickHandler={
                                    options.streamOverlayActive.Toggle
                                }
                                activeState={options.streamOverlayActive.val}
                            />
                            <div className="flex w-full gap-2">
                                <button
                                    className="group w-full items-center border-2 border-zinc-900 bg-white py-0.5 text-center text-zinc-900"
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
                                        {"Copy Overlay Link"}
                                    </span>
                                    <span className="hidden w-full group-data-[copyalertactive=true]:inline">
                                        {"Copied!"}
                                    </span>
                                </button>
                                <button
                                    className="group w-full items-center border-2 border-zinc-900 bg-white py-0.5 text-center text-zinc-900"
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
                                        {"Regenerate Spin Link"}
                                    </span>
                                    <span className="hidden w-full group-data-[copyalertactive=true]:inline">
                                        {"New Link Copied!"}
                                    </span>
                                </button>
                            </div>
                            <SpinOptionsChoiceSelector
                                label="Overlay Theme"
                                options={[
                                    { id: "default", display: "Default" },
                                    { id: "text_only", display: "Text Only" },
                                ]}
                                onClickHandler={options.overlayTheme.Set}
                                activeOption={options.overlayTheme.val}
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
                        </section>
                    </DialogContent>
                </DialogPortal>
            </Dialog>
        </div>
    );
}

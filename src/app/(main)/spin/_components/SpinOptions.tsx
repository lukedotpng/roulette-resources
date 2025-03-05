import { SpinSettings } from "@/types";
import {
    Dialog,
    DialogTrigger,
    DialogPortal,
    DialogOverlay,
    DialogContent,
    DialogTitle,
} from "@radix-ui/react-dialog";
import { useState } from "react";

export default function SpinOptions({
    settings,
    overlayId,
}: {
    settings: SpinSettings;
    overlayId: string;
}) {
    const [copiedToClipboardAlertActive, setCopiedToClipboardAlertActive] =
        useState(false);

    function EnableCopiedToClipboardAlert() {
        if (!copiedToClipboardAlertActive) {
            setCopiedToClipboardAlertActive(true);
            setTimeout(() => {
                setCopiedToClipboardAlertActive(false);
            }, 1500);
        }
    }

    console.log(overlayId);

    return (
        <>
            <div
                data-active={copiedToClipboardAlertActive}
                aria-hidden={copiedToClipboardAlertActive}
                className="fixed -top-36 z-10 rounded-md bg-red-500 p-2 font-bold text-white shadow-xl shadow-black transition-[top] ease-in-out data-[active=true]:visible data-[active=true]:top-20"
            >
                {"Overlay Link Copied"}
            </div>
            <Dialog>
                <DialogTrigger className="group h-full bg-white p-1 text-zinc-900 hover:bg-red-500 hover:text-white sm:p-2">
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
                    <DialogContent className="fixed top-1/2 left-1/2 max-h-[30rem] w-[90%] -translate-x-1/2 -translate-y-1/2 overflow-scroll rounded-lg bg-white text-xs sm:w-[30rem] sm:text-base md:text-lg">
                        <DialogTitle className="mt-2 w-full text-center text-[1.1em] font-bold">
                            {"Options"}
                        </DialogTitle>
                        <section className="mx-4 my-2 flex flex-col gap-2">
                            <button
                                className="group flex w-fit items-center border-zinc-900 bg-white text-zinc-900"
                                onClick={settings.ToggleDontRepeatMissions}
                                data-active={settings.dontRepeatMissions}
                            >
                                <div className="m-1 border-2 border-zinc-900 bg-white p-2 group-data-[active=true]:bg-red-500"></div>
                                <span className="text-nowrap underline decoration-transparent decoration-2 group-hover:decoration-red-500">
                                    {"Don't Repeat Maps"}
                                </span>
                            </button>
                            <button
                                className="group flex w-fit items-center border-zinc-900 bg-white text-zinc-900"
                                onClick={settings.ToggleUpdateQuery}
                                data-active={settings.updateQuery}
                            >
                                <div className="m-1 border-2 border-zinc-900 bg-white p-2 group-data-[active=true]:bg-red-500"></div>
                                <span className="text-nowrap underline decoration-transparent decoration-2 group-hover:decoration-red-500">
                                    {"Update URL On Spin"}
                                </span>
                            </button>
                            <button
                                className="group flex w-fit items-center border-zinc-900 bg-white text-zinc-900"
                                onClick={settings.ToggleShowTips}
                                data-active={settings.showTips}
                            >
                                <div className="m-1 border-2 border-zinc-900 bg-white p-2 group-data-[active=true]:bg-red-500"></div>
                                <span className="text-nowrap underline decoration-transparent decoration-2 group-hover:decoration-red-500">
                                    {"Show Tips"}
                                </span>
                            </button>
                            <button
                                className="group flex w-fit items-center border-zinc-900 bg-white text-zinc-900"
                                onClick={settings.ToggleCanAlwaysEditNTKO}
                                data-active={settings.canAlwaysEditNTKO}
                            >
                                <div className="m-1 border-2 border-zinc-900 bg-white p-2 group-data-[active=true]:bg-red-500"></div>
                                <span className="text-nowrap underline decoration-transparent decoration-2 group-hover:decoration-red-500">
                                    {"Can Always Edit No Target KO"}
                                </span>
                            </button>
                            <button
                                className="group flex w-fit items-center border-zinc-900 bg-white text-zinc-900"
                                onClick={settings.ToggleStreamOverlayActive}
                                data-active={settings.streamOverlayActive}
                            >
                                <div className="m-1 border-2 border-zinc-900 bg-white p-2 group-data-[active=true]:bg-red-500"></div>
                                <span className="text-nowrap underline decoration-transparent decoration-2 group-hover:decoration-red-500">
                                    {"Enable Stream Overlay"}
                                </span>
                            </button>
                            <button
                                className="group flex w-fit border-2 border-zinc-900 bg-white p-1 text-zinc-900 hover:bg-red-500 hover:text-white"
                                onClick={() => {
                                    EnableCopiedToClipboardAlert();
                                    navigator.clipboard.writeText(
                                        `https://roulette.luke.town/overlay/${overlayId}`,
                                    );
                                }}
                            >
                                {"Copy Overlay Link"}
                            </button>
                            <div className="items-center">
                                <h3 className="w-fit text-center font-bold">
                                    {"Overlay Theme"}
                                </h3>
                                <div className="flex">
                                    <button
                                        className="group flex h-10 flex-1 items-center justify-start border-2 border-zinc-900 bg-white p-1 text-zinc-900 data-[active=true]:bg-red-500 data-[active=true]:text-white"
                                        onClick={() =>
                                            settings.SetOverlayTheme("default")
                                        }
                                        data-active={
                                            settings.overlayTheme === "default"
                                        }
                                    >
                                        <span className="w-full pb-1 text-nowrap underline decoration-transparent decoration-2 group-hover:decoration-red-500">
                                            {"Default"}
                                        </span>
                                    </button>
                                    <button
                                        className="group flex h-10 flex-1 items-center justify-start border-2 border-zinc-900 bg-white p-1 text-zinc-900 data-[active=true]:bg-red-500 data-[active=true]:text-white"
                                        onClick={() =>
                                            settings.SetOverlayTheme(
                                                "text_only",
                                            )
                                        }
                                        data-active={
                                            settings.overlayTheme ===
                                            "text_only"
                                        }
                                    >
                                        <span className="w-full pb-1 text-nowrap underline decoration-transparent decoration-2 group-hover:decoration-red-500">
                                            {"Text Only"}
                                        </span>
                                    </button>
                                </div>
                            </div>
                            <div className="items-center">
                                <h3 className="w-fit text-center font-bold">
                                    {"Layout Mode"}
                                </h3>
                                <div className="flex">
                                    <button
                                        className="group flex h-10 flex-1 items-center justify-start border-2 border-zinc-900 bg-white p-1 text-zinc-900 data-[active=true]:bg-red-500 data-[active=true]:text-white"
                                        onClick={() =>
                                            settings.SetLayoutMode("row")
                                        }
                                        data-active={
                                            settings.layoutMode === "row"
                                        }
                                    >
                                        <span className="w-full pb-1 text-nowrap underline decoration-transparent decoration-2 group-hover:decoration-red-500">
                                            {"Row"}
                                        </span>
                                    </button>
                                    <button
                                        className="group flex h-10 flex-1 items-center justify-start border-2 border-zinc-900 bg-white p-1 text-zinc-900 data-[active=true]:bg-red-500 data-[active=true]:text-white"
                                        onClick={() =>
                                            settings.SetLayoutMode("col")
                                        }
                                        data-active={
                                            settings.layoutMode === "col"
                                        }
                                    >
                                        <span className="w-full pb-1 text-nowrap underline decoration-transparent decoration-2 group-hover:decoration-red-500">
                                            {"Column"}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </section>
                    </DialogContent>
                </DialogPortal>
            </Dialog>
        </>
    );
}

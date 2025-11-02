import {
    Dialog,
    DialogPortal,
    DialogOverlay,
    DialogContent,
    DialogTitle,
} from "@radix-ui/react-dialog";
import { FocusedSpinTip, SpinTipDisguise, SpinTipKill } from "../types";
import Markdown from "react-markdown";
import Link from "next/link";
import {
    DisguiseIDToDisplayText,
    MarkdownTextToDisplay,
    MethodIDToDisplayText,
} from "@/utils/FormattingUtils";
import rehypeRaw from "rehype-raw";
import remarkBreaks from "remark-breaks";

export default function SpinTipsModal({
    open,
    setOpen,
    spinTip,
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
    spinTip: FocusedSpinTip;
}) {
    if (spinTip === null) {
        return;
    }

    let InfoDisplayElement = null;

    switch (spinTip.type) {
        case "disguise":
            InfoDisplayElement = (
                <DisguiseTipInfo disguiseInfo={spinTip.data} />
            );
            break;
        case "killMethod":
            InfoDisplayElement = <KillTipInfo killInfo={spinTip.data} />;
            break;
    }

    return (
        <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
            <DialogPortal>
                <DialogOverlay className="fixed inset-0 z-20 bg-zinc-900 opacity-80" />
                <DialogContent className="fixed top-1/2 left-1/2 z-20 max-h-[80%] min-h-40 w-[90%] max-w-[65rem] -translate-x-1/2 -translate-y-1/2 overflow-y-scroll rounded-lg bg-white outline-transparent">
                    {InfoDisplayElement}
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}

function DisguiseTipInfo({ disguiseInfo }: { disguiseInfo: SpinTipDisguise }) {
    const firstSeperatorIndex = disguiseInfo.quick_look.indexOf("|");

    let disguiseQuickLookName = "";
    if (firstSeperatorIndex === -1) {
        disguiseQuickLookName = disguiseInfo.quick_look;
    } else {
        disguiseQuickLookName = `${disguiseInfo.quick_look.slice(0, firstSeperatorIndex - 1)}`;
    }

    return (
        <>
            <DialogTitle className="w-full pt-2 text-center text-[1.1em]">
                {disguiseInfo.hitmaps_link ? (
                    <a
                        href={disguiseInfo.hitmaps_link}
                        target="_blank"
                        className="font-bold underline"
                    >
                        {disguiseQuickLookName}
                    </a>
                ) : (
                    <p className="inline font-bold">{disguiseQuickLookName}</p>
                )}
                {firstSeperatorIndex !== -1 && (
                    <span>{`: ${disguiseInfo.quick_look.slice(disguiseInfo.quick_look.indexOf("|") + 1)}`}</span>
                )}
            </DialogTitle>
            <div className="flex flex-wrap justify-center gap-1 p-2">
                {disguiseInfo.disguiseVideos.map((disguiseVideo) => {
                    let videoId = "";

                    if (disguiseVideo.link) {
                        const youtubeIdRegex =
                            /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/; // Regex found from on stack overflow https://stackoverflow.com/a/8260383

                        const videoIdMatch =
                            disguiseVideo.link.match(youtubeIdRegex);
                        if (videoIdMatch !== null && videoIdMatch.length >= 8) {
                            videoId = videoIdMatch[7];
                        }
                    } else {
                        return;
                    }

                    return (
                        <div
                            className="group flex flex-col sm:min-w-[30rem]"
                            key={disguiseVideo.id}
                            data-notes={disguiseVideo.notes !== ""}
                        >
                            {disguiseVideo.notes !== "" && (
                                <div className="markdown col-start-1 row-start-1 border-2 border-b-0 p-2 py-1 data-[active=false]:pointer-events-none data-[active=false]:opacity-0">
                                    <Markdown
                                        remarkPlugins={[remarkBreaks]}
                                        rehypePlugins={[rehypeRaw]}
                                        components={{
                                            a(props) {
                                                return (
                                                    <a
                                                        target="_blank"
                                                        {...props}
                                                    ></a>
                                                );
                                            },
                                        }}
                                    >
                                        {MarkdownTextToDisplay(
                                            disguiseVideo.notes,
                                        )}
                                    </Markdown>
                                </div>
                            )}
                            <iframe
                                className="aspect-video h-auto w-full"
                                width="380"
                                height="213"
                                src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                                allow="clipboard-write; picture-in-picture"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                            />
                        </div>
                    );
                })}
            </div>
        </>
    );
}

function KillTipInfo({ killInfo }: { killInfo: SpinTipKill }) {
    let videoId = "";

    if (killInfo.video_link) {
        const youtubeIdRegex =
            /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/; // Regex found from on stack overflow https://stackoverflow.com/a/8260383

        const videoIdMatch = killInfo.video_link.match(youtubeIdRegex);
        if (videoIdMatch !== null && videoIdMatch.length >= 8) {
            videoId = videoIdMatch[7];
        }
    }

    return (
        <>
            <DialogTitle className="w-full pt-2 text-center text-[1.1em] font-bold">
                {!killInfo.name
                    ? MethodIDToDisplayText(killInfo.kill_method)
                    : killInfo.name}
            </DialogTitle>
            <div className="flex flex-col items-center gap-1 p-2">
                <div className="w-full">
                    <div className="markdown">
                        <Markdown
                            components={{
                                a(props) {
                                    return <a target="_blank" {...props}></a>;
                                },
                            }}
                        >
                            {killInfo.info}
                        </Markdown>
                    </div>
                </div>
                {videoId !== "" && (
                    <iframe
                        className="aspect-video h-auto w-full max-w-[35rem]"
                        width="380"
                        height="213"
                        src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                        allow="clipboard-write; picture-in-picture"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                    />
                )}
            </div>
        </>
    );
}

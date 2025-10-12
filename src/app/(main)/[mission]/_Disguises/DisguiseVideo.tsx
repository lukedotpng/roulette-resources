import { DisguiseVideoSelect } from "@/types";
import {
    Dialog,
    DialogPortal,
    DialogOverlay,
    DialogContent,
    DialogTitle,
} from "@radix-ui/react-dialog";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { DeleteDisguiseVideoAction } from "./DisguiseActions";
import { MarkdownTextToDisplay } from "@/utils/FormattingUtils";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkBreaks from "remark-breaks";

export default function DisguiseVideo({
    disguiseVideo,
    SetEditDialogActive,
}: {
    disguiseVideo: DisguiseVideoSelect;
    SetEditDialogActive: (
        updatedEditDialogActive: boolean,
        isNew: boolean,
        disguiseVideo: DisguiseVideoSelect,
    ) => void;
}) {
    const session = useSession();

    const [deleteVideoConfirmationOpen, setDeleteVideoConfirmationOpen] =
        useState(false);

    if (disguiseVideo.visible === false) {
        return null;
    }

    const youtubeIdRegex =
        /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/; // Regex found from on stack overflow https://stackoverflow.com/a/8260383

    const videoIdMatch = disguiseVideo.link.match(youtubeIdRegex);
    if (videoIdMatch === null || videoIdMatch.length < 8) {
        return null;
    }

    const videoId = videoIdMatch[7];

    return (
        <div
            className="group flex max-w-[30rem] min-w-full flex-1 flex-col md:min-w-[25rem]"
            key={disguiseVideo.id}
            data-admin={session.data?.user?.admin}
            data-notes={disguiseVideo.notes !== ""}
        >
            {disguiseVideo.notes !== "" && (
                <div className="markdown col-start-1 row-start-1 border-2 border-b-0 p-2 py-1 data-[active=false]:pointer-events-none data-[active=false]:opacity-0">
                    <Markdown
                        remarkPlugins={[remarkBreaks]}
                        rehypePlugins={[rehypeRaw]}
                        components={{
                            a(props) {
                                return <a target="_blank" {...props}></a>;
                            },
                        }}
                    >
                        {MarkdownTextToDisplay(disguiseVideo.notes)}
                    </Markdown>
                </div>
            )}
            <iframe
                className="aspect-video h-auto w-full rounded-md border-2 border-zinc-900 group-data-[admin=true]:rounded-b-none group-data-[notes=true]:rounded-t-none"
                width="380"
                height="213"
                src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                allow="clipboard-write; picture-in-picture"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
            />
            {session.data?.user?.admin && (
                <>
                    <div className="flex w-full justify-between">
                        <button
                            className="w-24 rounded-md rounded-t-none border-2 border-t-0 border-zinc-900 bg-white py-0.5 text-zinc-900 hover:bg-red-500 hover:text-white sm:w-48 sm:py-1"
                            onClick={() =>
                                SetEditDialogActive(true, false, disguiseVideo)
                            }
                        >
                            {"Edit"}
                        </button>
                        <button
                            className="w-16 rounded-md rounded-t-none border-2 border-t-0 border-zinc-900 bg-white py-0.5 text-zinc-900 hover:bg-red-500 hover:text-white sm:w-28 sm:py-1"
                            onClick={() => setDeleteVideoConfirmationOpen(true)}
                        >
                            {"Delete"}
                        </button>
                    </div>
                    <Dialog
                        open={deleteVideoConfirmationOpen}
                        onOpenChange={() => {
                            setDeleteVideoConfirmationOpen(false);
                        }}
                    >
                        <DialogPortal>
                            <DialogOverlay className="fixed inset-0 bg-zinc-900 opacity-50" />
                            <DialogContent className="fixed top-1/2 left-1/2 w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white sm:w-[30rem]">
                                <DialogTitle className="w-full p-3 text-center font-bold">
                                    {"Are you sure you want to delete?"}
                                </DialogTitle>
                                <div className="flex">
                                    <button
                                        className="flex-1 rounded-bl-lg border-t-2 border-r-1 border-zinc-900 bg-white p-2 text-zinc-900 hover:bg-red-500 hover:text-white"
                                        onClick={() =>
                                            setDeleteVideoConfirmationOpen(
                                                false,
                                            )
                                        }
                                    >
                                        {"Cancel"}
                                    </button>
                                    <button
                                        className="flex-1 rounded-br-lg border-t-2 border-l-1 border-zinc-900 bg-white p-2 text-zinc-900 hover:bg-red-500 hover:text-white"
                                        onClick={async () =>
                                            await DeleteDisguiseVideoAction(
                                                disguiseVideo.id,
                                            )
                                        }
                                    >
                                        {"Delete"}
                                    </button>
                                </div>
                            </DialogContent>
                        </DialogPortal>
                    </Dialog>
                </>
            )}
        </div>
    );
}

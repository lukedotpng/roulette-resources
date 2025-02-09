import { Disguise } from "@/types";
import {
    Dialog,
    DialogContent,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
} from "@radix-ui/react-dialog";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { DeleteDisguiseVideoAction } from "../DisguiseActions";

export default function DisguiseCard({ disguise }: { disguise: Disguise }) {
    const session = useSession();

    const [deleteVideoConfirmationOpen, setDeleteVideoConfirmationOpen] =
        useState(false);

    return (
        <div className="w-80 bg-white p-2 text-zinc-900 sm:w-[30rem] md:w-[35rem] md:p-5">
            <div className="flex flex-col gap-2">
                {disguise.hitmaps_link && (
                    <a
                        href={disguise.hitmaps_link}
                        target="_blank"
                        className="block italic underline"
                    >
                        {"Hitmaps"}
                    </a>
                )}
                {disguise.notes && <p>{disguise.notes}</p>}
                <div className="flex flex-col gap-2 md:gap-5">
                    {disguise.disguiseVideoSchema.map((video) => {
                        if (video.visible === false) {
                            return null;
                        }

                        const youtubeIdRegex =
                            /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/; // Regex found from on stack overflow https://stackoverflow.com/a/8260383

                        const videoIdMatch = video.link.match(youtubeIdRegex);
                        if (videoIdMatch === null || videoIdMatch.length < 8) {
                            return;
                        }

                        const videoId = videoIdMatch[7];

                        return (
                            <div
                                className="flex flex-col items-end"
                                key={video.id}
                            >
                                <iframe
                                    className="aspect-video h-auto w-full"
                                    width="380"
                                    height="213"
                                    src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                                    allow="clipboard-write; picture-in-picture"
                                    referrerPolicy="strict-origin-when-cross-origin"
                                    allowFullScreen
                                />
                                {session.data?.user?.admin && (
                                    <>
                                        <button
                                            className="w-40 bg-white py-2 text-zinc-900 hover:bg-red-500 hover:text-white"
                                            onClick={() =>
                                                setDeleteVideoConfirmationOpen(
                                                    true,
                                                )
                                            }
                                        >
                                            Delete
                                        </button>
                                        <Dialog
                                            open={deleteVideoConfirmationOpen}
                                            onOpenChange={() => {
                                                setDeleteVideoConfirmationOpen(
                                                    false,
                                                );
                                            }}
                                        >
                                            <DialogPortal>
                                                <DialogOverlay className="fixed inset-0 bg-zinc-900 opacity-80" />
                                                <DialogContent className="fixed left-1/2 top-1/2 w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white sm:w-[30rem]">
                                                    <DialogTitle className="w-full p-3 text-center text-base font-bold sm:text-xl">
                                                        Are you sure you want to
                                                        delete?
                                                    </DialogTitle>
                                                    <div className="flex">
                                                        <button
                                                            className="flex-1 rounded-bl-lg bg-white p-3 text-zinc-900 hover:bg-red-500 hover:text-white"
                                                            onClick={() =>
                                                                setDeleteVideoConfirmationOpen(
                                                                    false,
                                                                )
                                                            }
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            className="flex-1 rounded-br-lg bg-white p-3 text-zinc-900 hover:bg-red-500 hover:text-white"
                                                            onClick={async () => {
                                                                await DeleteDisguiseVideoAction(
                                                                    video.id,
                                                                );
                                                            }}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </DialogContent>
                                            </DialogPortal>
                                        </Dialog>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

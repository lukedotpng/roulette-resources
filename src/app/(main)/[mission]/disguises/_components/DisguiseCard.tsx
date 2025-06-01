import { DisguiseSelect, DisguiseVideoSelect } from "@/types";
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

export default function DisguiseCard({
    disguise,
    SetEditDialogActive,
}: {
    disguise: DisguiseSelect;
    SetEditDialogActive: (
        updatedEditDialogActive: boolean,
        isNew: boolean,
        disguiseVideo: DisguiseVideoSelect,
    ) => void;
}) {
    const session = useSession();

    const [deleteVideoConfirmationOpen, setDeleteVideoConfirmationOpen] =
        useState(false);

    const disguiseVideos = [...disguise.disguiseVideoSchema];
    disguiseVideos.sort((a, b) => a.id.localeCompare(b.id));

    return (
        <div className="w-80 rounded-xl border-4 border-zinc-500 bg-white p-2 text-zinc-900 sm:w-[25rem] md:w-[30rem] md:p-5 lg:w-[35rem]">
            <div className="flex flex-col gap-2">
                {disguise.hitmaps_link && (
                    <p className="font-bold">
                        {"Free Disguise - "}
                        <a href={disguise.hitmaps_link} target="_blank">
                            <span className="italic underline">
                                {"Hitmaps"}
                            </span>
                        </a>
                    </p>
                )}
                {disguise.notes && <p>{disguise.notes}</p>}
                <div className="flex flex-col gap-2 md:gap-5">
                    {disguiseVideos.map((video) => {
                        if (video.visible === false) {
                            return null;
                        }

                        const youtubeIdRegex =
                            /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/; // Regex found from on stack overflow https://stackoverflow.com/a/8260383

                        const videoIdMatch = video.link.match(youtubeIdRegex);
                        if (videoIdMatch === null || videoIdMatch.length < 8) {
                            return null;
                        }

                        const videoId = videoIdMatch[7];

                        return (
                            <div
                                className="group flex flex-col"
                                key={video.id}
                                data-admin={session.data?.user?.admin}
                            >
                                {video.notes !== "" && (
                                    <p className="self-start">{`${video.notes}`}</p>
                                )}
                                <iframe
                                    className="aspect-video h-auto w-full rounded-md border-2 border-zinc-900 group-data-[admin=true]:rounded-b-none"
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
                                                    SetEditDialogActive(
                                                        true,
                                                        false,
                                                        video,
                                                    )
                                                }
                                            >
                                                {"Edit"}
                                            </button>
                                            <button
                                                className="w-16 rounded-md rounded-t-none border-2 border-t-0 border-zinc-900 bg-white py-0.5 text-zinc-900 hover:bg-red-500 hover:text-white sm:w-28 sm:py-1"
                                                onClick={() =>
                                                    setDeleteVideoConfirmationOpen(
                                                        true,
                                                    )
                                                }
                                            >
                                                {"Delete"}
                                            </button>
                                        </div>
                                        <Dialog
                                            open={deleteVideoConfirmationOpen}
                                            onOpenChange={() => {
                                                setDeleteVideoConfirmationOpen(
                                                    false,
                                                );
                                            }}
                                        >
                                            <DialogPortal>
                                                <DialogOverlay className="fixed inset-0 bg-zinc-900 opacity-50" />
                                                <DialogContent className="fixed top-1/2 left-1/2 w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white sm:w-[30rem]">
                                                    <DialogTitle className="w-full p-3 text-center font-bold">
                                                        {
                                                            "Are you sure you want to delete?"
                                                        }
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
                                                            onClick={async () => {
                                                                await DeleteDisguiseVideoAction(
                                                                    video.id,
                                                                );
                                                            }}
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
                    })}
                </div>
            </div>
        </div>
    );
}

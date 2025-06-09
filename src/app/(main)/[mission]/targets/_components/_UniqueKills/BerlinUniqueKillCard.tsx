import { UniqueKillSelect } from "@/types";
import {
    Dialog,
    DialogPortal,
    DialogOverlay,
    DialogContent,
    DialogTitle,
} from "@radix-ui/react-dialog";
import { DeleteUniqueKillAction } from "./UniqueKillActions";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Markdown from "react-markdown";
import { UniqueKillToMarkdown } from "../OldInfoToMarkdown";

export default function BerlinUniqueKillCard({
    uniqueKills,
    handleUniqueKillEditTrigger,
}: {
    uniqueKills: UniqueKillSelect[];
    handleUniqueKillEditTrigger: (
        uniqueKill: UniqueKillSelect,
        isNew: boolean,
    ) => void;
}) {
    const session = useSession();

    const [
        deleteUniqueKillConfirmationOpen,
        setDeleteUniqueKillConfirmationOpen,
    ] = useState(false);

    if (uniqueKills.length === 0) {
        return null;
    }

    const sortedUniqueKills = [...uniqueKills];
    console.log(sortedUniqueKills);
    sortedUniqueKills.sort((a, b) => {
        const safeA = a.name ? a.name : "";
        const safeB = b.name ? b.name : "";
        return safeA.localeCompare(safeB);
    });

    return (
        <div className="w-80 bg-white text-zinc-900 sm:w-[30rem] md:w-[35rem]">
            <div className="flex flex-col gap-2 p-3">
                {sortedUniqueKills.map((uniqueKillMethod, index) => (
                    <div
                        key={index}
                        className="relative border-t-4 border-zinc-900 p-3 first:border-0"
                    >
                        {uniqueKillMethod.name && (
                            <p className="text-center font-bold">
                                {uniqueKillMethod.name}
                            </p>
                        )}
                        <div className="markdown">
                            <Markdown
                                components={{
                                    a(props) {
                                        return (
                                            <a target="_blank" {...props}></a>
                                        );
                                    },
                                }}
                            >
                                {uniqueKillMethod.info !== ""
                                    ? uniqueKillMethod.info
                                    : UniqueKillToMarkdown(uniqueKillMethod)}
                            </Markdown>
                        </div>
                        {uniqueKillMethod.video_link && (
                            <a
                                className="w-fit font-bold underline"
                                href={uniqueKillMethod.video_link}
                                target="_blank"
                            >
                                Watch video here
                            </a>
                        )}
                        {session.data?.user?.admin && (
                            <div className="absolute top-[.9rem] right-1 flex gap-3">
                                <button
                                    onClick={() =>
                                        handleUniqueKillEditTrigger(
                                            uniqueKillMethod,
                                            false,
                                        )
                                    }
                                    className="group"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 512 512"
                                        className="h-3 w-3 fill-zinc-900 group-hover:fill-red-500 sm:h-4 sm:w-4"
                                    >
                                        {/* Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2024 Fonticons, Inc. */}
                                        <path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152L0 424c0 48.6 39.4 88 88 88l272 0c48.6 0 88-39.4 88-88l0-112c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 112c0 22.1-17.9 40-40 40L88 464c-22.1 0-40-17.9-40-40l0-272c0-22.1 17.9-40 40-40l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24L88 64z" />
                                    </svg>
                                </button>
                                <button
                                    className="group"
                                    onClick={() =>
                                        setDeleteUniqueKillConfirmationOpen(
                                            true,
                                        )
                                    }
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 448 512"
                                        className="h-3 w-3 fill-zinc-900 group-hover:fill-red-500 sm:h-4 sm:w-4"
                                    >
                                        {/* Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2024 Fonticons, Inc. */}
                                        <path d="M170.5 51.6L151.5 80l145 0-19-28.4c-1.5-2.2-4-3.6-6.7-3.6l-93.7 0c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80 368 80l48 0 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-8 0 0 304c0 44.2-35.8 80-80 80l-224 0c-44.2 0-80-35.8-80-80l0-304-8 0c-13.3 0-24-10.7-24-24S10.7 80 24 80l8 0 48 0 13.8 0 36.7-55.1C140.9 9.4 158.4 0 177.1 0l93.7 0c18.7 0 36.2 9.4 46.6 24.9zM80 128l0 304c0 17.7 14.3 32 32 32l224 0c17.7 0 32-14.3 32-32l0-304L80 128zm80 64l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16z" />
                                    </svg>
                                </button>
                                <Dialog
                                    open={deleteUniqueKillConfirmationOpen}
                                    onOpenChange={() => {
                                        setDeleteUniqueKillConfirmationOpen(
                                            false,
                                        );
                                    }}
                                >
                                    <DialogPortal>
                                        <DialogOverlay className="fixed inset-0 bg-zinc-900 opacity-80" />
                                        <DialogContent className="fixed top-1/2 left-1/2 w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white sm:w-[30rem]">
                                            <DialogTitle className="w-full p-3 text-center text-base font-bold sm:text-xl">
                                                Are you sure you want to delete?
                                            </DialogTitle>
                                            <div className="flex">
                                                <button
                                                    className="flex-1 rounded-bl-lg bg-white p-3 text-zinc-900 hover:bg-red-500 hover:text-white"
                                                    onClick={() =>
                                                        setDeleteUniqueKillConfirmationOpen(
                                                            false,
                                                        )
                                                    }
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    className="flex-1 rounded-br-lg bg-white p-3 text-zinc-900 hover:bg-red-500 hover:text-white"
                                                    onClick={async () => {
                                                        await DeleteUniqueKillAction(
                                                            uniqueKillMethod.id,
                                                        );
                                                        setDeleteUniqueKillConfirmationOpen(
                                                            false,
                                                        );
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </DialogContent>
                                    </DialogPortal>
                                </Dialog>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

"use client";

import {
    TimingsFlashcardSelect,
    TimingsFlashcardInsert,
    ActionResponse,
} from "@/types";
import { FormEvent, useEffect, useRef, useState } from "react";
import {
    CreateTimingsFlashcardAction,
    UpdateTimingsFlashcardAction,
} from "../_InfoActions/TimingsFlashcardActions";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkBreaks from "remark-breaks";

export default function FlashcardEditorForm({
    timingsFlashcard,
    isNew,
    OnSave,
}: {
    timingsFlashcard: TimingsFlashcardSelect | TimingsFlashcardInsert;
    isNew: boolean;
    OnSave: () => void;
}) {
    const [viewTab, setViewTab] = useState<"editor" | "preview">("editor");

    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const [timingsFlashcardInfo, setTimingsFlashcardInfo] = useState(
        timingsFlashcard.info,
    );
    const [hasBeenEdited, setHasBeenEdited] = useState(false);
    useEffect(() => {
        setHasBeenEdited(timingsFlashcardInfo !== timingsFlashcard.info);
    }, [timingsFlashcardInfo, timingsFlashcard.info]);

    function StyleText(style: "bold" | "italic" | "underline") {
        if (textAreaRef.current === null) {
            return;
        }

        const selectionStart = textAreaRef.current.selectionStart;
        const selectionEnd = textAreaRef.current.selectionEnd;

        if (selectionStart !== selectionEnd) {
            const preHighlightedText = textAreaRef.current.value.slice(
                0,
                selectionStart,
            );

            let highlightedText = textAreaRef.current.value.slice(
                selectionStart,
                selectionEnd,
            );

            if (highlightedText.includes("\n")) {
                return;
            }

            switch (style) {
                case "bold":
                    highlightedText = "**" + highlightedText + "**";
                    break;
                case "italic":
                    highlightedText = "*" + highlightedText + "*";
                    break;
                case "underline":
                    highlightedText = "<u>" + highlightedText + "</u>";
                    break;
            }

            const postHighlightedText = textAreaRef.current.value.slice(
                selectionEnd,
                textAreaRef.current.value.length - 1,
            );

            setTimingsFlashcardInfo(
                preHighlightedText + highlightedText + postHighlightedText,
            );
        }
    }

    return (
        <form
            className="mt-2 flex flex-col gap-2"
            action={async (formData: FormData) => {
                let res: ActionResponse;
                if (isNew) {
                    res = await CreateTimingsFlashcardAction(formData);
                    if (!res.success) {
                        console.log("UPLOAD ERROR:", res.error);
                    }
                } else {
                    res = await UpdateTimingsFlashcardAction(formData);
                }
                if (!res.success) {
                    console.log("UPLOAD ERROR:", res.error);
                    window.alert(
                        'Uh Oh! There was an error:\n"' + res.error + '"',
                    );
                } else {
                    OnSave();
                }
            }}
        >
            {/* Field for flashcard info */}
            <fieldset>
                <div className="flex">
                    <button
                        type="button"
                        data-active={viewTab === "editor"}
                        className="flex-1 border-t-2 border-r-1 border-l-2 border-zinc-900 decoration-red-500 decoration-2 inset-shadow-black/50 hover:underline data-[active=true]:bg-red-500 data-[active=true]:text-white"
                        onClick={() => {
                            setViewTab("editor");
                        }}
                    >
                        {"Editor"}
                    </button>
                    <button
                        type="button"
                        data-active={viewTab === "preview"}
                        className="flex-1 border-t-2 border-r-2 border-l-1 border-zinc-900 decoration-red-500 decoration-2 inset-shadow-black/50 hover:underline data-[active=true]:bg-red-500 data-[active=true]:text-white"
                        onClick={() => {
                            setViewTab("preview");
                        }}
                    >
                        {"Preview"}
                    </button>
                    <div
                        data-active={viewTab === "editor"}
                        className="flex flex-1 justify-end border-zinc-900 data-[active=false]:pointer-events-none data-[active=false]:opacity-0"
                    >
                        <button
                            type="button"
                            className="aspect-[5/4] h-full border-t-2 border-l-2 border-zinc-900 font-bold hover:bg-red-500 hover:text-white"
                            onClick={() => {
                                StyleText("bold");
                            }}
                        >
                            {"B"}
                        </button>
                        <button
                            type="button"
                            className="aspect-[5/4] h-full border-t-2 border-l-2 border-zinc-900 text-[1.05em] italic hover:bg-red-500 hover:text-white"
                            onClick={() => {
                                StyleText("italic");
                            }}
                        >
                            {"I"}
                        </button>
                        <button
                            type="button"
                            className="aspect-[5/4] h-full border-t-2 border-r-2 border-l-2 border-zinc-900 underline hover:bg-red-500 hover:text-white"
                            onClick={() => {
                                StyleText("underline");
                            }}
                        >
                            {"U"}
                        </button>
                    </div>
                </div>
                <div className="">
                    <div className="grid grid-cols-1 grid-rows-1">
                        <div
                            data-active={viewTab === "editor"}
                            className="col-start-1 row-start-1 data-[active=false]:pointer-events-none data-[active=false]:opacity-0"
                        >
                            <textarea
                                className="h-full min-h-40 w-full border-2 border-zinc-900 p-1 focus:border-x-blue-400 focus:border-b-blue-400 focus:outline-none"
                                ref={textAreaRef}
                                name="info"
                                value={timingsFlashcardInfo}
                                onInput={(
                                    e: FormEvent<HTMLTextAreaElement>,
                                ) => {
                                    setTimingsFlashcardInfo(
                                        e.currentTarget.value,
                                    );
                                }}
                                id="info"
                            />
                        </div>
                        <div
                            data-active={viewTab === "preview"}
                            className="markdown col-start-1 row-start-1 border-2 border-zinc-900 p-1 data-[active=false]:pointer-events-none data-[active=false]:opacity-0"
                        >
                            <Markdown
                                remarkPlugins={[remarkBreaks]}
                                rehypePlugins={[rehypeRaw]}
                                components={{
                                    a(props) {
                                        return (
                                            <a target="_blank" {...props}></a>
                                        );
                                    },
                                }}
                            >
                                {timingsFlashcardInfo.replaceAll(
                                    "\n",
                                    "&nbsp;\n",
                                )}
                            </Markdown>
                        </div>
                    </div>
                </div>
            </fieldset>
            {/* Hidden field for ID */}
            <input
                hidden
                readOnly
                name="id"
                value={timingsFlashcard.id}
                id="id"
            />
            {/* Hidden field for Mission */}
            <input
                hidden
                readOnly
                name="mission"
                value={timingsFlashcard.mission}
                id="mission"
            />
            <div className="flex w-full justify-center">
                <button
                    type="submit"
                    className="w-32 rounded-md border-2 border-zinc-900 bg-white p-1 text-sm font-bold text-zinc-900 decoration-red-500 decoration-2 not-disabled:hover:border-red-500 not-disabled:hover:bg-red-500 not-disabled:hover:text-white disabled:cursor-not-allowed! disabled:opacity-30 sm:text-xl"
                    disabled={!hasBeenEdited}
                >
                    {"Save"}
                </button>
            </div>
        </form>
    );
}

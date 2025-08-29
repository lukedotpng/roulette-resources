import { MarkdownTextToDisplay } from "@/utils/FormattingUtils";
import { FormEvent, useRef, useState } from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkBreaks from "remark-breaks";

export default function FreeformInput({
    value,
    id,
    onChange,
}: {
    value: string;
    id: string;
    onChange: (updatedText: string) => void;
}) {
    const [viewTab, setViewTab] = useState<"editor" | "preview">("editor");

    const textAreaRef = useRef<HTMLTextAreaElement>(null);

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

            onChange(
                preHighlightedText + highlightedText + postHighlightedText,
            );
        }
    }

    return (
        <div>
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
            <div>
                <div className="grid grid-cols-1 grid-rows-1">
                    <div
                        data-active={viewTab === "editor"}
                        className="col-start-1 row-start-1 data-[active=false]:pointer-events-none data-[active=false]:opacity-0"
                    >
                        <textarea
                            className="h-full min-h-40 w-full border-2 border-zinc-900 p-1 focus:border-x-blue-400 focus:border-b-blue-400 focus:outline-none"
                            ref={textAreaRef}
                            name={id}
                            value={value}
                            onInput={(e: FormEvent<HTMLTextAreaElement>) =>
                                onChange(e.currentTarget.value)
                            }
                            id={id}
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
                                    return <a target="_blank" {...props}></a>;
                                },
                            }}
                        >
                            {MarkdownTextToDisplay(value)}
                        </Markdown>
                    </div>
                </div>
            </div>
        </div>
    );
}

import {
    TimingsFlashcardSelect,
    TimingsFlashcardInsert,
    ActionResponse,
} from "@/types";
import {
    MDXEditor,
    listsPlugin,
    markdownShortcutPlugin,
    toolbarPlugin,
    UndoRedo,
    BoldItalicUnderlineToggles,
    ListsToggle,
    MDXEditorMethods,
} from "@mdxeditor/editor";
import { useEffect, useRef, useState } from "react";
import {
    CreateFlashcardAction,
    UpdateFlashcardAction,
} from "../FlashcardActions";

export default function FlashcardEditorForm({
    timingsFlashcard,
    isNew,
    OnSave,
}: {
    timingsFlashcard: TimingsFlashcardSelect | TimingsFlashcardInsert;
    isNew: boolean;
    OnSave: () => void;
}) {
    const [timingsFlashcardInfo, setTimingsFlashcardInfo] = useState(
        timingsFlashcard.info,
    );
    const editorRef = useRef<MDXEditorMethods>(null);

    const [hasBeenEdited, setHasBeenEdited] = useState(false);

    useEffect(() => {
        setHasBeenEdited(timingsFlashcardInfo !== timingsFlashcard.info);
    }, [timingsFlashcardInfo, timingsFlashcard.info]);

    return (
        <form
            className="mt-2 flex flex-col gap-2"
            action={async (formData: FormData) => {
                let res: ActionResponse;
                if (isNew) {
                    res = await CreateFlashcardAction(formData);
                    if (!res.success) {
                        console.log("UPLOAD ERROR:", res.error);
                    }
                } else {
                    res = await UpdateFlashcardAction(formData);
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
            <fieldset>
                {/* Field for flashcard info */}
                <div className="border-2 border-zinc-900">
                    <MDXEditor
                        plugins={[
                            listsPlugin(),
                            markdownShortcutPlugin(),
                            toolbarPlugin({
                                toolbarClassName: "select-none",
                                toolbarContents: () => (
                                    <>
                                        <UndoRedo />
                                        <BoldItalicUnderlineToggles />
                                        <ListsToggle options={["bullet"]} />
                                    </>
                                ),
                            }),
                        ]}
                        ref={editorRef}
                        markdown={timingsFlashcard.info}
                        contentEditableClassName="border-t-2 border-zinc-900 min-h-32"
                        onChange={(markdown: string) => {
                            setTimingsFlashcardInfo(markdown);
                        }}
                    />
                </div>
                <textarea
                    hidden
                    readOnly
                    name="info"
                    value={timingsFlashcard.info}
                    id="info"
                />
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

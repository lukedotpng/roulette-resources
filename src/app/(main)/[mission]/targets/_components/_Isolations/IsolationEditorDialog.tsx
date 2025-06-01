import { IsolationInsert } from "@/types";
import {
    Dialog,
    DialogPortal,
    DialogOverlay,
    DialogContent,
    DialogTitle,
} from "@radix-ui/react-dialog";

import { Dispatch, SetStateAction, useState, useEffect, useRef } from "react";
import {
    CreateIsolationAction,
    UpdateIsolationAction,
} from "./IsolationActions";

import {
    BoldItalicUnderlineToggles,
    headingsPlugin,
    linkPlugin,
    listsPlugin,
    ListsToggle,
    markdownShortcutPlugin,
    MDXEditor,
    MDXEditorMethods,
    toolbarPlugin,
    UndoRedo,
} from "@mdxeditor/editor";
import { IsolationToMarkdown } from "../OldInfoToMarkdown";

export default function IsolationEditorDialog({
    isolation,
    isNew,
    editDialogActive,
    setEditDialogActive,
}: {
    isolation: IsolationInsert;
    isNew: boolean;
    editDialogActive: boolean;
    setEditDialogActive: Dispatch<SetStateAction<boolean>>;
}) {
    const [isolationName, setIsolationName] = useState(isolation.name);
    const editorRef = useRef<MDXEditorMethods>(null);
    const [isolationInfo, setIsolationInfo] = useState(
        isolation.info !== "" ? isolation.info : IsolationToMarkdown(isolation),
    );
    const [isolationVideoLink, setIsolationVideoLink] = useState(
        isolation.video_link,
    );

    const [hasBeenEdited, setHasBeenEdited] = useState(false);

    useEffect(() => {
        if (
            isolationName !== isolation.name ||
            isolationVideoLink !== isolation.video_link ||
            isolationInfo.trim() !== isolation.info.trim()
        ) {
            setHasBeenEdited(true);
        } else {
            setHasBeenEdited(false);
        }
    }, [
        isolationName,
        isolation.name,
        isolationInfo,
        isolation.info,
        isolationVideoLink,
        isolation.video_link,
        hasBeenEdited,
    ]);

    return (
        <Dialog open={editDialogActive} onOpenChange={setEditDialogActive}>
            <DialogPortal>
                <DialogOverlay className="fixed inset-0 bg-zinc-900 opacity-80" />
                <DialogContent className="fixed top-1/2 left-1/2 w-[90%] max-w-[50rem] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white">
                    <DialogTitle className="w-full p-3 text-center font-bold">
                        {`${isNew ? "Create" : "Edit"} Isolation`}
                    </DialogTitle>
                    <form
                        className="p-3"
                        action={async (formData: FormData) => {
                            if (isNew) {
                                await CreateIsolationAction(formData);
                            } else {
                                await UpdateIsolationAction(formData);
                            }
                            setEditDialogActive(false);
                        }}
                    >
                        <fieldset className="">
                            {/* Field for the isolation name */}
                            <label className="font-semibold">Name:</label>
                            <input
                                required
                                type="text"
                                name="name"
                                value={isolationName}
                                onChange={(e) =>
                                    setIsolationName(e.target.value)
                                }
                                className="w-full border-2 border-zinc-900 p-1"
                                id="name"
                            />
                        </fieldset>
                        <fieldset className="pt-2">
                            {/* Field for isolation video link */}
                            <label className="font-semibold">Info:</label>
                            <div className="border-2 border-zinc-900">
                                <MDXEditor
                                    plugins={[
                                        headingsPlugin(),
                                        listsPlugin(),
                                        linkPlugin(),
                                        markdownShortcutPlugin(),
                                        toolbarPlugin({
                                            toolbarClassName: "select-none ",
                                            toolbarContents: () => (
                                                <>
                                                    <UndoRedo />
                                                    <BoldItalicUnderlineToggles />
                                                    <ListsToggle
                                                        options={["bullet"]}
                                                    />
                                                </>
                                            ),
                                        }),
                                    ]}
                                    ref={editorRef}
                                    markdown={isolation.info}
                                    contentEditableClassName="border-t-2 border-zinc-900"
                                    onChange={(markdown: string) => {
                                        setIsolationInfo(markdown);
                                    }}
                                />
                            </div>
                            <textarea
                                hidden
                                readOnly
                                name="info"
                                value={isolationInfo}
                                id="info"
                            />
                        </fieldset>
                        <fieldset className="pt-2">
                            {/* Field for isolation video link */}
                            <label className="font-semibold">Video Link:</label>
                            <input
                                type="url"
                                name="video_link"
                                required
                                value={isolationVideoLink}
                                onChange={(e) =>
                                    setIsolationVideoLink(e.target.value)
                                }
                                className="w-full border-2 border-zinc-900 p-1"
                                id="video_link"
                            />
                        </fieldset>
                        {/* Hidden field for Isolation ID */}
                        <input
                            hidden
                            readOnly
                            name="id"
                            value={isolation.id}
                            id="id"
                        />
                        {/* Hidden field for Isolation Map */}
                        <input
                            hidden
                            readOnly
                            name="mission"
                            value={isolation.mission}
                            id="mission"
                        />
                        {/* Hidden field for Isolation Target */}
                        <input
                            hidden
                            readOnly
                            name="target"
                            value={isolation.target}
                            id="target"
                        />

                        <div className="flex w-full justify-center">
                            <button
                                type="submit"
                                className="mt-2 w-32 rounded-md border-2 border-zinc-900 bg-white p-1 text-sm font-bold text-zinc-900 decoration-red-500 decoration-2 not-disabled:hover:border-red-500 not-disabled:hover:bg-red-500 not-disabled:hover:text-white disabled:cursor-not-allowed! disabled:opacity-30 sm:text-xl"
                                disabled={!hasBeenEdited}
                            >
                                {"Save"}
                            </button>
                        </div>
                    </form>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}

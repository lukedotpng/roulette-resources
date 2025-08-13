import { UniqueKillInsert } from "@/types";
import {
    Dialog,
    DialogPortal,
    DialogOverlay,
    DialogContent,
    DialogTitle,
} from "@radix-ui/react-dialog";

import { Dispatch, SetStateAction, useState, useEffect, useRef } from "react";
import {
    CreateUniqueKillAction,
    UpdateUniqueKillAction,
} from "./UniqueKillActions";
import { MethodIDToDisplayText } from "@/utils/FormattingUtils";
import {
    MDXEditor,
    headingsPlugin,
    listsPlugin,
    markdownShortcutPlugin,
    toolbarPlugin,
    UndoRedo,
    BoldItalicUnderlineToggles,
    ListsToggle,
    MDXEditorMethods,
} from "@mdxeditor/editor";
import { UniqueKillToMarkdown } from "../OldInfoToMarkdown";
import {
    SPIN_TARGETS,
    TARGET_UNIQUE_KILLS_LIST,
} from "@/app/(main)/spin/utils/SpinGlobals";
import { SpinTarget } from "@/app/(main)/spin/types";

export default function UniqueKillEditorDialog({
    uniqueKill,
    isNew,
    editDialogActive,
    setEditDialogActive,
}: {
    uniqueKill: UniqueKillInsert;
    isNew: boolean;
    editDialogActive: boolean;
    setEditDialogActive: Dispatch<SetStateAction<boolean>>;
}) {
    const [uniqueKillMethod, setUniqueKillMethod] = useState(
        uniqueKill.kill_method,
    );
    const editorRef = useRef<MDXEditorMethods>(null);
    const [uniqueKillInfo, setUniqueKillInfo] = useState(
        uniqueKill.info !== ""
            ? uniqueKill.info
            : UniqueKillToMarkdown(uniqueKill),
    );
    const [uniqueKillName, setUniqueKillName] = useState(uniqueKill.name || "");
    const [uniqueKillVideoLink, setUniqueKillVideoLink] = useState(
        uniqueKill.video_link || "",
    );

    let uniqueKillOptions = [
        "loud_kills",
        "live_kills",
        "drowning",
        "falling_object",
        "fall",
        "fire",
        "electrocution",
        "explosion_accident",
        "consumed_poison",
        "impact_explosive",
    ];

    if (SPIN_TARGETS.includes(uniqueKill.target)) {
        const customUniqueKills =
            TARGET_UNIQUE_KILLS_LIST[uniqueKill.target as SpinTarget];

        uniqueKillOptions = [...uniqueKillOptions, ...customUniqueKills];
    }

    const [hasBeenEdited, setHasBeenEdited] = useState(false);

    useEffect(() => {
        if (
            uniqueKillName !== (uniqueKill.name || "") ||
            uniqueKillVideoLink !== (uniqueKill.video_link || "") ||
            uniqueKillInfo !== uniqueKill.info
        ) {
            setHasBeenEdited(true);
        } else {
            setHasBeenEdited(false);
        }
    }, [
        uniqueKillMethod,
        uniqueKillName,
        uniqueKill.name,
        uniqueKillInfo,
        uniqueKill.info,
        uniqueKillVideoLink,
        uniqueKill.video_link,
        hasBeenEdited,
    ]);

    return (
        <Dialog open={editDialogActive} onOpenChange={setEditDialogActive}>
            <DialogPortal>
                <DialogOverlay className="fixed inset-0 bg-zinc-900 opacity-80" />
                <DialogContent className="fixed top-1/2 left-1/2 w-[90%] max-w-[50rem] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white">
                    <DialogTitle className="w-full p-3 text-center font-bold">
                        {`${isNew ? "Create" : "Edit"} Unique Kill`}
                    </DialogTitle>
                    <form
                        className="p-3"
                        action={async (formData: FormData) => {
                            if (isNew) {
                                await CreateUniqueKillAction(formData);
                            } else {
                                await UpdateUniqueKillAction(formData);
                            }
                            setEditDialogActive(false);
                        }}
                    >
                        {isNew ? (
                            <fieldset>
                                {/* Field for the unique kill name */}
                                <label className="font-semibold">
                                    Kill Method:
                                </label>
                                <select
                                    required
                                    value={uniqueKillMethod}
                                    name="kill_method"
                                    onChange={(e) =>
                                        setUniqueKillMethod(e.target.value)
                                    }
                                >
                                    {uniqueKillOptions.map((uniqueKill) => (
                                        <option
                                            value={uniqueKill}
                                            key={uniqueKill}
                                            disabled={false}
                                            className=""
                                        >
                                            {MethodIDToDisplayText(uniqueKill)}
                                        </option>
                                    ))}
                                </select>
                            </fieldset>
                        ) : (
                            <input
                                readOnly
                                hidden
                                name="kill_method"
                                value={uniqueKill.kill_method}
                            ></input>
                        )}
                        <fieldset className="pt-2">
                            {/* Field for the unique kill name */}
                            <label className="font-semibold">Name:</label>
                            <input
                                type="text"
                                name="name"
                                value={uniqueKillName}
                                onChange={(e) =>
                                    setUniqueKillName(e.target.value)
                                }
                                className="w-full border-2 border-zinc-900 p-1"
                                id="name"
                            />
                        </fieldset>
                        <fieldset className="pt-2">
                            {/* Field for unique kill video link */}
                            <label className="font-semibold">Info:</label>
                            <div className="border-2 border-zinc-900">
                                <MDXEditor
                                    plugins={[
                                        headingsPlugin(),
                                        listsPlugin(),
                                        markdownShortcutPlugin(),
                                        toolbarPlugin({
                                            toolbarClassName: "select-none",
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
                                    markdown={uniqueKillInfo}
                                    contentEditableClassName="border-t-2 border-zinc-900 min-h-32"
                                    onChange={(markdown: string) => {
                                        setUniqueKillInfo(markdown);
                                    }}
                                />
                            </div>
                            <textarea
                                hidden
                                readOnly
                                name="info"
                                value={uniqueKillInfo}
                                id="info"
                            />
                        </fieldset>
                        <fieldset className="pt-2">
                            {/* Field for unique kill video link */}
                            <label className="font-semibold">Video Link:</label>
                            <input
                                type="url"
                                name="video_link"
                                value={uniqueKillVideoLink}
                                onChange={(e) =>
                                    setUniqueKillVideoLink(e.target.value)
                                }
                                className="w-full border-2 border-zinc-900 p-1"
                                id="video_link"
                            />
                        </fieldset>
                        {/* Hidden field for unique kill ID */}
                        <input
                            hidden
                            readOnly
                            name="id"
                            value={uniqueKill.id}
                            id="id"
                        />
                        {/* Hidden field for unique kill Map */}
                        <input
                            hidden
                            readOnly
                            name="mission"
                            value={uniqueKill.mission}
                            id="map"
                        />
                        {/* Hidden field for unique kill Target */}
                        <input
                            hidden
                            readOnly
                            name="target"
                            value={uniqueKill.target}
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

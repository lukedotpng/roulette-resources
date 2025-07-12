import { ActionResponse, RouteInsert } from "@/types";
import {
    Dialog,
    DialogPortal,
    DialogOverlay,
    DialogContent,
    DialogTitle,
} from "@radix-ui/react-dialog";

import { Dispatch, SetStateAction, useState, useEffect } from "react";
import {
    CreateRouteAction,
    UpdateRouteAction,
} from "../_InfoActions/RouteActions";

export default function RouteEditorDialog({
    route,
    isNew,
    editDialogActive,
    setEditDialogActive,
}: {
    route: RouteInsert;
    isNew: boolean;
    editDialogActive: boolean;
    setEditDialogActive: Dispatch<SetStateAction<boolean>>;
}) {
    const [routeName, setRouteName] = useState(route.name);
    const [routeNotes, setRouteNotes] = useState(route.notes || "");
    const [routeVideoLink, setRouteVideoLink] = useState(route.video_link);

    const [hasBeenEdited, setHasBeenEdited] = useState(false);

    useEffect(() => {
        if (
            routeName !== route.name ||
            routeNotes !== route.notes ||
            routeVideoLink !== route.video_link
        ) {
            setHasBeenEdited(true);
        } else {
            setHasBeenEdited(false);
        }
    }, [
        routeName,
        route.name,
        routeNotes,
        route.notes,
        routeVideoLink,
        route.video_link,
        hasBeenEdited,
    ]);

    return (
        <Dialog open={editDialogActive} onOpenChange={setEditDialogActive}>
            <DialogPortal>
                <DialogOverlay className="fixed inset-0 bg-zinc-900 opacity-80" />
                <DialogContent className="fixed top-1/2 left-1/2 w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white sm:w-[30rem]">
                    <DialogTitle className="w-full p-3 text-center font-bold">
                        {`${isNew ? "Create" : "Edit"} Route`}
                    </DialogTitle>
                    <form
                        className="p-3"
                        action={async (formData: FormData) => {
                            let res: ActionResponse;
                            if (isNew) {
                                res = await CreateRouteAction(formData);
                            } else {
                                res = await UpdateRouteAction(formData);
                            }
                            if (!res.success) {
                                console.log("UPLOAD ERROR:", res.error);
                                window.alert(
                                    'Uh Oh! There was an error:\n"' +
                                        res.error +
                                        '"',
                                );
                            }
                            setEditDialogActive(false);
                        }}
                    >
                        <fieldset className="">
                            {/* Field for the route name */}
                            <label className="font-semibold">Name:</label>
                            <input
                                required
                                type="text"
                                name="name"
                                value={routeName}
                                onChange={(e) => setRouteName(e.target.value)}
                                className="w-full border-2 border-zinc-900 p-1"
                                id="name"
                            />
                        </fieldset>
                        <fieldset className="pt-2">
                            {/* Field for route notes */}
                            <label className="font-semibold">Notes:</label>
                            <input
                                type="text"
                                name="notes"
                                value={routeNotes}
                                onChange={(e) => setRouteNotes(e.target.value)}
                                className="w-full border-2 border-zinc-900 p-1"
                                id="notes"
                            />
                        </fieldset>
                        <fieldset className="pt-2">
                            {/* Field for route video link */}
                            <label className="font-semibold">Video Link:</label>
                            <input
                                type="url"
                                name="video_link"
                                required
                                value={routeVideoLink}
                                onChange={(e) =>
                                    setRouteVideoLink(e.target.value)
                                }
                                className="w-full border-2 border-zinc-900 p-1"
                                id="video_link"
                            />
                        </fieldset>
                        {/* Hidden field for Route ID */}
                        <input
                            hidden
                            readOnly
                            name="id"
                            value={route.id}
                            id="id"
                        />
                        {/* Hidden field for Route Mission */}
                        <input
                            hidden
                            readOnly
                            name="mission"
                            value={route.mission}
                            id="mission"
                        />

                        {hasBeenEdited && (
                            <button
                                type="submit"
                                className="mt-2 w-32 rounded-md border-2 border-red-500 bg-white p-1 font-bold text-zinc-900 hover:bg-red-500 hover:text-white"
                            >
                                Save
                            </button>
                        )}
                    </form>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}

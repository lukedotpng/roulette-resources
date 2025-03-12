"use client";

import { Route } from "@/types";
import {
    Dialog,
    DialogPortal,
    DialogOverlay,
    DialogContent,
    DialogTitle,
} from "@radix-ui/react-dialog";

import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { CreateRouteAction, UpdateRouteAction } from "../RouteActions";

export default function RouteEditorDialog({
    route,
    isNew,
    editDialogActive,
    setEditDialogActive,
}: {
    route: Route;
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
                            if (isNew) {
                                await CreateRouteAction(formData);
                            } else {
                                await UpdateRouteAction(formData);
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
                        {/* Hidden field for Route Map */}
                        <input
                            hidden
                            readOnly
                            name="map"
                            value={route.map}
                            id="map"
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

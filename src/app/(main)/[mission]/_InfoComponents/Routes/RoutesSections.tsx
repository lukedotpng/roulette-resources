"use client";

import { RouteSelect, Mission, RouteInsert } from "@/types";
import { useSession } from "next-auth/react";
import { useState } from "react";
import RouteCard from "./RouteCard";
import RouteEditorDialog from "../../_EditorComponents/RouteEditorDialog";

export default function RoutesSection({
    mission,
    routes,
}: {
    mission: Mission;
    routes: RouteSelect[];
}) {
    const session = useSession();

    const [editDialogActive, setEditDialogActive] = useState(false);
    const [createNewRoute, setCreateNewRoute] = useState(false);
    const [currentRouteToEdit, setCurrentRouteToEdit] = useState<RouteInsert>({
        id: "",
        mission: mission,
        name: "New Route",
        notes: "",
        video_link: "",
        visible: true,
    });

    function HandleRouteEditTrigger(route: RouteInsert, isNew: boolean) {
        setCreateNewRoute(isNew);
        setEditDialogActive(true);
        setCurrentRouteToEdit(route);
    }

    return (
        <section className="flex w-full flex-col justify-center gap-2.5 px-2 sm:px-5">
            <h1 className="border-b-2 border-white text-[1.2em] font-bold">
                {"Routes"}
            </h1>
            <div className="flex flex-col items-center gap-2 md:flex-row md:items-start">
                <div className="flex w-full max-w-50 flex-col items-center gap-2 md:gap-4">
                    {session.data?.user?.admin && (
                        <button
                            className="w-full max-w-50 min-w-24 rounded-lg border-2 border-zinc-500 bg-white p-1 font-bold text-zinc-900 hover:bg-red-500 hover:text-white md:w-50"
                            onClick={() =>
                                HandleRouteEditTrigger(
                                    {
                                        id: "",
                                        mission: mission,
                                        name: "New Route",
                                        notes: "",
                                        video_link: "",
                                        visible: true,
                                    },
                                    true,
                                )
                            }
                        >
                            Add New Route
                        </button>
                    )}
                </div>
                <div className="flex w-full justify-center gap-2 sm:gap-2">
                    {routes === null || routes.length === 0 ? (
                        <h1>No data for this map :(</h1>
                    ) : (
                        routes.map((route, index) => {
                            if (route.visible === false) {
                                return null;
                            }
                            return (
                                <RouteCard
                                    key={index}
                                    route={route}
                                    HandleRouteEditTrigger={
                                        HandleRouteEditTrigger
                                    }
                                />
                            );
                        })
                    )}
                </div>
            </div>
            {editDialogActive && (
                <RouteEditorDialog
                    route={currentRouteToEdit}
                    isNew={createNewRoute}
                    editDialogActive={editDialogActive}
                    setEditDialogActive={setEditDialogActive}
                />
            )}
        </section>
    );
}

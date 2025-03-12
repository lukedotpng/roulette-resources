"use client";

import { Route, Mission } from "@/types";
import { useSession } from "next-auth/react";
import { useState } from "react";
import RouteEditorDialog from "./RouteEditorDialog";
import RouteCard from "./RouteCard";

export default function Routes({
    mission,
    routes,
}: {
    mission: Mission;
    routes: Route[];
}) {
    const session = useSession();

    const [editDialogActive, setEditDialogActive] = useState(false);
    const [createNewRoute, setCreateNewRoute] = useState(false);
    const [currentRouteToEdit, setCurrentRouteToEdit] = useState<Route>({
        id: "",
        map: mission,
        name: "New Route",
        notes: "",
        video_link: "",
        visible: true,
    });

    function handleRouteEditTrigger(route: Route, isNew: boolean) {
        setCreateNewRoute(isNew);
        setEditDialogActive(true);
        setCurrentRouteToEdit(route);
    }

    return (
        <section className="flex w-full flex-col items-center gap-5 md:flex-row md:items-start">
            <div className="flex w-full flex-col items-center gap-2 px-4">
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
                                handleRouteEditTrigger={handleRouteEditTrigger}
                            />
                        );
                    })
                )}
                {session.data?.user?.admin && (
                    <button
                        className="w-full rounded-b-lg bg-white p-3 text-zinc-900 hover:bg-red-500 hover:text-white sm:w-[25rem] md:w-[35rem]"
                        onClick={() =>
                            handleRouteEditTrigger(
                                {
                                    id: "",
                                    map: mission,
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

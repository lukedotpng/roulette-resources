"use client";

import { useEffect, useState } from "react";
import SmallMaps from "./SmallMaps";
import LargeMaps from "./LargeMaps";
import Berlin from "./Berlin";
import TextOnly from "./TextOnly";
import { GetSpinFromQuery } from "@/app/(main)/spin/utils/SpinQuery";
import { Spin } from "@/lib/RouletteSpinner/types";

export default function SpinSection({ id }: { id: string }) {
    const [spin, setSpin] = useState<Spin>();
    const [theme, setTheme] = useState("default");
    const [startTime, setStartTime] = useState(-1);
    const [showSpinTimer, setShowSpinTimer] = useState(false);

    function onOpen(event: Event) {
        console.log("Connected to overlay server");
    }
    function onMessage(event: MessageEvent) {
        const messageData = JSON.parse(event.data);
        if (messageData) {
            if (messageData["spin_query"]) {
                const spin = GetSpinFromQuery(messageData["spin_query"], false);
                if (spin) {
                    setSpin(spin);
                }
            }
            if (messageData["spin_theme"]) {
                setTheme(messageData["spin_theme"]);
            }
            if (messageData["spin_start_time"]) {
                setStartTime(messageData["spin_start_time"]);
            }
            if (messageData["show_spin_timer"]) {
                console.log(messageData["show_spin_timer"]);
                setShowSpinTimer(messageData["show_spin_timer"]);
            }
        }
    }

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8080/" + id);
        socket.addEventListener("open", onOpen);
        socket.addEventListener("message", onMessage);

        return () => {
            socket.removeEventListener("open", onOpen);
            socket.removeEventListener("message", onMessage);
        };
    }, [id]);

    if (!spin) {
        return <h1 className="text-5xl text-white">{"Error finding spin"}</h1>;
    }

    if (theme === "text") {
        return (
            <TextOnly
                spin={spin}
                startTime={startTime}
                showSpinTimer={showSpinTimer}
            />
        );
    }

    if (spin.mission === "berlin") {
        return (
            <Berlin
                spin={spin}
                startTime={startTime}
                showSpinTimer={showSpinTimer}
            />
        );
    } else if (Object.keys(spin.info).length > 2) {
        return (
            <LargeMaps
                spin={spin}
                startTime={startTime}
                showSpinTimer={showSpinTimer}
            />
        );
    } else {
        return (
            <SmallMaps
                spin={spin}
                startTime={startTime}
                showSpinTimer={showSpinTimer}
            />
        );
    }
}

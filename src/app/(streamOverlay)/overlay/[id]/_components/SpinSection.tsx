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

    function onMessage(event: MessageEvent) {
        const messageData = JSON.parse(event.data);
        if (messageData) {
            if ("spin_query" in messageData) {
                const spin = GetSpinFromQuery(messageData["spin_query"], false);
                if (spin) {
                    setSpin(spin);
                }
            }
            if ("spin_theme" in messageData) {
                setTheme(messageData["spin_theme"]);
            }
            if ("spin_start_time" in messageData) {
                if (typeof messageData["spin_start_time"] === "number") {
                    setStartTime(messageData["spin_start_time"]);
                } else {
                    setStartTime(-1);
                }
            }
            if ("show_spin_timer" in messageData) {
                setShowSpinTimer(messageData["show_spin_timer"] === true);
            }
        }
    }

    useEffect(() => {
        const socket = new WebSocket("wss://rouletteoverlay.luke.town/" + id);
        socket.addEventListener("message", onMessage);

        return () => {
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

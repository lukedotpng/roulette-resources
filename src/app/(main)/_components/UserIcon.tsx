"use client";

import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import SignOut from "./SignOut";
import Image from "next/image";

export default function UserIcon() {
    const session = useSession();
    const [signOutButtonOpen, setSignOutButtonOpen] = useState(false);

    if (!session) {
        return null;
    }

    if (session.status === "loading") {
        return null;
    } else if (session.status === "unauthenticated") {
        signOut();
        return null;
    }

    if (!session.data || !session.data.user) {
        return null;
    }

    return (
        <>
            <button
                className="flex h-full justify-center"
                onClick={() => setSignOutButtonOpen(!signOutButtonOpen)}
            >
                {session.data.user.image ? (
                    <Image
                        src={session.data.user.image}
                        alt={session.data.user.name || "No name provided"}
                        width={128}
                        height={128}
                        className="h-full w-full rounded-full"
                    />
                ) : (
                    <p className="h-full w-full rounded-full bg-zinc-900 text-center text-sm font-bold text-white">
                        {session.data.user.name
                            ? session.data.user.name[0]
                            : "?"}
                    </p>
                )}
            </button>
            <div className="absolute top-6 right-1 h-full sm:top-10">
                {signOutButtonOpen && <SignOut />}
            </div>
        </>
    );
}

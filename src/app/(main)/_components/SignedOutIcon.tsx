"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import SignIn from "./SignIn";

export default function SignedOutIcon() {
    const [signInButtonOpen, setSignInButtonOpen] = useState(false);

    return (
        <>
            <button
                className="flex h-full items-center"
                onClick={() => setSignInButtonOpen(!signInButtonOpen)}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    className="h-4 w-4 fill-zinc-900 hover:cursor-pointer hover:fill-red-500 sm:h-6 sm:w-6"
                >
                    {/* Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2024 Fonticons, Inc. */}
                    <path d="M352 96l64 0c17.7 0 32 14.3 32 32l0 256c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0c53 0 96-43 96-96l0-256c0-53-43-96-96-96l-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32zm-9.4 182.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L242.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128z" />
                </svg>
            </button>
            <Dialog
                open={signInButtonOpen}
                onOpenChange={(open: boolean) => setSignInButtonOpen(open)}
            >
                <DialogContent className="absolute top-[calc(100%+.5rem)] right-2 flex h-fit w-44 flex-col items-center gap-2 rounded-md bg-white px-1 py-1 text-xs text-nowrap shadow-xl/100 shadow-black data-[active=false]:hidden sm:w-56 sm:text-base">
                    <DialogTitle>{"You are signed out"}</DialogTitle>
                    <SignIn />
                    <p className="text-center text-[.8em] text-wrap underline">
                        {"*Currently signing in is only necessary for admins"}
                    </p>
                </DialogContent>
            </Dialog>
        </>
    );
}

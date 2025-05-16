import { SessionProvider, signOut } from "next-auth/react";

export default function SignIn() {
    return (
        <SessionProvider>
            <button
                className="flex justify-center bg-white p-1 text-[.9em] text-zinc-900 hover:bg-red-500 hover:text-white"
                onClick={() => signOut()}
            >
                Sign Out
            </button>
        </SessionProvider>
    );
}

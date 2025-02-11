import { SessionProvider, signOut } from "next-auth/react";

export default function SignIn() {
    return (
        <SessionProvider>
            <button
                className="flex w-24 justify-center bg-white text-zinc-900 hover:bg-red-500 hover:text-white"
                onClick={() => signOut()}
            >
                Sign Out
            </button>
        </SessionProvider>
    );
}

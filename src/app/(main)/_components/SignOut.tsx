import { signOut } from "next-auth/react";

export default function SignOut() {
    return (
        <button
            className="w-full rounded-md border-2 border-zinc-900 bg-white p-1 px-4 text-[.9em] text-zinc-900 hover:bg-red-500 hover:text-white"
            onClick={() => signOut()}
        >
            {"Sign Out"}
        </button>
    );
}

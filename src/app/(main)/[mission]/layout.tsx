import { MissionIDToDisplayText } from "@/utils/FormattingUtils";
import { MISSIONS } from "@/utils/globals";
import { Mission } from "@/types";
import { notFound } from "next/navigation";

export default async function Page({
    params,
    children,
}: {
    params: Promise<{ mission: string }>;
    children: Readonly<React.ReactNode>;
}) {
    const { mission } = await params;

    if (!MISSIONS.includes(mission as Mission)) {
        notFound();
    }

    return (
        <main className="flex flex-1 flex-col items-center gap-3 pb-5 text-white md:gap-5">
            <header className="flex w-full items-center justify-between gap-2 border-white pt-3 sm:pt-5">
                <h1 className="flex-1 text-center text-[1.8em] font-bold">
                    {MissionIDToDisplayText(mission)}
                </h1>
            </header>
            {children}
        </main>
    );
}

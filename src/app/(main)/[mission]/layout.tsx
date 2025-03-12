import { MissionIDToDisplayText } from "@/lib/FormattingUtils";
import MissionInfoNav from "./_components/MissionInfoNav";

export default async function Page({
    params,
    children,
}: {
    params: Promise<{ mission: string }>;
    children: Readonly<React.ReactNode>;
}) {
    const { mission } = await params;

    return (
        <main className="flex flex-1 flex-col items-center gap-3 pb-5 text-white md:gap-5">
            <h1 className="w-full p-2 pb-0 text-[1.5em] font-bold sm:p-4 sm:pb-0">
                {MissionIDToDisplayText(mission)}
            </h1>
            <MissionInfoNav mission={mission} />
            {children}
        </main>
    );
}

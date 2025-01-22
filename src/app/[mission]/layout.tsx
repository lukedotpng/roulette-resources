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
        <main className="flex flex-1 flex-col items-center gap-5 bg-zinc-800 text-3xl text-white">
            <h1 className="w-full p-4 pb-0 font-bold">
                {MapIDToDisplayText(mission)}
            </h1>
            <MissionInfoNav mission={mission} />
            {children}
        </main>
    );
}

function MapIDToDisplayText(map: string) {
    let mapDisplayText = "";
    const words = map.split("_");

    for (const word of words) {
        let parsedWord = word.charAt(0).toUpperCase() + word.slice(1) + " ";
        if (parsedWord == "Of ") {
            parsedWord = parsedWord.toLowerCase();
        }
        mapDisplayText += parsedWord;
    }

    return mapDisplayText;
}

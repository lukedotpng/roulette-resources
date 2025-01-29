import Link from "next/link";

export default function Home() {
    return (
        <main className="flex h-screen items-center justify-center bg-zinc-800 text-5xl text-white">
            <section className="flex w-full flex-wrap justify-center gap-5 text-xl">
                <div className="flex flex-col gap-2 text-center">
                    <h2 className="text-[1.2em] font-bold">Season 1</h2>
                    <MissionLink mission="Paris" />
                    <MissionLink mission="Sapienza" />
                    <MissionLink mission="Marrakesh" />
                    <MissionLink mission="Bangkok" />
                    <MissionLink mission="Colorado" />
                    <MissionLink mission="Hokkaido" />
                </div>
                <div className="flex flex-col gap-2 text-center">
                    <h2 className="text-[1.2em] font-bold">Season 2</h2>
                    <MissionLink mission="Miami" />
                    <MissionLink mission="Santa Fortuna" />
                    <MissionLink mission="Mumbai" />
                    <MissionLink mission="Whittleton Creek" />
                    <MissionLink mission="Ambrose Island" />
                    <MissionLink mission="Isle of Sgail" />
                    <MissionLink mission="New York" />
                    <MissionLink mission="Haven Island" />
                </div>
                <div className="flex flex-col gap-2 text-center">
                    <h2 className="text-[1.2em] font-bold">Season 3</h2>
                    <MissionLink mission="Dubai" />
                    <MissionLink mission="Dartmoor" />
                    <MissionLink mission="Berlin" />
                    <MissionLink mission="Chongqing" />
                    <MissionLink mission="Mendoza" />
                </div>
            </section>
        </main>
    );
}

function MissionLink({ mission }: { mission: string }) {
    return (
        <Link
            href={`${textToPathFormat(mission)}`}
            className="w-48 bg-white p-3 text-zinc-900 hover:bg-red-500 hover:text-white"
        >
            {mission}
        </Link>
    );
}

// Converts text to lower case and replaces spaces with underscores to format them for URL paths
function textToPathFormat(text: string) {
    return text.toLowerCase().replaceAll(" ", "_");
}

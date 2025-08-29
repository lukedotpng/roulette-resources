export default function PreMatchView({ OnReady }: { OnReady: () => void }) {
    return (
        <button
            className="h-full w-full text-[1.2em] font-bold"
            onClick={OnReady}
        >
            {"Start Match"}
        </button>
    );
}

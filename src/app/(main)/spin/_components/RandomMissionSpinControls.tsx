export default function RandomMissionSpinControls({
    NewSpin,
    Respin,
}: {
    NewSpin: () => void;
    Respin: () => void;
}) {
    return (
        <div className="flex items-center gap-4">
            <button
                className="h-8 w-32 bg-white font-bold text-zinc-900 hover:bg-red-500 hover:text-white sm:h-10 sm:w-40"
                onClick={() => NewSpin()}
            >
                {"Spin"}
            </button>
            <button
                className="h-8 w-32 bg-white font-bold text-zinc-900 hover:bg-red-500 hover:text-white sm:h-10 sm:w-40"
                onClick={Respin}
            >
                {"Respin"}
            </button>
        </div>
    );
}

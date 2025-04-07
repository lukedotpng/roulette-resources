export default function RandomMissionSpinControls({
    NewSpin,
    Respin,
}: {
    NewSpin: () => void;
    Respin: () => void;
}) {
    return (
        <div className="flex h-6 items-center gap-2 sm:h-8">
            <button
                className="h-full w-24 bg-white font-bold text-zinc-900 hover:bg-red-500 hover:text-white sm:w-36"
                onClick={() => NewSpin()}
            >
                {"Spin"}
            </button>
            <button
                className="h-full w-24 bg-white font-bold text-zinc-900 hover:bg-red-500 hover:text-white sm:w-36"
                onClick={Respin}
            >
                {"Respin"}
            </button>
        </div>
    );
}

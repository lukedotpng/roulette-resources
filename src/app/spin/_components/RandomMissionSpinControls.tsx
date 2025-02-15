export default function RandomMissionSpinControls({
    GenerateRandomSpin,
}: {
    GenerateRandomSpin: () => void;
}) {
    return (
        <div className="flex items-center gap-1">
            <button
                className="h-8 w-32 bg-white font-bold text-zinc-900 hover:bg-red-500 hover:text-white sm:h-10 sm:w-40"
                onClick={GenerateRandomSpin}
            >
                Spin
            </button>
        </div>
    );
}

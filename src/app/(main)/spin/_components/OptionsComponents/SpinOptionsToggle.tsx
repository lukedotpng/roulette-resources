export default function SpinOptionsToggle({
    label,
    onClickHandler,
    activeState,
}: {
    label: string;
    onClickHandler: () => void;
    activeState: boolean;
}) {
    return (
        <button
            className="group flex w-full items-center border-zinc-900 bg-white text-zinc-900"
            onClick={onClickHandler}
            data-active={activeState}
        >
            <div className="mr-1 border-1 border-zinc-900 bg-white p-1 group-data-[active=true]:bg-red-500 sm:border-2 sm:p-2"></div>
            <span className="text-nowrap decoration-red-500 decoration-2 group-hover:underline">
                {label}
            </span>
        </button>
    );
}

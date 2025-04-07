export default function SpinOptionsChoiceSelector({
    label,
    options,
    onClickHandler,
    activeOption,
}: {
    label: string;
    options: { id: string; display: string }[];
    onClickHandler: (option: string) => void;
    activeOption: string;
}) {
    return (
        <div className="items-center">
            <h3 className="w-full text-left font-semibold">{label}</h3>
            <div className="flex gap-2">
                {options.map((option, index) => (
                    <button
                        key={index}
                        className="group w-full items-center border-1 border-zinc-900 bg-white py-0.5 text-center text-zinc-900 data-[active=true]:bg-red-500 data-[active=true]:text-white sm:border-2"
                        onClick={() => onClickHandler(option.id)}
                        data-active={activeOption === option.id}
                    >
                        <span className="flex-1 text-nowrap decoration-red-500 decoration-2 group-hover:underline">
                            {option.display}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}

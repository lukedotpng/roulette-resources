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
            <h3 className="w-full text-left font-bold">{label}</h3>
            <div className="flex">
                {options.map((option, index) => (
                    <button
                        key={index}
                        className="group flex flex-1 items-center border-2 border-zinc-900 bg-white py-0.5 text-zinc-900 data-[active=true]:bg-red-500 data-[active=true]:text-white sm:py-1"
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

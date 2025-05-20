import Link from "next/link";
import RouletteSubstackInfo from "./_components/RouletteSubstackInfo";

export default function Home() {
    return (
        <main className="flex flex-col items-center justify-center gap-5 text-white">
            <h1 className="pt-5 text-center text-[2.2em] font-bold">
                {"Roulette Resources"}
            </h1>

            <div className="mb-5 flex w-full flex-wrap justify-center gap-2 px-5 sm:gap-2 sm:px-10">
                <div className="flex max-h-[30rem] w-full max-w-[40rem] flex-1 flex-col gap-2">
                    <section className="flex h-fit w-full items-center justify-center gap-4 rounded-xl border-4 border-zinc-500 bg-white p-2 text-zinc-900">
                        <h2 className="text-[1.25em] font-bold italic">
                            {"Don't want to read?"}
                        </h2>
                        <Link
                            href={"/spin"}
                            target="_blank"
                            className="rounded-md border-2 border-zinc-900 bg-white px-2 text-[1.2em] font-bold text-zinc-900 hover:border-red-500 hover:bg-red-500 hover:text-white"
                        >
                            {"Go Spin!"}
                        </Link>
                    </section>
                    <section className="flex w-full flex-1 flex-col items-center gap-5 rounded-xl border-4 border-zinc-500 bg-white p-2 text-zinc-900">
                        <h2 className="text-[1.2em] font-bold">
                            {"Citizens of Luketown"}
                        </h2>
                        <ul className="ul flex flex-wrap items-start justify-center gap-5 text-center text-[1.05em]">
                            <li className="li w-52 max-w-full rounded-md py-1 shadow-[0_0px_10px] shadow-red-500">
                                {"ThatObserver"}
                            </li>
                            <li className="li w-52 max-w-full rounded-md py-1 shadow-[0_0px_10px] shadow-red-500">
                                {"Veggerby"}
                            </li>
                        </ul>
                        <div className="flex-1"></div>
                        <a
                            href="https://ko-fi.com/lukedot"
                            target="_blank"
                            className="w-full text-center text-[.9em] italic underline"
                        >
                            {"Pay your taxes to support this site!"}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512"
                                className="inline h-3.5 fill-zinc-900 pb-0.5 pl-1"
                            >
                                {/* Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2024 Fonticons, Inc. */}
                                <path d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z" />
                            </svg>
                        </a>
                    </section>
                </div>
                <section className="flex max-h-[30rem] w-full max-w-[40rem] min-w-72 flex-col items-center gap-1 overflow-y-auto rounded-xl border-4 border-zinc-500 bg-white p-2 text-zinc-900">
                    <h1 className="text-[1.2em] font-bold">
                        {"Read Roulette Articles by In4Fun!"}
                    </h1>
                    <h2 className="pb-1 text-[.9em]">
                        {
                            "Learn about past rivalries, the biggest what-ifs, and more!"
                        }
                    </h2>
                    <RouletteSubstackInfo />
                </section>
            </div>
        </main>
    );
}

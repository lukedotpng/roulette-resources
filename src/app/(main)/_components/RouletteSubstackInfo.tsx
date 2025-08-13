import Image from "next/image";

type SubstackResponseObject = {
    id: number;
    title: string;
    post_date: string;
    canonical_url: string;
    reactions: {
        "❤": number;
    };
    subtitle: string;
    cover_image: string;
    description: string;
    truncated_body_text: string;
    publishedBylines: [
        {
            id: number;
            name: string;
            handle: string;
            photo_url: string;
            bio: string;
            profile_set_up_at: string;
            reader_installed_at: string;
            publicationUsers: [
                {
                    id: number;
                    user_id: number;
                    publication_id: number;
                    role: string;
                    public: boolean;
                    is_primary: boolean;
                    publication: {
                        id: number;
                        name: string;
                        subdomain: string;
                        hero_text: string;
                        logo_url: string;
                        theme_var_background_pop: string;
                        email_from_name: string;
                        copyright: string;
                    };
                },
            ];
        },
    ];
    reaction_count: number;
    comment_count: number;
    child_comment_count: number;
};

export default async function RouletteSubstackInfo() {
    let hitmanrrSubstackRes = (await fetch(
        "https://hitmanrr.substack.com/api/v1/archive?sort=new&search=&offset=0&limit=0",
    )
        .then((res) => res.json())
        .catch(() => {
            console.log("Could not fetch substack data");
        })) as SubstackResponseObject[];

    if (hitmanrrSubstackRes === undefined || hitmanrrSubstackRes.length === 0) {
        return null;
    }

    if (hitmanrrSubstackRes.length > 3) {
        hitmanrrSubstackRes = hitmanrrSubstackRes.slice(0, 3);
    }

    return (
        <ul className="ul md w-full rounded-xl border-white bg-[#ffecec] shadow-md shadow-black">
            {hitmanrrSubstackRes.map((entry) => {
                const date = new Date(entry.post_date);
                const dateString =
                    date.toDateString().split(" ")[1] +
                    " " +
                    date.toDateString().split(" ")[2];

                return (
                    <li
                        key={entry.id}
                        className={
                            "li items-between group flex flex-col justify-start gap-4 p-2 last:pb-0"
                        }
                    >
                        <div className="flex h-16 items-center sm:h-20">
                            <a
                                href={entry.canonical_url}
                                target="_blank"
                                className="group m-auto flex h-full w-full flex-col"
                            >
                                <h2 className="text-[1em] font-semibold group-hover:underline">
                                    {entry.title}
                                </h2>
                                <h3 className="text-[.9em]">
                                    {entry.subtitle}
                                </h3>
                                <div className="flex-1"></div>
                                <p className="text-[.7em] text-zinc-400">
                                    <span>{dateString}</span>
                                    <span>{" - "}</span>
                                    <span>
                                        {entry.publishedBylines[0].name}
                                    </span>
                                </p>
                            </a>
                            <Image
                                src={entry.cover_image}
                                alt={"Article Cover Image"}
                                className="aspect-square h-[95%] rounded-md object-cover"
                            />
                        </div>
                        <div className="m-auto w-[95%] self-center border-t-1 border-zinc-500 group-last:border-0"></div>
                    </li>
                );
            })}
        </ul>
    );
}

"use client";

import Link from "next/link";

export default function SpinLink() {
    return (
        <Link
            href={"/spin"}
            className="flex h-full w-fit items-center px-4 font-bold outline-hidden hover:bg-red-500 hover:text-white focus:bg-red-500 focus:text-white"
            onClick={(
                event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
            ) => {
                event.currentTarget.blur();
            }}
        >
            <span>{"Spin"}</span>
        </Link>
    );
}

import { ChangeEvent } from "react";

export default function ResourceFilter({
    SetFilterQuery,
}: {
    SetFilterQuery: (filterQuery: string) => void;
}) {
    return (
        <input
            placeholder={"search..."}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
                SetFilterQuery(event.currentTarget.value);
            }}
        ></input>
    );
}

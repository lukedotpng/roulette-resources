import { IsolationInsert, IsolationSelect, UniqueKillSelect } from "@/types";

export function IsolationToMarkdown(
    isolation: IsolationSelect | IsolationInsert,
): string {
    let markdownString = "";
    if (isolation.starts) {
        markdownString += "\r\n* **Starts:** " + isolation.starts;
    }
    if (isolation.requires) {
        markdownString += "\r\n* **Requires:** " + isolation.requires;
    }
    if (isolation.timings) {
        markdownString += "\r\n* **Timings:** " + isolation.timings;
    }
    if (isolation.notes) {
        markdownString += "\r\n* **Notes:** " + isolation.notes;
    }

    if (markdownString === "") {
        markdownString += "\r\n* **Starts:** ";
        markdownString += "\r\n* **Requires:** ";
        markdownString += "\r\n* **Timings:** ";
        markdownString += "\r\n* **Notes:** ";
    }

    return markdownString;
}

export function UniqueKillToMarkdown(
    uniqueKill: UniqueKillSelect | IsolationInsert,
): string {
    let markdownString = "";
    if (uniqueKill.starts) {
        markdownString += "\r\n* **Starts:** " + uniqueKill.starts;
    }
    if (uniqueKill.requires) {
        markdownString += "\r\n* **Requires:** " + uniqueKill.requires;
    }
    if (uniqueKill.timings) {
        markdownString += "\r\n* **Timings:** " + uniqueKill.timings;
    }
    if (uniqueKill.notes) {
        markdownString += "\r\n* **Notes:** " + uniqueKill.notes;
    }

    if (markdownString === "") {
        markdownString += "\r\n* **Starts:** ";
        markdownString += "\r\n* **Requires:** ";
        markdownString += "\r\n* **Timings:** ";
        markdownString += "\r\n* **Notes:** ";
    }

    return markdownString;
}

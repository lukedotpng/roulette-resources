import { Isolation, UniqueKill } from "@/types";

export function IsolationToMarkdown(isolation: Isolation): string {
    let markdownString = "";
    if (isolation.starts !== null) {
        markdownString += "\r\n* **Starts:** " + isolation.starts;
    }
    if (isolation.requires !== null) {
        markdownString += "\r\n* **Requires:** " + isolation.requires;
    }
    if (isolation.timings !== null) {
        markdownString += "\r\n* **Timings:** " + isolation.requires;
    }
    if (isolation.notes !== null) {
        markdownString += "\r\n* **Notes:** " + isolation.notes;
    }

    return markdownString;
}

export function UniqueKillToMarkdown(uniqueKill: UniqueKill): string {
    let markdownString = "";
    if (uniqueKill.starts !== null) {
        markdownString += "\r\n* **Starts:** " + uniqueKill.starts;
    }
    if (uniqueKill.requires !== null) {
        markdownString += "\r\n* **Requires:** " + uniqueKill.requires;
    }
    if (uniqueKill.timings !== null) {
        markdownString += "\r\n* **Timings:** " + uniqueKill.requires;
    }
    if (uniqueKill.notes !== null) {
        markdownString += "\r\n* **Notes:** " + uniqueKill.notes;
    }

    return markdownString;
}

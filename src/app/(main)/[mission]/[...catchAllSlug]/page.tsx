import { notFound } from "next/navigation";

// Catch all for "mission/[slug]" not apart of set routes to reroute to not-found
export default function Page() {
    notFound();
}

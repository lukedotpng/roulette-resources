import SpinSection from "./_components/SpinSection";

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const overlayId = (await params).id;

    return <SpinSection id={overlayId} />;
}

export default function InfoSection({
    id,
    children,
}: {
    id: string;
    children: React.ReactNode;
}) {
    return (
        <section
            id={id}
            className="flex w-full scroll-m-10 flex-col justify-center gap-2.5 px-2 sm:px-5"
        >
            {children}
        </section>
    );
}

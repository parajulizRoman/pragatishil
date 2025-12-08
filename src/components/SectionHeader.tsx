interface SectionHeaderProps {
    titleEn?: string;
    titleNe?: string;
    descriptionEn?: string;
    descriptionNe?: string;
    align?: "left" | "center";
}

export function SectionHeader({ titleEn, titleNe, descriptionEn, descriptionNe, align = "center" }: SectionHeaderProps) {
    const alignClass = align === "center" ? "text-center mx-auto" : "text-left";

    // Helper to split Red/Blue text if space exists
    const splitColorTitle = (text: string) => {
        if (!text.includes(" ")) return <span className="text-brand-red">{text}</span>;

        const parts = text.split(" ");
        const mid = Math.ceil(parts.length / 2);
        const firstHalf = parts.slice(0, mid).join(" ");
        const secondHalf = parts.slice(mid).join(" ");

        return (
            <>
                <span className="text-brand-red">{firstHalf}</span>{" "}
                <span className="text-brand-blue">{secondHalf}</span>
            </>
        );
    };

    return (
        <div className={`max-w-4xl mb-12 ${alignClass}`}>
            {(titleEn || titleNe) && (
                <div className="mb-4">
                    {titleEn && <h2 className="text-3xl font-bold text-slate-900 mb-1">{titleEn}</h2>}
                    {titleNe && <h3 className="text-xl font-bold">{splitColorTitle(titleNe)}</h3>}
                </div>
            )}

            {(descriptionEn || descriptionNe) && (
                <div className="space-y-2 text-slate-600 leading-relaxed max-w-2xl mx-auto">
                    {descriptionEn && <p>{descriptionEn}</p>}
                    {descriptionNe && <p className="font-medium text-slate-500">{descriptionNe}</p>}
                </div>
            )}
        </div>
    );
}

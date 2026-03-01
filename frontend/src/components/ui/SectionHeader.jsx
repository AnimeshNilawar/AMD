export default function SectionHeader({ title, subtitle, action, onAction }) {
    return (
        <div className="flex items-baseline justify-between mb-[14px]">
            <div>
                <div className="font-display text-[19px] font-semibold">{title}</div>
                {subtitle && <div className="text-[12px] text-muted mt-0.5">{subtitle}</div>}
            </div>
            {action && (
                <span
                    className="text-[12px] font-medium text-forest-light cursor-pointer hover:underline"
                    onClick={onAction}
                >
                    {action}
                </span>
            )}
        </div>
    );
}

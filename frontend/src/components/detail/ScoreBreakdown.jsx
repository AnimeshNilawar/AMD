export default function ScoreBreakdown({ scores }) {
    if (!scores) return null;

    const bars = [
        { label: 'Popularity', value: scores.popularity, color: '#1A3A2A' },
        { label: 'Weather Bonus', value: scores.weather_bonus, color: '#0891b2' },
        { label: 'Crowd Penalty ↓', value: scores.crowd_penalty, color: '#B0302A' },
        { label: 'Your Affinity', value: scores.user_affinity, color: '#C9913A' },
    ];

    return (
        <div className="flex flex-col gap-2.5 mt-2">
            {bars.map((bar, i) => (
                <div key={i} className="flex items-center gap-2.5">
                    <div className="text-[12px] text-text-secondary w-[115px] flex-shrink-0">{bar.label}</div>
                    <div className="flex-1 h-[5px] bg-sand rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full animate-fill-bar"
                            style={{ width: `${bar.value}%`, background: bar.color }}
                        ></div>
                    </div>
                    <div
                        className="text-[11px] font-bold font-mono w-[28px] text-right"
                        style={{ color: bar.color }}
                    >
                        {bar.value}
                    </div>
                </div>
            ))}
        </div>
    );
}

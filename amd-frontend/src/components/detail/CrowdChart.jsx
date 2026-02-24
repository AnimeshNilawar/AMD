export default function CrowdChart({ timeline }) {
    if (!timeline) return null;

    const maxVal = Math.max(...timeline.hours.map(h => h.value));

    const getBarColor = (value) => {
        if (value < 35) return 'bg-crowd-low opacity-70';
        if (value < 60) return 'bg-crowd-med opacity-70';
        return 'bg-crowd-high opacity-70';
    };

    return (
        <div>
            <div className="flex items-end gap-[3px] h-[72px] mb-1.5">
                {timeline.hours.map((hour, i) => {
                    const heightPct = Math.round((hour.value / maxVal) * 100);
                    const isBest = hour.is_best_window;
                    return (
                        <div key={i} className="flex-1 flex flex-col items-center h-full relative">
                            <div
                                className={`w-full crowd-bar absolute bottom-0 ${getBarColor(hour.value)} ${isBest ? 'best-window' : ''}`}
                                style={{ height: `${heightPct}%` }}
                            ></div>
                            <div className="text-[8px] text-muted absolute -bottom-4 font-mono">
                                {hour.time}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="text-[11px] text-forest font-semibold mt-5.5">
                ✦ Best visit window: {timeline.best_window}
            </div>
        </div>
    );
}

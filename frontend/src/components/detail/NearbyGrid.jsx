export default function NearbyGrid({ items }) {
    if (!items || items.length === 0) return null;

    return (
        <div className="grid grid-cols-2 gap-2.5 mt-2">
            {items.map((item, i) => (
                <div key={i} className="bg-sand rounded-[10px] p-2.5 flex gap-2.5 items-start">
                    <div className="text-lg flex-shrink-0">{item.emoji}</div>
                    <div>
                        <div className="text-[11px] font-semibold mb-0.5">{item.name}</div>
                        <div className="text-[10px] text-muted">{item.distance_label}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}

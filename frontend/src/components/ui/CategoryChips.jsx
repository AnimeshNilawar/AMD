const CATEGORIES = [
    { id: 'All', emoji: '🗺️', label: 'All' },
    { id: 'Beaches', emoji: '🏖️', label: 'Beaches' },
    { id: 'Temples', emoji: '🛕', label: 'Temples' },
    { id: 'Mountains', emoji: '⛰️', label: 'Mountains' },
    { id: 'Trekking', emoji: '🥾', label: 'Trekking' },
    { id: 'Waterfalls', emoji: '💧', label: 'Waterfalls' },
    { id: 'Trending', emoji: '🔥', label: 'Trending' },
];

export default function CategoryChips({ activeCategory, onSelect }) {
    return (
        <div className="flex gap-[9px] overflow-x-auto pb-1 hide-scrollbar">
            {CATEGORIES.map(cat => (
                <div
                    key={cat.id}
                    className={`flex flex-col items-center gap-[7px] px-[18px] py-3.5 border-[1.5px] rounded-2xl cursor-pointer flex-shrink-0 min-w-[80px] cat-hover ${activeCategory === cat.id
                        ? 'border-forest bg-forest shadow-md -translate-y-0.5'
                        : 'bg-warm border-border'
                        }`}
                    onClick={() => onSelect(cat.id)}
                >
                    <div className="text-2xl">{cat.emoji}</div>
                    <div className={`text-[11px] font-medium whitespace-nowrap ${activeCategory === cat.id ? 'text-white' : ''
                        }`}>
                        {cat.label}
                    </div>
                </div>
            ))}
        </div>
    );
}

export { CATEGORIES };

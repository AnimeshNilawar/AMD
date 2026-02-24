import { useNavigate } from 'react-router-dom';

const GRADIENT_MAP = {
    beach: 'gradient-beach',
    forest: 'gradient-forest',
    temple: 'gradient-temple',
    mtn: 'gradient-mtn',
    water: 'gradient-water',
    cave: 'gradient-cave',
};

export default function TrendingCard({ item }) {
    const navigate = useNavigate();
    const gradient = GRADIENT_MAP[item.category] || 'gradient-forest';

    return (
        <div
            className="min-w-[185px] bg-warm rounded-2xl border border-border overflow-hidden cursor-pointer flex-shrink-0 card-hover-sm"
            onClick={() => navigate(`/place/${item.id}`)}
        >
            <div className={`h-[90px] relative flex items-center justify-center text-[32px] ${gradient}`}>
                <div className="absolute top-2.5 left-2.5 px-2.5 py-[3px] rounded-full text-[9px] font-bold bg-terra/90 text-white z-[2]">
                    {item.badge}
                </div>
                {item.emoji}
            </div>
            <div className="py-[9px] px-[11px]">
                <div className="text-[12px] font-semibold mb-0.5">{item.name}</div>
                <div className="text-[10px] text-terra font-semibold">{item.reason_text}</div>
            </div>
        </div>
    );
}

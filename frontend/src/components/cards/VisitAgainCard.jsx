import { useNavigate } from 'react-router-dom';

const GRADIENT_MAP = {
    beach: 'gradient-beach',
    forest: 'gradient-forest',
    temple: 'gradient-temple',
    mtn: 'gradient-mtn',
    water: 'gradient-water',
    cave: 'gradient-cave',
};

const CROWD_COLOR = {
    low: 'text-crowd-low',
    med: 'text-crowd-med',
    high: 'text-crowd-high',
};

export default function VisitAgainCard({ item }) {
    const navigate = useNavigate();
    const gradient = GRADIENT_MAP[item.category] || 'gradient-forest';
    const crowdColor = CROWD_COLOR[item.current_crowd_color] || 'text-crowd-low';

    return (
        <div
            className="min-w-[165px] bg-warm border border-border rounded-2xl overflow-hidden cursor-pointer flex-shrink-0 card-hover-sm"
            onClick={() => navigate(`/place/${item.placeId}`)}
        >
            <div className={`h-[82px] flex items-center justify-center text-[32px] ${gradient}`}>
                {item.emoji}
            </div>
            <div className="p-2.5 px-3">
                <div className="text-[12px] font-semibold mb-0.5">{item.name}</div>
                <div className="text-[10px] text-muted mb-1">You visited {item.lastVisited}</div>
                <div className={`text-[10px] font-semibold ${crowdColor}`}>● {item.current_crowd_label}</div>
            </div>
        </div>
    );
}

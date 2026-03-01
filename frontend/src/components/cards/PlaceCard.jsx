import { useNavigate } from 'react-router-dom';

const GRADIENT_MAP = {
    beach: 'gradient-beach',
    forest: 'gradient-forest',
    temple: 'gradient-temple',
    mtn: 'gradient-mtn',
    water: 'gradient-water',
    cave: 'gradient-cave',
};

const CROWD_STYLES = {
    low: { text: '● LOW CROWD', className: 'text-crowd-low bg-white/90' },
    med: { text: '● MED CROWD', className: 'text-crowd-med bg-white/90' },
    high: { text: '● HIGH CROWD', className: 'text-crowd-high bg-white/90' },
};

export default function PlaceCard({ place, onClick }) {
    const navigate = useNavigate();
    const gradient = GRADIENT_MAP[place.bg] || 'gradient-forest';
    const crowd = CROWD_STYLES[place.crowd_level] || CROWD_STYLES.low;

    const handleClick = () => {
        if (onClick) {
            onClick(place);
        } else {
            navigate(`/place/${place.id}`);
        }
    };

    return (
        <div
            className="bg-warm rounded-2xl overflow-hidden border border-border cursor-pointer shadow-sm card-hover"
            onClick={handleClick}
        >
            {/* Image area */}
            <div className={`h-[130px] relative flex items-end p-[9px] overflow-hidden ${gradient}`}>
                <div className="absolute inset-0 flex items-center justify-center text-[48px]">
                    {place.emoji}
                </div>
                <div
                    className={`absolute top-2.5 right-2.5 px-2.5 py-[3px] rounded-full text-[9px] font-bold tracking-wider font-mono backdrop-blur-md z-[2] ${crowd.className}`}
                >
                    {crowd.text}
                </div>
            </div>

            {/* Info area */}
            <div className="p-3">
                <div className="text-[13px] font-semibold mb-[3px]">{place.name}</div>
                <div className="text-[10px] text-muted mb-[7px] flex items-center gap-[5px]">
                    {place.distance_km} km
                    <span className="w-[3px] h-[3px] bg-border rounded-full inline-block"></span>
                    {place.drive_time}
                </div>
                <div className="flex items-center justify-between">
                    <div className="text-[11px] font-semibold text-gold">⭐ {place.experience_score}/100</div>
                    <div className="text-[10px] text-muted font-medium">{place.price_label}</div>
                </div>
            </div>
        </div>
    );
}

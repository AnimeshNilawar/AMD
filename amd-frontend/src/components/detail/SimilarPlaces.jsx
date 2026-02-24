import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';

const GRADIENT_MAP = {
    beach: 'gradient-beach',
    forest: 'gradient-forest',
    temple: 'gradient-temple',
    mtn: 'gradient-mtn',
    water: 'gradient-water',
    cave: 'gradient-cave',
};

export default function SimilarPlaces({ items }) {
    const navigate = useNavigate();
    const { showToast } = useToast();

    if (!items || items.length === 0) return null;

    const handleClick = (item) => {
        if (['rajmachi', 'sinhagad', 'tamhini', 'alibaug', 'karla', 'siddhivinayak'].includes(item.id)) {
            navigate(`/place/${item.id}`);
        } else {
            showToast(`Loading ${item.name}...`);
        }
    };

    return (
        <div className="bg-warm border border-border rounded-2xl p-4.5 mb-3.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-muted mb-3">
                Similar Spots with Lower Crowd
            </div>
            <div className="grid grid-cols-3 gap-2.5 mt-2">
                {items.map((item, i) => {
                    const gradient = GRADIENT_MAP[item.category] || 'gradient-forest';
                    return (
                        <div
                            key={i}
                            className="bg-warm border border-border rounded-[10px] overflow-hidden cursor-pointer card-hover-sm"
                            onClick={() => handleClick(item)}
                        >
                            <div className={`h-[62px] flex items-center justify-center text-[26px] ${gradient}`}>
                                {item.emoji}
                            </div>
                            <div className="p-2 px-2.5">
                                <div className="text-[11px] font-semibold">{item.name}</div>
                                <div className="text-[9px] text-crowd-low font-semibold">● {item.crowd_level === 'low' ? 'Low' : item.crowd_level === 'med' ? 'Med' : 'High'} crowd</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

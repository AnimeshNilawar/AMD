import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import ChatSidebar from '../components/chat/ChatSidebar';
import PlaceCard from '../components/cards/PlaceCard';
import { getPlaces } from '../services/api';

const SORT_OPTIONS = [
    { id: 'distance', label: '📍 Distance' },
    { id: 'score', label: '⭐ Experience Score' },
    { id: 'crowd', label: '🧘 Least Crowded' },
];

export default function ListPage() {
    const { category = 'All' } = useParams();
    const navigate = useNavigate();
    const [places, setPlaces] = useState([]);
    const [sortBy, setSortBy] = useState('distance');

    useEffect(() => {
        getPlaces({ category, sortBy }).then(setPlaces);
    }, [category, sortBy]);

    const title = category === 'All'
        ? 'All Places Near Pune'
        : `${category} Near Pune`;

    const initialMessages = [
        {
            type: 'bot',
            label: 'WanderAI ✦',
            text: "Browsing? Tell me your budget and dates and I'll narrow it down instantly. 🎯",
        },
    ];

    return (
        <div className="h-screen flex flex-col overflow-hidden">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">
                        {/* Header */}
                        <div className="mb-4.5">
                            <div className="flex items-center gap-3 mb-2.5">
                                <button
                                    className="px-3.5 py-1.5 bg-warm border-[1.5px] border-border rounded-full text-[12px] cursor-pointer text-text-secondary font-body transition-all hover:border-forest hover:text-forest"
                                    onClick={() => navigate('/')}
                                >
                                    ← Back
                                </button>
                                <div className="font-display text-[20px] font-semibold">{title}</div>
                            </div>
                            <div className="flex gap-2">
                                {SORT_OPTIONS.map(opt => (
                                    <button
                                        key={opt.id}
                                        className={`px-3 py-1.5 rounded-full text-[11px] font-medium cursor-pointer border-[1.5px] font-body transition-all ${sortBy === opt.id
                                            ? 'bg-forest border-forest text-white'
                                            : 'bg-warm border-border text-text-secondary hover:border-forest hover:text-forest'
                                            }`}
                                        onClick={() => setSortBy(opt.id)}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Places Grid */}
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
                            {places.map((place) => (
                                <PlaceCard key={place.id} place={place} />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="w-[320px] flex-shrink-0 border-l border-border overflow-hidden">
                    <ChatSidebar
                        pageId="list"
                        subtitle="Browsing? Tell me your budget and dates and I'll narrow it down instantly. 🎯"
                        initialMessages={initialMessages}
                    />
                </div>
            </div>
        </div>
    );
}

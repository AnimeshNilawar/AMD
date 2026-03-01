import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import ChatSidebar from '../components/chat/ChatSidebar';
import CrowdChart from '../components/detail/CrowdChart';
import ScoreBreakdown from '../components/detail/ScoreBreakdown';
import NearbyGrid from '../components/detail/NearbyGrid';
import TeamPanel from '../components/detail/TeamPanel';
import SimilarPlaces from '../components/detail/SimilarPlaces';
import { getPlaceById } from '../services/api';
import { useChat } from '../context/ChatContext';

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

export default function DetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { fillAndSend } = useChat();
    const [place, setPlace] = useState(null);
    const [showItinerary, setShowItinerary] = useState(false);

    useEffect(() => {
        setShowItinerary(false);
        getPlaceById(id).then((data) => {
            if (data) setPlace(data);
            else navigate('/');
        });
    }, [id, navigate]);

    if (!place) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center text-muted">Loading...</div>
            </div>
        );
    }

    const gradient = GRADIENT_MAP[place.bg] || 'gradient-forest';
    const crowd = CROWD_STYLES[place.crowd_level] || CROWD_STYLES.low;
    const hasHighCrowd = place.scores?.crowd_penalty > 75;

    const chatSubtitle = `Planning a trip to ${place.name}? Tell me your dates & group size.`;

    const initialMessages = showItinerary
        ? [
            {
                type: 'bot',
                label: 'WanderAI ✦',
                text: place.itinerary,
                html: true,
            },
        ]
        : [
            {
                type: 'bot',
                label: 'WanderAI ✦',
                text: `Great choice! ${place.name} is rated ${place.experience_score}/100. Best time: ${place.crowd_timeline?.best_window}. Want me to build your full day plan? 🗓️`,
            },
        ];

    const quickReplies = showItinerary
        ? []
        : [
            { label: '🗓️ Build my full day plan', text: 'Build my full day plan' },
            { label: '🏨 Find hotels nearby', text: 'Find hotels near this location under ₹2,000 per night' },
            { label: '🍜 Best food spots nearby', text: 'What food places are closest to here?' },
        ];

    const handleQuickReply = (text) => {
        if (text === 'Build my full day plan') {
            setShowItinerary(true);
        } else {
            fillAndSend(`detail-${id}`, text);
        }
    };

    return (
        <div className="h-screen flex flex-col overflow-hidden">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">
                        {/* Hero */}
                        <div className={`h-[240px] rounded-2xl relative flex items-end p-5.5 overflow-hidden mb-5.5 ${gradient}`}>
                            <div className="absolute inset-0 flex items-center justify-center text-7xl">
                                {place.emoji}
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

                            {/* Back button */}
                            <button
                                className="absolute top-4.5 left-4.5 z-[2] bg-white/20 backdrop-blur-md border border-white/30 text-white px-3.5 py-1.5 rounded-full cursor-pointer text-[12px] font-medium font-body transition-colors hover:bg-white/30"
                                onClick={() => navigate(-1)}
                            >
                                ← Back
                            </button>

                            {/* Crowd badge */}
                            <div
                                className={`absolute top-4.5 right-4.5 px-2.5 py-[3px] rounded-full text-[9px] font-bold tracking-wider font-mono backdrop-blur-md z-[2] ${crowd.className}`}
                            >
                                {crowd.text}
                            </div>

                            {/* Content */}
                            <div className="relative z-[2]">
                                <div className="flex gap-2 mb-2">
                                    {place.tags.map((tag, i) => (
                                        <span key={i} className="bg-white/25 text-white px-2.5 py-0.5 rounded-full text-[10px] font-medium">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <h1 className="font-display text-[26px] text-white font-bold">{place.name}</h1>
                                <div className="flex gap-1.5 text-white/80 text-[12px] mt-1">
                                    📍 {place.distance_km} km · {place.drive_time} drive &nbsp;·&nbsp; 💰 {place.price_label}
                                </div>
                            </div>
                        </div>

                        {/* High crowd warning */}
                        {hasHighCrowd && (
                            <div className="bg-crowd-high-bg border border-crowd-high/20 rounded-2xl px-4 py-3 mb-4 text-[12px] text-crowd-high font-medium">
                                ⚠️ High crowd expected. Best time to visit: {place.crowd_timeline?.best_window}
                            </div>
                        )}

                        {/* First row: About + Crowd Timeline */}
                        <div className="grid grid-cols-2 gap-3.5 mb-3.5">
                            <div className="bg-warm border border-border rounded-2xl p-4.5">
                                <div className="text-[11px] font-bold uppercase tracking-wider text-muted mb-3">
                                    About This Place
                                </div>
                                <p className="text-[13px] text-text-secondary leading-relaxed">
                                    {place.ai_description}
                                </p>
                                <div className="inline-flex items-center gap-1 bg-crowd-low-bg text-crowd-low text-[9px] font-bold px-2 py-0.5 rounded mt-2.5">
                                    ✦ AI-generated · Verified by our team
                                </div>
                            </div>
                            <div className="bg-warm border border-border rounded-2xl p-4.5">
                                <div className="text-[11px] font-bold uppercase tracking-wider text-muted mb-3">
                                    Crowd Timeline · Today
                                </div>
                                <CrowdChart timeline={place.crowd_timeline} />
                            </div>
                        </div>

                        {/* Second row: Score + Nearby */}
                        <div className="grid grid-cols-2 gap-3.5 mb-3.5">
                            <div className="bg-warm border border-border rounded-2xl p-4.5">
                                <div className="text-[11px] font-bold uppercase tracking-wider text-muted mb-3">
                                    Experience Score Breakdown
                                </div>
                                <ScoreBreakdown scores={place.scores} />
                            </div>
                            <div className="bg-warm border border-border rounded-2xl p-4.5">
                                <div className="text-[11px] font-bold uppercase tracking-wider text-muted mb-3">
                                    Nearby Food & Stay
                                </div>
                                <NearbyGrid items={place.nearby} />
                            </div>
                        </div>

                        {/* Teams */}
                        <TeamPanel teams={place.teams} placeName={place.name} />

                        {/* Similar Places */}
                        <SimilarPlaces items={place.similar} />
                    </div>
                </div>

                <div className="w-[320px] flex-shrink-0 border-l border-border overflow-hidden">
                    <ChatSidebar
                        key={`${id}-${showItinerary}`}
                        pageId={`detail-${id}`}
                        subtitle={chatSubtitle}
                        initialMessages={initialMessages}
                        quickReplies={quickReplies}
                        onQuickReply={handleQuickReply}
                    />
                </div>
            </div>
        </div>
    );
}

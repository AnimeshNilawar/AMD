import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import ChatSidebar from '../components/chat/ChatSidebar';
import HeroBanner from '../components/home/HeroBanner';
import WelcomeBackStrip from '../components/home/WelcomeBackStrip';
import CategoryChips from '../components/ui/CategoryChips';
import SectionHeader from '../components/ui/SectionHeader';
import PlaceCard from '../components/cards/PlaceCard';
import TrendingCard from '../components/cards/TrendingCard';
import VisitAgainCard from '../components/cards/VisitAgainCard';
import { getPlaces, getTrendingPlaces, getUserProfile, getUserHistory, getRecommendations, getSimilarUserPlaces } from '../services/api';

export default function HomePage() {
    const navigate = useNavigate();
    const [isReturningUser, setIsReturningUser] = useState(false);
    const [places, setPlaces] = useState([]);
    const [trending, setTrending] = useState([]);
    const [user, setUser] = useState(null);
    const [history, setHistory] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [similarUsers, setSimilarUsers] = useState([]);
    const [activeCategory, setActiveCategory] = useState('All');

    useEffect(() => {
        getPlaces().then(setPlaces);
        getTrendingPlaces().then(setTrending);
    }, []);

    useEffect(() => {
        if (isReturningUser) {
            getUserProfile().then(setUser);
            getUserHistory().then(setHistory);
            getRecommendations().then(setRecommendations);
            getSimilarUserPlaces().then(setSimilarUsers);
        }
    }, [isReturningUser]);

    const handleCategorySelect = (catId) => {
        setActiveCategory(catId);
        navigate(`/list/${catId}`);
    };

    const pageId = isReturningUser ? 'home-returning' : 'home-new';

    const chatSubtitle = isReturningUser
        ? `I know you love ${user?.interests?.[0] || 'travel'}. Want to plan something new?`
        : "Tell me where you want to go and I'll build your perfect trip";

    const initialMessages = isReturningUser
        ? [
            {
                type: 'bot',
                label: 'WanderAI ✦',
                text: `Hey ${user?.firstName || 'there'}! 👋 Based on your Rajmachi trip, you might love Harishchandragad — 93/100 score and LOW crowd this weekend!`,
            },
        ]
        : [
            {
                type: 'bot',
                label: 'WanderAI ✦',
                text: "Hey! 👋 Tell me your travel style — budget, dates, who's coming, and what you love doing.",
            },
        ];

    const quickReplies = isReturningUser
        ? [
            { label: '🥾 Similar to Rajmachi, but new', text: 'Plan a similar trek to Rajmachi but somewhere new this weekend' },
            { label: '👥 Plan for mixed group of 5', text: 'My group of 5 is free Saturday. Mix of beach lovers and trekkers' },
        ]
        : [
            { label: '🏖️ Beach weekend for 4 friends', text: 'Plan a weekend trip for 4 friends, budget ₹3,000 each, love beaches' },
            { label: '🧘 Least crowded treks', text: 'Find me the least crowded treks near Pune this Saturday' },
            { label: '🎒 Solo trip under ₹2,000', text: 'I have ₹2,000 budget, want to go somewhere solo Sunday' },
        ];

    return (
        <div className="h-screen flex flex-col overflow-hidden">
            <Navbar
                showSignIn={!isReturningUser}
                onSignIn={() => setIsReturningUser(true)}
            />
            <div className="flex flex-1 overflow-hidden">
                {/* Main Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">
                        {/* Returning User Content */}
                        {isReturningUser && user && (
                            <>
                                <WelcomeBackStrip user={user} />

                                <SectionHeader
                                    title="🔄 Visit Again"
                                    subtitle="Your past spots have LOW crowd this week — good time to revisit!"
                                />
                                <div className="flex gap-[11px] overflow-x-auto pb-1 mb-7 hide-scrollbar">
                                    {history.map((item) => (
                                        <VisitAgainCard key={item.placeId} item={item} />
                                    ))}
                                </div>

                                <SectionHeader
                                    title="Based on Your Trips"
                                    subtitle={`You love ${user.interests.join(', ')}`}
                                />
                                <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-[14px] mb-7">
                                    {recommendations.map((place) => (
                                        <PlaceCard key={place.id} place={place} />
                                    ))}
                                </div>

                                <SectionHeader
                                    title="🧑‍🤝‍🧑 Travellers Like You Also Visited"
                                    subtitle={`People who love ${user.interests[0]} + ${user.interests[1]} near Pune`}
                                />
                                <div className="flex gap-2.5 overflow-x-auto hide-scrollbar">
                                    {similarUsers.map((item) => (
                                        <div
                                            key={item.placeId}
                                            className="flex flex-col items-center gap-[7px] px-4.5 py-3.5 bg-warm border-[1.5px] border-border rounded-2xl cursor-pointer flex-shrink-0 min-w-[80px] cat-hover"
                                            onClick={() => navigate(`/place/${item.placeId}`)}
                                        >
                                            <div className="text-2xl">{item.emoji}</div>
                                            <div className="text-[11px] font-medium whitespace-nowrap">{item.name}</div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* New User Content */}
                        {!isReturningUser && (
                            <>
                                <HeroBanner />

                                <SectionHeader
                                    title="Explore by Category"
                                    subtitle="Tap a category to browse nearby spots"
                                />
                                <div className="mb-7">
                                    <CategoryChips activeCategory={activeCategory} onSelect={handleCategorySelect} />
                                </div>

                                <SectionHeader
                                    title="Popular Near Pune"
                                    subtitle="Sorted by distance · Crowd-indexed"
                                    action="See all →"
                                    onAction={() => navigate('/list/All')}
                                />
                                <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-[14px] mb-7">
                                    {places.map((place) => (
                                        <PlaceCard key={place.id} place={place} />
                                    ))}
                                </div>

                                <SectionHeader
                                    title="🔥 Hot Right Now"
                                    subtitle="Places everyone's talking about this week"
                                />
                                <div className="flex gap-[11px] overflow-x-auto pb-1 mb-7 hide-scrollbar">
                                    {trending.map((item) => (
                                        <TrendingCard key={item.id} item={item} />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Chat Sidebar */}
                <div className="w-[320px] flex-shrink-0 border-l border-border overflow-hidden">
                    <ChatSidebar
                        pageId={pageId}
                        subtitle={chatSubtitle}
                        initialMessages={initialMessages}
                        quickReplies={quickReplies}
                    />
                </div>
            </div>
        </div>
    );
}

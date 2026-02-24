import { useChat } from '../../context/ChatContext';

export default function HeroBanner({ city = 'Pune' }) {
    const { fillAndSend } = useChat();

    return (
        <div className="relative bg-gradient-to-br from-forest via-forest-mid to-[#2a4a38] rounded-2xl px-9 py-8 mb-7 overflow-hidden">
            {/* Decorative background circle */}
            <div className="absolute -top-10 -right-10 w-[180px] h-[180px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)' }}></div>

            <div className="relative z-10">
                <div className="text-[12px] text-white/60 mb-1.5">👋 Welcome to WanderAI</div>
                <h1 className="font-display text-[27px] text-white font-bold leading-tight mb-2">
                    Discover places that <span className="text-gold-light">fit your vibe</span>
                </h1>
                <p className="text-[13px] text-white/65 mb-5">
                    Crowd-aware · Budget-smart · AI-planned. Popular spots near {city}, sorted just for you.
                </p>
                <div className="flex gap-2.5 flex-wrap">
                    <button
                        className="px-4 py-2.5 bg-terra border-terra border rounded-full text-white text-[12px] font-medium cursor-pointer transition-all hover:brightness-110 font-body"
                        onClick={() => fillAndSend('home-new', 'Plan a weekend trip for 4 friends, budget ₹3,000 each, love beaches 🏖️')}
                    >
                        ✦ Plan My Weekend Trip
                    </button>
                    <button
                        className="px-4 py-2.5 bg-white/12 border border-white/20 rounded-full text-white text-[12px] font-medium cursor-pointer transition-all hover:bg-white/22 font-body"
                        onClick={() => fillAndSend('home-new', 'Show me the least crowded places near Pune this weekend')}
                    >
                        🧘 Avoid Crowds
                    </button>
                    <button
                        className="px-4 py-2.5 bg-white/12 border border-white/20 rounded-full text-white text-[12px] font-medium cursor-pointer transition-all hover:bg-white/22 font-body"
                        onClick={() => fillAndSend('home-new', 'Best treks near Pune for beginners in February?')}
                    >
                        🥾 Beginner Treks
                    </button>
                </div>
            </div>
        </div>
    );
}

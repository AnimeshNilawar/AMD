export default function WelcomeBackStrip({ user }) {
    const name = user?.firstName || user?.user_metadata?.full_name?.split(' ')[0] || 'Traveller';

    return (
        <div className="bg-gradient-to-r from-crowd-low-bg to-[#f8fef9] border border-crowd-low/20 rounded-2xl px-4.5 py-3.5 flex items-center justify-between mb-5">
            <div className="text-[13px] text-forest font-medium">
                Welcome back, {name}! 👋 Ready to plan your next adventure?
            </div>
            <div className="w-[38px] h-[38px] bg-forest rounded-full flex items-center justify-center text-white text-[16px] font-bold font-display">
                {name[0]}
            </div>
        </div>
    );
}


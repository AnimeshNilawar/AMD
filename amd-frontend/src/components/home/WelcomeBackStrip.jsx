export default function WelcomeBackStrip({ user }) {
    return (
        <div className="bg-gradient-to-r from-crowd-low-bg to-[#f8fef9] border border-crowd-low/20 rounded-2xl px-4.5 py-3.5 flex items-center justify-between mb-5">
            <div>
                <div className="text-[13px] text-forest font-medium">
                    Welcome back, {user.firstName}! 👋
                </div>
                <div className="text-[11px] text-muted mt-0.5">
                    Based on your past {user.tripCount} trips · Last visit: {user.lastVisit.placeName} ({user.lastVisit.date})
                </div>
            </div>
            <div className="w-[38px] h-[38px] bg-forest rounded-full flex items-center justify-center text-white text-[16px] font-bold font-display">
                {user.firstName[0]}
            </div>
        </div>
    );
}

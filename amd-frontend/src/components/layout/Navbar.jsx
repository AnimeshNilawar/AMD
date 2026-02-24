import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';

export default function Navbar({ city = 'Pune', state = 'MH', showSignIn = false, onSignIn }) {
    const navigate = useNavigate();
    const { showToast } = useToast();

    return (
        <nav className="bg-warm border-b border-border px-8 h-[60px] flex items-center gap-5 sticky top-0 z-50 flex-shrink-0">
            {/* Logo */}
            <div
                className="font-display text-[21px] font-bold text-forest cursor-pointer whitespace-nowrap"
                onClick={() => navigate('/')}
            >
                Wander<span className="text-terra">AI</span>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-[380px] flex items-center gap-2 bg-sand border-[1.5px] border-border rounded-full px-4 py-2 text-[13px] text-muted">
                🔍 Search places, treks, beaches…
            </div>

            {/* Location Chip */}
            <div
                className="flex items-center gap-1.5 text-[12px] font-semibold text-forest bg-crowd-low-bg px-3.5 py-1.5 rounded-full cursor-pointer whitespace-nowrap hover:bg-crowd-low-bg/80 transition-colors"
                onClick={() => showToast(`📍 Location detected: ${city}, ${state}`)}
            >
                📍 {city}, {state} ▾
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 ml-auto">
                {showSignIn && (
                    <button
                        className="px-4 py-[7px] rounded-full text-[12px] font-semibold cursor-pointer bg-transparent text-text-secondary border-[1.5px] border-border hover:border-forest hover:text-forest transition-all font-body"
                        onClick={onSignIn}
                    >
                        Sign In
                    </button>
                )}
                <button
                    className="px-4 py-[7px] rounded-full text-[12px] font-semibold cursor-pointer bg-forest text-white border-none hover:bg-forest-mid transition-all font-body"
                    onClick={() => showToast('✨ Starting your trip plan...')}
                >
                    Plan a Trip ✦
                </button>
            </div>
        </nav>
    );
}

import { useToast } from '../../context/ToastContext';

export default function TeamPanel({ teams, placeName }) {
    const { showToast } = useToast();

    return (
        <div className="bg-gradient-to-br from-crowd-low-bg to-[#f0faf4] border-[1.5px] border-crowd-low/20 rounded-2xl p-4.5 mb-3.5">
            <div className="text-[13px] font-bold text-forest mb-1">👥 Join a Group · Solo Traveller?</div>
            <div className="text-[12px] text-muted mb-3">
                Connect with travellers heading to {placeName}
            </div>

            <div className="flex flex-col gap-2.5">
                {teams.length > 0 ? (
                    teams.map((team) => (
                        <div
                            key={team.teamId}
                            className="bg-white rounded-[10px] px-3.5 py-3 flex items-center justify-between border border-border"
                        >
                            <div className="text-[12px]">
                                <div className="font-semibold text-text-primary">{team.name}</div>
                                <div className="text-[10px] text-muted mt-0.5">
                                    {team.memberCount} members · {team.date} · {team.spotsLeft} spots left
                                </div>
                            </div>
                            <button
                                className="px-3.5 py-1.5 bg-forest text-white rounded-full text-[11px] font-semibold cursor-pointer transition-colors hover:bg-forest-mid font-body border-none"
                                onClick={() => showToast(`✅ Applied to join ${team.name}!`)}
                            >
                                Apply
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="text-[12px] text-muted py-2.5">
                        No open groups yet. Be the first to create one!
                    </div>
                )}
            </div>
        </div>
    );
}

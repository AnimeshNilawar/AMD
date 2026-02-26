import { useState, useEffect, useRef } from 'react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';

/* ── Typing dots ─────────────────────────────────────────── */
function TypingIndicator() {
    return (
        <div className="animate-message-in max-w-full">
            <div className="text-[10px] text-muted mb-1 font-bold uppercase tracking-wider">WanderAI ✦</div>
            <div className="px-3.5 py-2.5 rounded-xl bg-sand text-text-primary rounded-bl-sm inline-flex items-center gap-1.5">
                <span className="typing-dot w-1.5 h-1.5 bg-muted rounded-full inline-block"></span>
                <span className="typing-dot w-1.5 h-1.5 bg-muted rounded-full inline-block"></span>
                <span className="typing-dot w-1.5 h-1.5 bg-muted rounded-full inline-block"></span>
            </div>
        </div>
    );
}

/* ── Itinerary card ──────────────────────────────────────── */
function ItineraryCard({ data }) {
    const [expandedDay, setExpandedDay] = useState(0);
    if (!data) return null;

    return (
        <div className="mt-2 space-y-2">
            <div className="bg-gradient-to-r from-forest to-forest-mid rounded-xl px-3.5 py-2.5 text-white">
                <div className="text-[13px] font-bold">🗓️ {data.destination}</div>
                <div className="text-[10px] opacity-80">{data.duration} day trip · {data.total_estimated_cost || 'Budget TBD'}</div>
            </div>
            <div className="flex gap-1">
                {data.days?.map((day, i) => (
                    <button
                        key={i}
                        className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer border-none transition-all font-body ${expandedDay === i ? 'bg-forest text-white' : 'bg-sand text-muted hover:bg-border'}`}
                        onClick={() => setExpandedDay(i)}
                    >
                        Day {day.day}
                    </button>
                ))}
            </div>
            {data.days?.[expandedDay] && (
                <div className="space-y-1.5">
                    {data.days[expandedDay].schedule?.map((item, i) => (
                        <div key={i} className="flex gap-2 items-start bg-warm border border-border rounded-lg px-2.5 py-2">
                            <div className="w-[6px] h-[6px] rounded-full bg-forest mt-1.5 flex-shrink-0"></div>
                            <div className="text-[11px] leading-snug text-text-primary">
                                {item.activity}
                                {item.cost && <span className="text-muted ml-1">· {item.cost}</span>}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {data.packing_list?.length > 0 && (
                <div className="bg-crowd-low-bg/50 border border-crowd-low/20 rounded-xl px-3 py-2">
                    <div className="text-[10px] font-bold text-forest uppercase tracking-wider mb-1">🎒 Pack</div>
                    <div className="text-[10px] text-text-secondary leading-relaxed">{data.packing_list.join(' · ')}</div>
                </div>
            )}
            {data.important_notes?.length > 0 && (
                <div className="bg-crowd-med-bg/50 border border-crowd-med/20 rounded-xl px-3 py-2">
                    <div className="text-[10px] font-bold text-crowd-med uppercase tracking-wider mb-1">⚠️ Tips</div>
                    {data.important_notes.map((note, i) => (
                        <div key={i} className="text-[10px] text-text-secondary leading-relaxed">• {note}</div>
                    ))}
                </div>
            )}
        </div>
    );
}

/* ── Session list view ───────────────────────────────────── */
function SessionListView({ pageId }) {
    const { sessions, sessionsLoading, startNewSession, openSession, removeSession } = useChat();
    const [deletingId, setDeletingId] = useState(null);

    const handleDelete = async (e, sessionId) => {
        e.stopPropagation();
        setDeletingId(sessionId);
        await removeSession(sessionId);
        setDeletingId(null);
    };

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        const now = new Date();
        const diff = now - d;
        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    };

    return (
        <div className="flex-1 overflow-y-auto custom-scrollbar-thin">
            {/* New chat button */}
            <div className="px-3.5 pt-3.5 pb-2">
                <button
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-forest text-white rounded-xl text-[12px] font-semibold cursor-pointer border-none hover:bg-forest-mid transition-all font-body"
                    onClick={() => startNewSession(pageId)}
                >
                    <span className="text-[16px] leading-none">+</span>
                    New Chat
                </button>
            </div>

            {/* Session list */}
            <div className="px-3.5 pb-3.5">
                {sessionsLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="flex gap-1.5">
                            <span className="typing-dot w-2 h-2 bg-muted rounded-full inline-block"></span>
                            <span className="typing-dot w-2 h-2 bg-muted rounded-full inline-block"></span>
                            <span className="typing-dot w-2 h-2 bg-muted rounded-full inline-block"></span>
                        </div>
                    </div>
                ) : sessions.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="text-[28px] mb-2">💬</div>
                        <div className="text-[12px] text-muted font-medium">No conversations yet</div>
                        <div className="text-[11px] text-muted mt-0.5">Start a new chat to plan your trip!</div>
                    </div>
                ) : (
                    <div className="space-y-1.5 mt-1">
                        <div className="text-[10px] text-muted font-bold uppercase tracking-wider px-1 mb-2">
                            Recent Conversations
                        </div>
                        {sessions.map((session) => (
                            <div
                                key={session.id}
                                className="group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all hover:bg-sand border border-transparent hover:border-border"
                                onClick={() => openSession(pageId, session.id)}
                            >
                                <div className="w-[28px] h-[28px] bg-crowd-low-bg rounded-lg flex items-center justify-center text-[13px] flex-shrink-0">
                                    💬
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-[12px] font-medium text-text-primary truncate">
                                        {session.title || 'Untitled Chat'}
                                    </div>
                                    <div className="text-[10px] text-muted">
                                        {formatDate(session.updated_at || session.created_at)}
                                    </div>
                                </div>
                                <button
                                    className="opacity-0 group-hover:opacity-100 w-[24px] h-[24px] flex items-center justify-center rounded-lg text-[12px] bg-transparent border-none cursor-pointer text-muted hover:text-crowd-high hover:bg-crowd-high-bg transition-all flex-shrink-0"
                                    onClick={(e) => handleDelete(e, session.id)}
                                    disabled={deletingId === session.id}
                                    title="Delete session"
                                >
                                    {deletingId === session.id ? '…' : '✕'}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

/* ── Main ChatSidebar ────────────────────────────────────── */
export default function ChatSidebar({ pageId, subtitle, initialMessages = [], quickReplies = [], onQuickReply }) {
    const { getMessages, sendMessage, fillAndSend, isTyping, showSessionList, showSessions, startNewSession, activeSessionId } = useChat();
    const { isAuthenticated } = useAuth();
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    const dynamicMessages = getMessages(pageId);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [dynamicMessages, isTyping]);

    const handleSend = () => {
        if (!input.trim()) return;
        sendMessage(pageId, input);
        setInput('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    // Show session list for authenticated users when no active chat
    const shouldShowSessionList = isAuthenticated && showSessionList && dynamicMessages.length === 0;

    return (
        <div className="w-full h-full bg-warm flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-4.5 pt-4 pb-3 border-b border-border">
                <div className="flex items-center gap-2.5 mb-1">
                    <div className="w-[30px] h-[30px] bg-gradient-to-br from-forest to-forest-light rounded-full flex items-center justify-center text-[13px] flex-shrink-0 text-white">
                        ✦
                    </div>
                    <div className="flex-1">
                        <div className="text-[13px] font-semibold">WanderAI Assistant</div>
                        <div className="text-[11px] text-crowd-low font-medium flex items-center gap-1">
                            <span className="w-[5px] h-[5px] bg-crowd-low rounded-full inline-block"></span>
                            Online
                        </div>
                    </div>
                    {/* Action buttons for authenticated users */}
                    {isAuthenticated && (
                        <div className="flex gap-1">
                            {!shouldShowSessionList && (
                                <button
                                    className="w-[28px] h-[28px] flex items-center justify-center rounded-lg text-[14px] bg-transparent border-[1.5px] border-border cursor-pointer text-muted hover:text-forest hover:border-forest transition-all"
                                    onClick={() => showSessions()}
                                    title="All chats"
                                >
                                    ☰
                                </button>
                            )}
                            <button
                                className="w-[28px] h-[28px] flex items-center justify-center rounded-lg text-[16px] bg-forest border-none cursor-pointer text-white hover:bg-forest-mid transition-all"
                                onClick={() => startNewSession(pageId)}
                                title="New chat"
                            >
                                +
                            </button>
                        </div>
                    )}
                </div>
                <div className="text-[11px] text-muted">{subtitle}</div>
            </div>

            {/* Session List View */}
            {shouldShowSessionList ? (
                <SessionListView pageId={pageId} />
            ) : (
                <>
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-3.5 py-3.5 flex flex-col gap-2.5 custom-scrollbar-thin">
                        {/* Initial (static) messages — only show when no active session loaded */}
                        {!activeSessionId && initialMessages.map((msg, i) => (
                            <div key={`init-${i}`} className={`animate-message-in max-w-full ${msg.type === 'user' ? 'flex justify-end' : ''}`}>
                                {msg.type === 'bot' && msg.label && (
                                    <div className="text-[10px] text-muted mb-1 font-bold uppercase tracking-wider">{msg.label}</div>
                                )}
                                <div
                                    className={`px-3.5 py-2.5 rounded-xl text-[12px] leading-relaxed ${msg.type === 'user'
                                        ? 'bg-forest text-white rounded-br-sm max-w-[90%]'
                                        : 'bg-sand text-text-primary rounded-bl-sm'}`}
                                >
                                    {msg.html ? (
                                        <div dangerouslySetInnerHTML={{ __html: msg.text }} />
                                    ) : (
                                        msg.text
                                    )}
                                    {msg.suggestions && msg.suggestions.length > 0 && (
                                        <div className="flex flex-col gap-1.5 mt-2">
                                            {msg.suggestions.map((s, j) => (
                                                <button
                                                    key={j}
                                                    className="px-3 py-2 bg-warm border-[1.5px] border-border rounded-[7px] text-[11px] font-medium text-forest cursor-pointer text-left transition-all hover:border-forest hover:bg-crowd-low-bg font-body"
                                                    onClick={() => fillAndSend(pageId, s.text)}
                                                >
                                                    {s.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Quick reply chips (shown at start of new session) */}
                        {quickReplies.length > 0 && dynamicMessages.length === 0 && !activeSessionId && (
                            <div className="animate-message-in">
                                <div className="px-3.5 py-2.5 rounded-xl bg-sand text-text-primary rounded-bl-sm text-[12px] leading-relaxed">
                                    Try asking me:
                                    <div className="flex flex-col gap-1.5 mt-2">
                                        {quickReplies.map((qr, i) => (
                                            <button
                                                key={i}
                                                className="px-3 py-2 bg-warm border-[1.5px] border-border rounded-[7px] text-[11px] font-medium text-forest cursor-pointer text-left transition-all hover:border-forest hover:bg-crowd-low-bg font-body"
                                                onClick={() => onQuickReply ? onQuickReply(qr.text) : fillAndSend(pageId, qr.text)}
                                            >
                                                {qr.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Resumed session indicator */}
                        {activeSessionId && dynamicMessages.length === 0 && (
                            <div className="animate-message-in text-center py-4">
                                <div className="text-[11px] text-muted">Continuing conversation…</div>
                                <div className="text-[10px] text-muted mt-0.5">Send a message to continue where you left off</div>
                            </div>
                        )}

                        {/* Dynamic messages */}
                        {dynamicMessages.map((msg, i) => (
                            <div key={`dyn-${i}`} className={`animate-message-in max-w-full ${msg.type === 'user' ? 'flex justify-end' : ''}`}>
                                {msg.type === 'bot' && (
                                    <div className="text-[10px] text-muted mb-1 font-bold uppercase tracking-wider">WanderAI ✦</div>
                                )}
                                <div
                                    className={`px-3.5 py-2.5 rounded-xl text-[12px] leading-relaxed ${msg.type === 'user'
                                        ? 'bg-forest text-white rounded-br-sm max-w-[90%]'
                                        : 'bg-sand text-text-primary rounded-bl-sm'}`}
                                >
                                    {msg.text}
                                    {msg.responseType === 'itinerary' && msg.data && (
                                        <ItineraryCard data={msg.data} />
                                    )}
                                </div>
                            </div>
                        ))}

                        {isTyping && <TypingIndicator />}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="px-3.5 py-3 border-t border-border flex gap-2">
                        <input
                            className="flex-1 border-[1.5px] border-border bg-sand rounded-full px-3.5 py-2 text-[12px] font-body text-text-primary outline-none transition-colors focus:border-forest placeholder:text-muted"
                            placeholder="Where do you want to go?"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <button
                            className="w-[35px] h-[35px] bg-forest rounded-full border-none cursor-pointer flex items-center justify-center text-[14px] transition-colors hover:bg-forest-mid flex-shrink-0 text-white"
                            onClick={handleSend}
                        >
                            ➤
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

import { useState, useEffect, useRef } from 'react';
import { useChat } from '../../context/ChatContext';

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

export default function ChatSidebar({ pageId, subtitle, initialMessages = [], quickReplies = [], onQuickReply }) {
    const { getMessages, sendMessage, fillAndSend, isTyping } = useChat();
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

    return (
        <div className="w-full h-full bg-warm flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-4.5 pt-4 pb-3 border-b border-border">
                <div className="flex items-center gap-2.5 mb-1">
                    <div className="w-[30px] h-[30px] bg-gradient-to-br from-forest to-forest-light rounded-full flex items-center justify-center text-[13px] flex-shrink-0 text-white">
                        ✦
                    </div>
                    <div>
                        <div className="text-[13px] font-semibold">WanderAI Assistant</div>
                        <div className="text-[11px] text-crowd-low font-medium flex items-center gap-1">
                            <span className="w-[5px] h-[5px] bg-crowd-low rounded-full inline-block"></span>
                            Online
                        </div>
                    </div>
                </div>
                <div className="text-[11px] text-muted">{subtitle}</div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-3.5 py-3.5 flex flex-col gap-2.5 custom-scrollbar-thin">
                {/* Initial (static) messages */}
                {initialMessages.map((msg, i) => (
                    <div key={`init-${i}`} className={`animate-message-in max-w-full ${msg.type === 'user' ? 'flex justify-end' : ''}`}>
                        {msg.type === 'bot' && msg.label && (
                            <div className="text-[10px] text-muted mb-1 font-bold uppercase tracking-wider">{msg.label}</div>
                        )}
                        <div
                            className={`px-3.5 py-2.5 rounded-xl text-[12px] leading-relaxed ${msg.type === 'user'
                                ? 'bg-forest text-white rounded-br-sm max-w-[90%]'
                                : 'bg-sand text-text-primary rounded-bl-sm'
                                }`}
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

                {/* Quick reply chips (shown once at start) */}
                {quickReplies.length > 0 && dynamicMessages.length === 0 && (
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

                {/* Dynamic messages */}
                {dynamicMessages.map((msg, i) => (
                    <div key={`dyn-${i}`} className={`animate-message-in max-w-full ${msg.type === 'user' ? 'flex justify-end' : ''}`}>
                        {msg.type === 'bot' && (
                            <div className="text-[10px] text-muted mb-1 font-bold uppercase tracking-wider">WanderAI ✦</div>
                        )}
                        <div
                            className={`px-3.5 py-2.5 rounded-xl text-[12px] leading-relaxed ${msg.type === 'user'
                                ? 'bg-forest text-white rounded-br-sm max-w-[90%]'
                                : 'bg-sand text-text-primary rounded-bl-sm'
                                }`}
                        >
                            {msg.text}
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
        </div>
    );
}

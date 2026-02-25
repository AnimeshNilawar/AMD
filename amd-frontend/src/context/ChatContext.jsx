import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { sendChatMessage as apiSendChat } from '../services/api';

const ChatContext = createContext();

export function ChatProvider({ children }) {
    const [messagesByPage, setMessagesByPage] = useState({});
    const [sessionByPage, setSessionByPage] = useState({});
    const [isTyping, setIsTyping] = useState(false);
    const inputRef = useRef(null);

    const getMessages = useCallback((pageId) => {
        return messagesByPage[pageId] || [];
    }, [messagesByPage]);

    const addMessage = useCallback((pageId, message) => {
        setMessagesByPage(prev => ({
            ...prev,
            [pageId]: [...(prev[pageId] || []), message],
        }));
    }, []);

    const sendMessage = useCallback(async (pageId, text) => {
        if (!text.trim()) return;

        // Add user message
        addMessage(pageId, { type: 'user', text: text.trim() });

        // Show typing indicator
        setIsTyping(true);

        try {
            // Send message with sessionId (if we have one for this page)
            const response = await apiSendChat({
                message: text.trim(),
                sessionId: sessionByPage[pageId] || null,
            });

            setIsTyping(false);

            // Store the sessionId returned by the backend
            if (response.sessionId) {
                setSessionByPage(prev => ({
                    ...prev,
                    [pageId]: response.sessionId,
                }));
            }

            addMessage(pageId, {
                type: 'bot',
                text: response.reply,
                suggestions: response.suggestions,
                responseType: response.type || null,
                data: response.data || null,
            });
        } catch {
            setIsTyping(false);
            addMessage(pageId, {
                type: 'bot',
                text: "Something went wrong. Please try again.",
            });
        }
    }, [addMessage, sessionByPage]);

    const fillAndSend = useCallback((pageId, text) => {
        sendMessage(pageId, text);
    }, [sendMessage]);

    // Clear chat history and sessionId for a page (starts a fresh conversation)
    const clearChat = useCallback((pageId) => {
        setMessagesByPage(prev => {
            const next = { ...prev };
            delete next[pageId];
            return next;
        });
        setSessionByPage(prev => {
            const next = { ...prev };
            delete next[pageId];
            return next;
        });
    }, []);

    return (
        <ChatContext.Provider value={{
            getMessages,
            sendMessage,
            fillAndSend,
            clearChat,
            isTyping,
            inputRef,
        }}>
            {children}
        </ChatContext.Provider>
    );
}

export function useChat() {
    return useContext(ChatContext);
}

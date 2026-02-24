import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { sendChatMessage as apiSendChat } from '../services/api';

const ChatContext = createContext();

export function ChatProvider({ children }) {
    const [messagesByPage, setMessagesByPage] = useState({});
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
            const response = await apiSendChat({ message: text.trim() });
            setIsTyping(false);
            addMessage(pageId, {
                type: 'bot',
                text: response.reply,
                suggestions: response.suggestions,
            });
        } catch {
            setIsTyping(false);
            addMessage(pageId, {
                type: 'bot',
                text: "Something went wrong. Please try again.",
            });
        }
    }, [addMessage]);

    const fillAndSend = useCallback((pageId, text) => {
        sendMessage(pageId, text);
    }, [sendMessage]);

    return (
        <ChatContext.Provider value={{
            getMessages,
            sendMessage,
            fillAndSend,
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

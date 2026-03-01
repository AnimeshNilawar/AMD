import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { sendChatMessage as apiSendChat, listSessions as apiListSessions, deleteSession as apiDeleteSession } from '../services/api';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export function ChatProvider({ children }) {
    const { isAuthenticated } = useAuth();
    const [messagesByPage, setMessagesByPage] = useState({});
    const [sessionByPage, setSessionByPage] = useState({});
    const [isTyping, setIsTyping] = useState(false);
    const inputRef = useRef(null);

    // Session list management
    const [sessions, setSessions] = useState([]);
    const [sessionsLoading, setSessionsLoading] = useState(false);
    const [activeSessionId, setActiveSessionId] = useState(null); // currently open session
    const [showSessionList, setShowSessionList] = useState(true); // show list vs chat

    // Fetch sessions when authenticated
    const fetchSessions = useCallback(async () => {
        if (!isAuthenticated) return;
        setSessionsLoading(true);
        try {
            const data = await apiListSessions();
            if (data.ok) {
                setSessions(data.sessions || []);
            }
        } catch (err) {
            console.error('Failed to fetch sessions:', err);
        } finally {
            setSessionsLoading(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchSessions();
        } else {
            setSessions([]);
            setActiveSessionId(null);
            setShowSessionList(true);
        }
    }, [isAuthenticated, fetchSessions]);

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

        addMessage(pageId, { type: 'user', text: text.trim() });
        setIsTyping(true);

        try {
            const response = await apiSendChat({
                message: text.trim(),
                sessionId: sessionByPage[pageId] || activeSessionId || null,
            });

            setIsTyping(false);

            // Store the sessionId returned by the backend
            if (response.sessionId) {
                setSessionByPage(prev => ({
                    ...prev,
                    [pageId]: response.sessionId,
                }));
                // If we just started a new session, update the active session
                if (!activeSessionId) {
                    setActiveSessionId(response.sessionId);
                }
            }

            addMessage(pageId, {
                type: 'bot',
                text: response.reply,
                suggestions: response.suggestions,
                responseType: response.type || null,
                data: response.data || null,
            });

            // Refresh session list after first message (new session was created)
            if (!sessionByPage[pageId] && isAuthenticated) {
                fetchSessions();
            }
        } catch {
            setIsTyping(false);
            addMessage(pageId, {
                type: 'bot',
                text: "Something went wrong. Please try again.",
            });
        }
    }, [addMessage, sessionByPage, activeSessionId, isAuthenticated, fetchSessions]);

    const fillAndSend = useCallback((pageId, text) => {
        sendMessage(pageId, text);
    }, [sendMessage]);

    // Start a new session — clear messages and session for the page
    const startNewSession = useCallback((pageId) => {
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
        setActiveSessionId(null);
        setShowSessionList(false);
    }, []);

    // Open an existing session
    const openSession = useCallback((pageId, sessionId) => {
        // Clear current messages for a clean view
        setMessagesByPage(prev => ({
            ...prev,
            [pageId]: [],
        }));
        setSessionByPage(prev => ({
            ...prev,
            [pageId]: sessionId,
        }));
        setActiveSessionId(sessionId);
        setShowSessionList(false);
    }, []);

    // Go back to session list
    const showSessions = useCallback(() => {
        setShowSessionList(true);
        setActiveSessionId(null);
    }, []);

    // Delete a session
    const removeSession = useCallback(async (sessionId) => {
        try {
            const data = await apiDeleteSession(sessionId);
            if (data.ok) {
                setSessions(prev => prev.filter(s => s.id !== sessionId));
                if (activeSessionId === sessionId) {
                    setActiveSessionId(null);
                    setShowSessionList(true);
                }
            }
        } catch (err) {
            console.error('Failed to delete session:', err);
        }
    }, [activeSessionId]);

    // Clear chat (for non-authenticated fallback)
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
            // Session management
            sessions,
            sessionsLoading,
            activeSessionId,
            showSessionList,
            fetchSessions,
            startNewSession,
            openSession,
            showSessions,
            removeSession,
        }}>
            {children}
        </ChatContext.Provider>
    );
}

export function useChat() {
    return useContext(ChatContext);
}

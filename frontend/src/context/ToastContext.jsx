import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
    const [toast, setToast] = useState(null);
    const [isExiting, setIsExiting] = useState(false);

    const showToast = useCallback((message) => {
        setIsExiting(false);
        setToast(message);
        setTimeout(() => {
            setIsExiting(true);
            setTimeout(() => {
                setToast(null);
                setIsExiting(false);
            }, 350);
        }, 2500);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toast && (
                <div
                    className={`fixed bottom-7 left-1/2 bg-forest text-white px-6 py-3 rounded-full text-sm font-medium z-[9999] whitespace-nowrap pointer-events-none ${isExiting ? 'toast-exit' : 'toast-enter'}`}
                >
                    {toast}
                </div>
            )}
        </ToastContext.Provider>
    );
}

export function useToast() {
    return useContext(ToastContext);
}

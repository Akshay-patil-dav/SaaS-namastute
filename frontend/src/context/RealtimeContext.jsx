import { createContext, useContext, useEffect, useRef, useCallback } from 'react';
import { useAuth } from './AuthContext';

const RealtimeContext = createContext(null);

export const RealtimeProvider = ({ children }) => {
    const { token, user } = useAuth();
    const eventSourceRef = useRef(null);
    const listenersRef = useRef(new Map());

    // Register a listener for real-time events
    const subscribe = useCallback((eventType, callback) => {
        if (!listenersRef.current.has(eventType)) {
            listenersRef.current.set(eventType, new Set());
        }
        listenersRef.current.get(eventType).add(callback);

        // Return unsubscribe function
        return () => {
            listenersRef.current.get(eventType)?.delete(callback);
        };
    }, []);

    // Emit event to all listeners
    const emit = useCallback((eventType, data) => {
        const listeners = listenersRef.current.get(eventType);
        if (listeners) {
            listeners.forEach(callback => {
                try {
                    callback(data);
                } catch (err) {
                    console.error('Error in realtime listener:', err);
                }
            });
        }
    }, []);

    useEffect(() => {
        if (!token || !user) {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
                eventSourceRef.current = null;
            }
            return;
        }

        // Connect to SSE endpoint with token in query param (EventSource doesn't support custom headers)
        const connectSSE = () => {
            const eventSource = new EventSource(`${import.meta.env.VITE_API_BASE_URL}/builder/notifications/stream?token=${encodeURIComponent(token)}`);

            eventSource.onopen = () => {
                console.log('SSE connection established');
            };

            eventSource.addEventListener('connected', (event) => {
                console.log('SSE connected:', event.data);
            });

            eventSource.addEventListener('page_blocks_updated', (event) => {
                try {
                    const data = JSON.parse(event.data);
                    emit('page_blocks_updated', data);
                } catch (err) {
                    console.error('Error parsing page_blocks_updated event:', err);
                }
            });

            eventSource.addEventListener('workspace_change', (event) => {
                try {
                    const data = JSON.parse(event.data);
                    emit('workspace_change', data);
                } catch (err) {
                    console.error('Error parsing workspace_change event:', err);
                }
            });

            eventSource.addEventListener('invitation', (event) => {
                try {
                    const data = JSON.parse(event.data);
                    emit('invitation', data);
                } catch (err) {
                    console.error('Error parsing invitation event:', err);
                }
            });

            eventSource.addEventListener('heartbeat', () => {
                // Heartbeat received - connection is alive
            });

            eventSource.onerror = (err) => {
                console.error('SSE error:', err);
                eventSource.close();
                // Reconnect after 3 seconds
                setTimeout(connectSSE, 3000);
            };

            eventSourceRef.current = eventSource;
        };

        connectSSE();

        return () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
                eventSourceRef.current = null;
            }
        };
    }, [token, user, emit]);

    return (
        <RealtimeContext.Provider value={{ subscribe }}>
            {children}
        </RealtimeContext.Provider>
    );
};

export const useRealtime = () => {
    const context = useContext(RealtimeContext);
    if (!context) {
        throw new Error('useRealtime must be used within a RealtimeProvider');
    }
    return context;
};

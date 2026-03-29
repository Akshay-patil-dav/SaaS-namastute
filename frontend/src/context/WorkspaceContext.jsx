import React, { createContext, useContext, useState, useCallback } from 'react';

/**
 * WorkspaceContext provides a shared refresh mechanism.
 * The Sidebar subscribes to refreshKey; when it changes, the Sidebar re-fetches workspace data.
 * The Header (notification panel) calls triggerRefresh() after accepting an invitation.
 */
const WorkspaceContext = createContext(null);

export function WorkspaceProvider({ children }) {
    const [refreshKey, setRefreshKey] = useState(0);

    const triggerRefresh = useCallback(() => {
        setRefreshKey(k => k + 1);
    }, []);

    return (
        <WorkspaceContext.Provider value={{ refreshKey, triggerRefresh }}>
            {children}
        </WorkspaceContext.Provider>
    );
}

export function useWorkspace() {
    return useContext(WorkspaceContext);
}

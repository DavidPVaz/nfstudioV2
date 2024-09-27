import React, { useRef, useEffect } from 'react';

const subscribe = (callback: () => void) => {
    window.addEventListener('online', callback, { passive: true });
    window.addEventListener('offline', callback, { passive: true });

    return () => {
        window.removeEventListener('online', callback);
        window.removeEventListener('offline', callback);
    };
};
const getSnapshot = () => navigator.onLine;
const getServerSnapshot = () => true;

export const useNetworkState = () => {
    const isOnline = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    const onlineStatus = useRef<boolean>(isOnline);

    useEffect(() => {
        if (onlineStatus.current === isOnline) {
            return;
        }

        onlineStatus.current = isOnline;
    }, [isOnline]);

    return {
        isOnline,
        hasChangedStatus: onlineStatus.current !== isOnline
    };
};

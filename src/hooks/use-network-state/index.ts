import { useRef, useEffect, useSyncExternalStore } from 'react';

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

/**
 * Allows to react to changes in network status.
 */
export const useNetworkState = () => {
    const isOnline = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
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

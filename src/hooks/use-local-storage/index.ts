'use client';

import { useSyncExternalStore, useCallback, useEffect } from 'react';

const dispatchStorageEvent = (key: string, newValue: string | null) => {
    window.dispatchEvent(new StorageEvent('storage', { key, newValue }));
};

const setLocalStorageItem = (key: string, value: object | null) => {
    const stringifiedValue = JSON.stringify(value);
    window.localStorage.setItem(key, stringifiedValue);
    dispatchStorageEvent(key, stringifiedValue);
};

const removeLocalStorageItem = (key: string) => {
    window.localStorage.removeItem(key);
    dispatchStorageEvent(key, null);
};

const getLocalStorageItem = (key: string) => {
    return window.localStorage.getItem(key) ?? 'null';
};

type SetStateArgs<T> = T | null | undefined | ((store: T) => T | null | undefined);

export function useLocalStorage<T>(
    key: string,
    initialValue?: T | null
): [T | null | undefined, (value: SetStateArgs<T>) => void] {
    const subscribe = useCallback((callback: () => void) => {
        window.addEventListener('storage', callback);
        return () => window.removeEventListener('storage', callback);
    }, []);

    const getSnapshot = useCallback(() => getLocalStorageItem(key), [key]);
    const getServerSnapshot = useCallback(() => null, []);

    const store = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    const setState = useCallback(
        (value: SetStateArgs<T>) => {
            try {
                const nextState =
                    value instanceof Function && store ? value(JSON.parse(store) as T) : value;

                if (nextState === undefined || nextState === null) {
                    removeLocalStorageItem(key);
                } else {
                    setLocalStorageItem(key, nextState);
                }
            } catch (e) {
                console.warn(e);
            }
        },
        [key, store]
    );

    useEffect(() => {
        if (getLocalStorageItem(key) === null && typeof initialValue !== 'undefined') {
            setLocalStorageItem(key, initialValue);
        }
    }, [key, initialValue]);

    return [store ? (JSON.parse(store) as T) : initialValue, setState];
}

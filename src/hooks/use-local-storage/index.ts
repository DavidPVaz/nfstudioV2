'use client';

import { useSyncExternalStore, useCallback, useEffect } from 'react';

const dispatchStorageEvent = (key: string, newValue: string | null) =>
    window.dispatchEvent(new StorageEvent('storage', { key, newValue }));

const setLocalStorageItem = <T>(key: string, value: T | null) => {
    const stringifiedValue = JSON.stringify(value);
    window.localStorage.setItem(key, stringifiedValue);
    dispatchStorageEvent(key, stringifiedValue);
};

const removeLocalStorageItem = (key: string) => {
    window.localStorage.removeItem(key);
    dispatchStorageEvent(key, null);
};

const getLocalStorageItem = (key: string) => window.localStorage.getItem(key);

export type SetStateArgs<T> = T | null | undefined | ((store: T) => T | null | undefined);

/**
 * Allows to sync react state with storage api.
 *
 * @param {string} key - identifier of the state to manage in store
 * @param {T} initialValue - the initial state value
 */
export function useLocalStorage<T>(
    key: string,
    initialValue: T
): [T, (value: SetStateArgs<T>) => void] {
    const subscribe = useCallback((callback: () => void) => {
        window.addEventListener('storage', callback);
        return () => window.removeEventListener('storage', callback);
    }, []);

    const getSnapshot = useCallback(() => getLocalStorageItem(key), [key]);
    const getServerSnapshot = useCallback(() => null, []);

    const store = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    const setState = useCallback(
        (value: SetStateArgs<T>) => {
            const nextState =
                value instanceof Function && store ? value(JSON.parse(store) as T) : (value as T);

            nextState === undefined || nextState === null
                ? removeLocalStorageItem(key)
                : setLocalStorageItem<T>(key, nextState);
        },
        [key, store]
    );

    useEffect(() => {
        if (getLocalStorageItem(key) === null && initialValue !== undefined) {
            setLocalStorageItem<T>(key, initialValue);
        }
    }, [key, initialValue]);

    return [store ? (JSON.parse(store) as T) : initialValue, setState];
}

/**
 * Allows to select a piece of state from the synced storage.
 *
 * @param key - identifier of the store
 * @param selector - the selector function
 * @param defaultValue - the default value if store does not exist
 */
export const useSelector = <T, R>(key: string, selector: (store: T) => R, defaultValue = null) => {
    const store = getLocalStorageItem(key);

    return store === null ? defaultValue : selector(JSON.parse(store) as T);
};

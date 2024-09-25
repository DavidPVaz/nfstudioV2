'use client';

import { useSyncExternalStore, useCallback, useEffect } from 'react';
import { compressToUTF16, decompressFromUTF16 } from 'lz-string';

const dispatchStorageEvent = (key: string, newValue: string | null) =>
    window.dispatchEvent(new StorageEvent('storage', { key, newValue }));

const setLocalStorageItem = <T>(key: string, value: T | null) => {
    let stringifiedValue = JSON.stringify(value);

    if (process.env.NEXT_PUBLIC_VERCEL_ENV !== 'development') {
        stringifiedValue = compressToUTF16(stringifiedValue);
    }

    window.localStorage.setItem(key, stringifiedValue);
    dispatchStorageEvent(key, stringifiedValue);
};

const removeLocalStorageItem = (key: string) => {
    window.localStorage.removeItem(key);
    dispatchStorageEvent(key, null);
};

const getLocalStorageItem = (key: string) => {
    if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'development') {
        return window.localStorage.getItem(key);
    }

    const item = window.localStorage.getItem(key);
    return item ? decompressFromUTF16(item) : null;
};

export type SetStateArgs<T> = T | null | undefined | ((store: T) => T | null | undefined);

const subscribe = (callback: () => void) => {
    window.addEventListener('storage', callback);
    return () => window.removeEventListener('storage', callback);
};
const getSnapshot = (key: string) => getLocalStorageItem(key);
const getServerSnapshot = () => null;

/**
 * Allows to sync react state with storage api.
 *
 * @param key - identifier of the state to manage in store
 * @param initialValue - the initial state value
 */
export function useLocalStorage<T>(
    key: string,
    initialValue: T
): [T, (value: SetStateArgs<T>) => void] {
    const store = useSyncExternalStore(subscribe, () => getSnapshot(key), getServerSnapshot);

    const setState = useCallback(
        (value: SetStateArgs<T>) => {
            const store = getSnapshot(key);
            const nextState =
                value instanceof Function && store ? value(JSON.parse(store) as T) : (value as T);

            nextState === undefined || nextState === null
                ? removeLocalStorageItem(key)
                : setLocalStorageItem<T>(key, nextState);
        },
        [key]
    );

    useEffect(() => {
        if (getSnapshot(key) === null && initialValue !== undefined) {
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
export const useSelector = <T, R>(
    key: string,
    selector: (store: T) => R | undefined,
    defaultValue = null
) => {
    const store = useSyncExternalStore(subscribe, () => getSnapshot(key), getServerSnapshot);

    return store ? selector(JSON.parse(store) as T) : defaultValue;
};

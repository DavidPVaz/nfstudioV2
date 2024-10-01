import { useRef } from 'react';
import { useQuery, useMutation, type Query } from '@tanstack/react-query';

type ApiReadProps<T extends Record<string, unknown>, R> = {
    method: (data: T) => Promise<R>;
    args: T;
    resources?: string[];
    enabled?: boolean;
    onError?: (error: Error, query: Query<R>) => void;
};

/**
 * Manages the lifecycle of an API request to read data.
 *
 * @param options
 * @param options.method - the function responsible for sending the request
 * @param options.args - the arguments to be passed to the method
 * @param options.resources - the name of the API resources identifying the data being read
 * @param options.enabled - whether to automatically fetch data
 * @param options.onError - error handling function
 */
export const useApiRead = <T extends Record<string, unknown>, R>({
    method,
    args,
    resources = [],
    enabled = true,
    onError
}: ApiReadProps<T, R>) => {
    const { isLoading, data, error, fetchStatus } = useQuery<R>({
        queryKey: [...resources, ...Object.values(args)],
        queryFn: () => method(args),
        enabled,
        throwOnError: (error, query) => {
            onError?.(error, query);
            return false;
        }
    });

    return {
        response: data,
        isLoading,
        error,
        noNetwork: fetchStatus === 'paused'
    };
};

type FallbackApiReadProps<T extends Record<string, unknown>, R> = ApiReadProps<T, R> & {
    initialFallback: R;
};

/**
 * Manages the lifecycle of an API request to read data and maintains a fallback data reference.
 * Useful when performing an optimistic fetch so we can rollback to fallback data on read error.
 *
 * @param options
 * @param options.method - the function responsible for sending the request
 * @param options.args - the arguments to be passed to the method
 * @param options.resources - the name of the API resources identifying the data being read
 * @param options.enabled - whether to automatically fetch data
 * @param options.onError - error handling function
 * @param options.initialFallback - initial fallback data in case of error on first read
 */
export const useFallbackApiRead = <T extends Record<string, unknown>, R>({
    initialFallback,
    ...apiReadProps
}: FallbackApiReadProps<T, R>) => {
    const fallback = useRef<R>(initialFallback);

    const { response, isLoading, error } = useApiRead(apiReadProps);

    if (response) {
        fallback.current = response;
    }

    return {
        response: error ? fallback.current : response,
        isLoading
    };
};

type ApiWriteProps<T extends Record<string, unknown>, R> = {
    key: string;
    method: (data: T) => Promise<R>;
    onSuccess?: (data: R) => void;
    onError?: (error: Error) => void;
};

/**
 * Manages the lifecycle of an API request to write data.
 *
 * @param options
 * @param options.key - the name of the API resource identifying the data being written
 * @param options.method - the function responsible for sending the request
 * @param options.onSuccess - the function to call after write operation is successfully completed
 * @param options.onError - the function to call to handle operation error
 */
export const useApiWrite = <T extends Record<string, unknown>, R>({
    key,
    method,
    onSuccess,
    onError
}: ApiWriteProps<T, R>) => {
    const {
        isPending,
        mutate: send,
        reset,
        error
    } = useMutation({
        mutationKey: [key],
        mutationFn: method,
        throwOnError: false,
        onError: error => onError?.(error),
        onSuccess: (data: R) => onSuccess?.(data)
    });

    return {
        isPending,
        send,
        reset,
        error
    };
};

import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';

type ApiReadProps<T extends Record<string, unknown>, R> = {
    method: (data: T) => Promise<R>;
    args: T;
    resources?: string[];
    enabled?: boolean;
    onError: (error: Error) => void;
};

/**
 * Manages the lifecycle of an API request to read data.
 *
 * @param {ApiReadProps} options
 * @param {ApiReadProps['method']} options.method - the function responsible for sending the request
 * @param {ApiReadProps['args']} options.args - the arguments to be passed to the method
 * @param {ApiReadProps['resources']} [options.resources] - the name of the API resources identifying the data being read
 * @param {ApiReadProps['enabled']} [options.enabled] - whether to automatically fetch data
 * @param {ApiReadProps['onError']} options.onError - error handling function
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
        throwOnError: error => {
            onError(error);
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
 * @param {FallbackApiReadProps} options
 * @param {FallbackApiReadProps['method']} options.method - the function responsible for sending the request
 * @param {FallbackApiReadProps['args']} options.args - the arguments to be passed to the method
 * @param {FallbackApiReadProps['resources']} [options.resources] - the name of the API resources identifying the data being read
 * @param {FallbackApiReadProps['enabled']} [options.enabled] - whether to automatically fetch data
 * @param {FallbackApiReadProps['onError']} options.onError - error handling function
 * @param {FallbackApiReadProps['initialFallback']} options.initialFallback - initial fallback data in case of error on first read
 */
export const useFallbackApiRead = <T extends Record<string, unknown>, R>({
    initialFallback,
    ...apiReadProps
}: FallbackApiReadProps<T, R>) => {
    const fallback = useRef<R>(initialFallback);

    const { response, isLoading, error, noNetwork } = useApiRead(apiReadProps);

    if (response) {
        fallback.current = response;
    }

    return {
        response: error ? fallback.current : response,
        isLoading,
        noNetwork
    };
};

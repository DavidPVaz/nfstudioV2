import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';

type ApiReadProps<T extends Record<string, unknown>, R> = {
    method: (data: T) => Promise<R>;
    args: T;
    resources?: string[];
    enabled?: boolean;
    keepPreviousData?: boolean;
    initialData?: R;
    onError?: (error: Error) => void;
};

/**
 * Manages the lifecycle of an API request to read data.
 *
 * @param {ApiReadProps} options
 * @param {ApiReadProps['method']} options.method - the function responsible for sending the request
 * @param {ApiReadProps['args']} options.args - the arguments to be passed to the method
 * @param {ApiReadProps['resources']} [options.resources] - the name of the API resources identifying the data being read
 * @param {ApiReadProps['enabled']} [options.enabled] - whether to automatically fetch data
 * @param {ApiReadProps['keepPreviousData']} [options.keepPreviousData] - wether to keep a copy of previously successfully fetched data
 * @param {ApiReadProps['initialData']} [options.initialData] - initial query data
 * @param {ApiReadProps['onError']} [options.onError] - error handling function
 */
export const useApiRead = <T extends Record<string, unknown>, R>({
    method,
    args,
    resources = [],
    enabled = true,
    keepPreviousData = false,
    initialData,
    onError
}: ApiReadProps<T, R>) => {
    const dataRef = useRef<R | null | undefined>(initialData);

    const { isLoading, data, error, fetchStatus } = useQuery<R>({
        queryKey: [...resources, ...Object.values(args)],
        queryFn: () => method(args),
        enabled,
        throwOnError: error => {
            onError?.(error);

            return false; // -> return the error as state
        }
    });

    if (keepPreviousData && data) {
        dataRef.current = data;
    }

    return {
        response: keepPreviousData && error ? dataRef.current : data,
        isLoading,
        error,
        noNetwork: fetchStatus === 'paused'
    };
};

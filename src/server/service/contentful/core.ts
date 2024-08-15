import 'server-only';

import { buildQueryString } from '@/lib/utils';
import { NFStudioCMSQueryArgs, Content } from '@/server/service/contentful/types';
import { NFStudioRequestError, customFetch } from '@/server/service/shared/http';
export class ContentfulApiRequestError extends NFStudioRequestError {
    constructor(message: string, code: number) {
        super(message, code);
        this.name = 'ContentfulApiRequestError';
    }
}

type ContentfulResponse<T> = {
    items: [
        {
            fields: T;
            metadata: {};
            sys: {
                id: number;
                createdAt: string;
                updatedAt: string;
                contentType: { sys: { id: Content } };
            };
        }
    ];
};

interface ContentfulApiGetRequest {
    queryArgs: NFStudioCMSQueryArgs;
    retries?: number;
}

/**
 * Performs a GET request to Contentful delivery api.
 *
 * @param {ContentfulApiGetRequest} data - contentful api request data
 * @param {ContentfulApiGetRequest['queryArgs']} data.queryArgs - the request query arguments
 * @param {ContentfulApiGetRequest['queryArgs']} data.queryArgs.include - wether to include links between entries and assets
 * @param {ContentfulApiGetRequest['queryArgs']} data.queryArgs.content_type - the type of content
 * @param {ContentfulApiGetRequest['queryArgs']} data.queryArgs.fields - key value pairs of search parameters to append on query in format `fields.<property>=value`
 * @param {ContentfulApiGetRequest['retries']} [data.retries] - number of times to retry this request
 *
 * @throws {Error | ContentfulApiRequestError} error if request failed
 */
export async function contentfulApiGETRequest<T>({
    retries = 1,
    queryArgs
}: ContentfulApiGetRequest) {
    try {
        return await customFetch<ContentfulResponse<T>>({
            retries,
            options: {
                url: `${process.env.CONTENTFUL_DELIVERY_API}?${buildQueryString(queryArgs)}`,
                init: {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${process.env.CONTENTFUL_DELIVERY_API_TOKEN}`
                    }
                }
            }
        });
    } catch (error) {
        if (error instanceof NFStudioRequestError) {
            throw new ContentfulApiRequestError(error.message, error.code);
        }

        throw error;
    }
}

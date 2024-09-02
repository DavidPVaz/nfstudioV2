import { describe, expect, vi, afterEach, it } from 'vitest';
import {
    contentfulApiGETRequest,
    ContentfulApiRequestError
} from '@/server/service/contentful/core';
import { NFStudioCMSQueryArgs } from '@/server/service/contentful/types';
import { NFStudioRequestError } from '@/server/service/shared/http';

const { customFetchMock, buildQueryStringMock } = vi.hoisted(() => ({
    customFetchMock: vi.fn(),
    buildQueryStringMock: vi.fn()
}));

vi.mock('server-only', () => ({}));

vi.mock('@/server/service/shared/http', async importOriginal => {
    const actual: object = await importOriginal();
    return {
        ...actual,
        customFetch: customFetchMock
    };
});

vi.mock('@/lib/utils', () => ({
    buildQueryString: buildQueryStringMock
}));

const queryArgs = {
    include: 0,
    content_type: 'document',
    fields: { title: 'Terms of Service' }
} as NFStudioCMSQueryArgs;
const queryString = 'name=value';
const expectedFetchArguments = {
    retries: 1,
    options: {
        url: `${process.env.CONTENTFUL_DELIVERY_API}?${queryString}`,
        init: {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${process.env.CONTENTFUL_DELIVERY_API_TOKEN}`
            }
        }
    }
};

describe('server/service/contentful/core', () => {
    afterEach(() => {
        vi.resetAllMocks();
    });

    it('should perform a Contentful API GET request', async () => {
        // setup
        const responseData = { data: 'data' };
        customFetchMock.mockImplementationOnce(() => Promise.resolve(responseData));
        buildQueryStringMock.mockImplementationOnce(() => queryString);

        // exercise
        const result = await contentfulApiGETRequest({ queryArgs });

        // verify
        expect(result).toEqual(responseData);
        expect(customFetchMock).toHaveBeenNthCalledWith(1, expectedFetchArguments);
        expect(buildQueryStringMock).toHaveBeenNthCalledWith(1, queryArgs);
    });

    it('should throw ContentfulApiRequestError', async () => {
        // setup
        const statusText = 'message';
        const status = 500;
        customFetchMock.mockRejectedValueOnce(new NFStudioRequestError(statusText, status));
        buildQueryStringMock.mockImplementationOnce(() => queryString);

        // exercise && verify
        await expect(contentfulApiGETRequest({ queryArgs })).rejects.toThrowError(
            new ContentfulApiRequestError(statusText, status)
        );
        expect(customFetchMock).toHaveBeenNthCalledWith(1, expectedFetchArguments);
        expect(buildQueryStringMock).toHaveBeenNthCalledWith(1, queryArgs);
    });

    it('should throw received error if not NFStudio Error', async () => {
        // setup
        const statusText = 'message';
        customFetchMock.mockRejectedValueOnce(new Error(statusText));
        buildQueryStringMock.mockImplementationOnce(() => queryString);

        // exercise && verify
        await expect(contentfulApiGETRequest({ queryArgs })).rejects.toThrowError(
            new Error(statusText)
        );
        expect(customFetchMock).toHaveBeenNthCalledWith(1, expectedFetchArguments);
        expect(buildQueryStringMock).toHaveBeenNthCalledWith(1, queryArgs);
    });
});

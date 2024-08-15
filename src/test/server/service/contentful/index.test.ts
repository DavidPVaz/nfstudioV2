import { describe, expect, vi, afterEach, it } from 'vitest';
import { queryDocument } from '@/server/service/contentful';
import { ContentfulApiRequestError } from '@/server/service/contentful/core';

const { contentfulApiGETRequestMock } = vi.hoisted(() => ({
    contentfulApiGETRequestMock: vi.fn()
}));

vi.mock('server-only', () => ({}));

vi.mock('@/server/service/contentful/core', async importOriginal => {
    const actual: object = await importOriginal();
    return {
        ...actual,
        contentfulApiGETRequest: contentfulApiGETRequestMock
    };
});

describe('server/service/contentful/index', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should query a document', async () => {
        // setup
        const title = 'Terms of Service';
        const document = { content: { node: 'node' }, title };
        const data = { items: [{ fields: { ...document } }] };
        contentfulApiGETRequestMock.mockImplementationOnce(() => Promise.resolve(data));

        // exercise
        const result = await queryDocument({ title });

        // verify
        expect(result).toEqual(document);
        expect(contentfulApiGETRequestMock).toHaveBeenNthCalledWith(1, {
            queryArgs: {
                include: 0,
                content_type: 'document',
                fields: { title }
            }
        });
    });

    it('should throw ContenfulApiError if no document has been found', async () => {
        // setup
        const title = 'Terms of Service';
        const data = { items: [] };
        contentfulApiGETRequestMock.mockImplementationOnce(() => Promise.resolve(data));

        // exercise && verify
        await expect(queryDocument({ title })).rejects.toThrowError(
            new ContentfulApiRequestError(`Document with the title ${title} was not found.`, 404)
        );
        expect(contentfulApiGETRequestMock).toHaveBeenNthCalledWith(1, {
            queryArgs: {
                include: 0,
                content_type: 'document',
                fields: { title }
            }
        });
    });
});

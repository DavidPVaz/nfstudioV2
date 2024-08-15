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

describe.todo('server/service/contentful/index', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should query document', async () => {});
});

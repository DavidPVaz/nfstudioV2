/* eslint-disable @typescript-eslint/no-unsafe-call */
import type { NextApiRequest, NextApiResponse } from 'next';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createMocks, type MockResponse } from 'node-mocks-http';
import MetadataHandler from '@/pages/api/metadata';

const TEST_METADATA = [
    { _id: 1, uri: 'uri1' },
    { _id: 2, uri: 'uri2' }
];

const { queryMetadataMock, captureExceptionMock } = vi.hoisted(() => ({
    queryMetadataMock: vi.fn().mockImplementation(() => Promise.resolve(TEST_METADATA)),
    captureExceptionMock: vi.fn().mockImplementation(() => Promise.resolve())
}));

vi.mock('@/server/service/mongo', () => ({
    queryMetadata: queryMetadataMock
}));

vi.mock('@sentry/nextjs', () => ({
    captureException: captureExceptionMock
}));

describe('pages/api/metadata/index', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should return 400 if no query', async () => {
        // setup
        const query = {};
        const { req, res } = createMocks({
            query
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await MetadataHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
        expect(queryMetadataMock).not.toHaveBeenCalled();
    });

    it('should return 400 if invalid query', async () => {
        // setup
        const query = { invalid: 'type' };
        const { req, res } = createMocks({
            query
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await MetadataHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
        expect(queryMetadataMock).not.toHaveBeenCalled();
    });

    it('should return 400 if invalid collection - case 1', async () => {
        // setup
        const query = { collection: '', ids: '1,2,3' };
        const { req, res } = createMocks({
            query
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await MetadataHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
        expect(queryMetadataMock).not.toHaveBeenCalled();
    });

    it('should return 400 if invalid collection - case 2', async () => {
        // setup
        const query = { collection: ' invalid', ids: '1,2,3' };
        const { req, res } = createMocks({
            query
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await MetadataHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
        expect(queryMetadataMock).not.toHaveBeenCalled();
    });

    it('should return 400 if invalid collection - case 3', async () => {
        // setup
        const query = { collection: 'invalid name', ids: '1,2,3' };
        const { req, res } = createMocks({
            query
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await MetadataHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
        expect(queryMetadataMock).not.toHaveBeenCalled();
    });

    it('should return 400 if invalid collection - case 4', async () => {
        // setup
        const query = { collection: '_invalid_name', ids: '1,2,3' };
        const { req, res } = createMocks({
            query
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await MetadataHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
        expect(queryMetadataMock).not.toHaveBeenCalled();
    });

    it('should return 400 if invalid collection - case 5', async () => {
        // setup
        const query = { collection: 'invalid_name_', ids: '1,2,3' };
        const { req, res } = createMocks({
            query
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await MetadataHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
        expect(queryMetadataMock).not.toHaveBeenCalled();
    });

    it('should return 400 if invalid collection - case 6', async () => {
        // setup
        const query = { collection: 'invalid_nam3', ids: '1,2,3' };
        const { req, res } = createMocks({
            query
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await MetadataHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
        expect(queryMetadataMock).not.toHaveBeenCalled();
    });

    it('should return 400 if invalid ids - case 1', async () => {
        // setup
        const query = { collection: 'Name', ids: '' };
        const { req, res } = createMocks({
            query
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await MetadataHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
        expect(queryMetadataMock).not.toHaveBeenCalled();
    });

    it('should return 400 if invalid ids - case 2', async () => {
        // setup
        const query = { collection: 'Name', ids: 'invalid,2' };
        const { req, res } = createMocks({
            query
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await MetadataHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
        expect(queryMetadataMock).not.toHaveBeenCalled();
    });

    it('should return 400 if invalid ids - case 3', async () => {
        // setup
        const query = { collection: 'Name', ids: ',2' };
        const { req, res } = createMocks({
            query
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await MetadataHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
        expect(queryMetadataMock).not.toHaveBeenCalled();
    });

    it('should return 400 if invalid ids - case 4', async () => {
        // setup
        const query = { collection: 'Name', ids: '2,' };
        const { req, res } = createMocks({
            query
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await MetadataHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
        expect(queryMetadataMock).not.toHaveBeenCalled();
    });

    it('should return 400 if invalid ids - case 5', async () => {
        // setup
        const query = { collection: 'Name', ids: '2,,3' };
        const { req, res } = createMocks({
            query
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await MetadataHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
        expect(queryMetadataMock).not.toHaveBeenCalled();
    });

    it('should return 400 if invalid ids - case 6', async () => {
        // setup
        const query = {
            collection: 'Name',
            ids: '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21'
        };
        const { req, res } = createMocks({
            query
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await MetadataHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
        expect(queryMetadataMock).not.toHaveBeenCalled();
    });

    it('should return 400 if invalid ids - case 7', async () => {
        // setup
        const query = { collection: 'Name', ids: '123456,234' };
        const { req, res } = createMocks({
            query
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await MetadataHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(400);
        expect(response._getData()).toEqual('Bad request.');
        expect(response._isEndCalled()).toBe(true);
        expect(queryMetadataMock).not.toHaveBeenCalled();
    });

    it('should query collection metadata', async () => {
        // setup
        const query = { collection: 'Name', ids: '1,2,3' };
        const expectedQuery = { collection: 'Name', ids: [1, 2, 3] };
        const { req, res } = createMocks({
            query
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await MetadataHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(200);
        expect(response._getJSONData()).toEqual(TEST_METADATA);
        expect(response._getHeaders()['cache-control']).toEqual(
            'max-age=0, s-maxage=31536000, public'
        );
        expect(response._isEndCalled()).toBe(true);
        expect(queryMetadataMock).toHaveBeenNthCalledWith(1, expectedQuery);
    });

    it('should return 500 on error', async () => {
        // setup
        const error = { error: 'query metadata error' };
        const query = { collection: 'Name', ids: '1,2,3' };
        const expectedQuery = { collection: 'Name', ids: [1, 2, 3] };
        queryMetadataMock.mockRejectedValueOnce(error);
        const { req, res } = createMocks({
            query
        }) as { req: NextApiRequest; res: NextApiResponse };

        // exercise
        const response = (await MetadataHandler(
            req,
            res
        )) as unknown as MockResponse<NextApiResponse>;

        // verify
        expect(response.statusCode).toBe(500);
        expect(response._getData()).toEqual('An error occurred while fetching metadata.');
        expect(response._isEndCalled()).toBe(true);
        expect(queryMetadataMock).toHaveBeenNthCalledWith(1, expectedQuery);
        expect(captureExceptionMock).toHaveBeenNthCalledWith(1, error);
    });
});

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { describe, expect, vi, afterEach, it } from 'vitest';
import type { NextRequest } from 'next/server';
import { middleware } from '@/middleware';

const { NextResponseMock, isAuthorizedMock } = vi.hoisted(() => ({
    NextResponseMock: class {
        static next = vi.fn();
        static args: unknown[];

        constructor(...args: unknown[]) {
            NextResponseMock.args = args;
        }
    },
    isAuthorizedMock: vi.fn()
}));

vi.mock('@/server/middleware/shared', () => ({
    isAuthorized: isAuthorizedMock
}));

vi.mock('next/server', async importOriginal => {
    const actual: object = await importOriginal();
    return {
        ...actual,
        NextResponse: NextResponseMock
    };
});

describe('middleware', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should allow the request to proceed', () => {
        // setup
        const request = {} as NextRequest;
        isAuthorizedMock.mockImplementationOnce(() => true);
        NextResponseMock.next.mockImplementationOnce(() => 'response');

        // exercise
        const result = middleware(request);

        // verify
        expect(result).toEqual('response');
        expect(isAuthorizedMock).toHaveBeenNthCalledWith(1, request);
        expect(NextResponseMock.args).not.toBeDefined();
        expect(NextResponseMock.next).toHaveBeenNthCalledWith(1);
    });

    it('should deny the request to proceed', () => {
        // setup
        const request = {} as NextRequest;
        isAuthorizedMock.mockImplementationOnce(() => false);

        // exercise
        const result = middleware(request);

        // verify
        expect(result).toBeInstanceOf(NextResponseMock);
        expect(isAuthorizedMock).toHaveBeenNthCalledWith(1, request);
        expect(NextResponseMock.args).toEqual([null, { status: 401 }]);
        expect(NextResponseMock.next).not.toHaveBeenCalled();
    });
});

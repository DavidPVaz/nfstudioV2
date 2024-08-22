import { describe, expect, vi, afterEach, it } from 'vitest';
//import { middleware, config } from '@/middleware';

const { NextResponseMock, nextMock, constructorMock, isAuthorizedMock } = vi.hoisted(() => ({
    NextResponseMock: class {
        static next = nextMock;

        constructor(args: unknown) {
            constructorMock(args);
        }
    },
    nextMock: vi.fn(),
    constructorMock: vi.fn(),

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

describe.todo('middleware', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should ', () => {
        expect(1).toEqual(1);
    });
});

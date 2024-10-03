import { describe, expect, vi, afterEach, it } from 'vitest';
import { getSignedJWT, verifyToken, decodeToken, jwtHasExpired } from '@/server/service/auth';

const { signMock, verifyMock, decodeMock } = vi.hoisted(() => ({
    signMock: vi.fn(),
    verifyMock: vi.fn(),
    decodeMock: vi.fn()
}));

vi.mock('jsonwebtoken', () => ({
    sign: signMock,
    verify: verifyMock,
    decode: decodeMock
}));

describe('server/service/auth/index', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should get a signed JWT token', () => {
        // setup
        signMock.mockImplementationOnce(() => 'jwt');
        const payload = { data: 'data' };
        const expiresIn = '5h';
        const expectedKey = Buffer.from(process.env.JWT_SECRET!, 'base64');

        // exercise
        const result = getSignedJWT({ payload, expiresIn });

        // verify
        expect(result).toEqual('jwt');
        expect(signMock).toHaveBeenNthCalledWith(1, payload, expectedKey, {
            expiresIn,
            algorithm: 'HS256'
        });
    });

    it('should get a signed JWT token', () => {
        // setup
        signMock.mockImplementationOnce(() => 'jwt2');
        const payload = { data: 'data' };
        const expectedKey = Buffer.from(process.env.JWT_SECRET!, 'base64');

        // exercise
        const result = getSignedJWT({ payload });

        // verify
        expect(result).toEqual('jwt2');
        expect(signMock).toHaveBeenNthCalledWith(1, payload, expectedKey, {
            expiresIn: '2h',
            algorithm: 'HS256'
        });
    });

    it('should verify a valid JWT', () => {
        // setup
        const payload = { token: 'token' };
        verifyMock.mockImplementationOnce(() => payload);
        const token = 'token';
        const expectedKey = Buffer.from(process.env.JWT_SECRET!, 'base64');

        // exercise
        const result = verifyToken(token);

        // verify
        expect(result.valid).toBe(true);
        expect(result.payload).toEqual(payload);
        expect(verifyMock).toHaveBeenNthCalledWith(1, token, expectedKey, {
            algorithms: ['HS256']
        });
    });

    it('should verify an invalid JWT', () => {
        // setup
        verifyMock.mockImplementationOnce(() => {
            throw new Error();
        });
        const token = 'token';
        const expectedKey = Buffer.from(process.env.JWT_SECRET!, 'base64');

        // exercise
        const result = verifyToken(token);

        // verify
        expect(result.valid).toBe(false);
        expect(result.payload).toBeUndefined();
        expect(verifyMock).toHaveBeenNthCalledWith(1, token, expectedKey, {
            algorithms: ['HS256']
        });
    });

    it('should decode a JWT', () => {
        // setup
        decodeMock.mockImplementationOnce(() => 'decoded');
        const token = 'token';

        // exercise
        const result = decodeToken(token);

        // verify
        expect(result).toEqual('decoded');
        expect(decodeMock).toHaveBeenNthCalledWith(1, token, { json: true });
    });

    it('should check if a JWT is expired', () => {
        // setup
        vi.useFakeTimers();
        const time = Date.now();
        const expirationExpired = time / 1000 - 1;
        const expirationNotExpired = time / 1000;
        const expirationNotExpired2 = time / 1000 + 1;

        // exercise && verify
        expect(jwtHasExpired(expirationExpired)).toBe(true);
        expect(jwtHasExpired(expirationNotExpired)).toBe(false);
        expect(jwtHasExpired(expirationNotExpired2)).toBe(false);

        // cleanup
        vi.useRealTimers();
    });
});

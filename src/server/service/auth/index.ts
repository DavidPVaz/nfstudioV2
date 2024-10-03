import { sign, verify, decode } from 'jsonwebtoken';

type JsonWebTokenConfig = {
    payload: Record<string, string>;
    expiresIn?: string;
};

/**
 * Generates a signed Json Web Token.
 *
 * @param config
 * @param config.payload - jwt payload
 * @param config.expiresIn - jwt life time
 */
export const getSignedJWT = ({ payload, expiresIn = '2h' }: JsonWebTokenConfig) =>
    sign(payload, Buffer.from(process.env.JWT_SECRET!, 'base64'), {
        expiresIn,
        algorithm: 'HS256'
    });

/**
 * Verifies a Json Web Token signature.
 *
 * @param token - Json Web Token to verify
 */
export const verifyToken = <T>(token: string) => {
    try {
        const payload = verify(token, Buffer.from(process.env.JWT_SECRET!, 'base64'), {
            algorithms: ['HS256']
        });

        return { valid: true, payload: payload as T };
    } catch {
        return { valid: false };
    }
};

/**
 * Decode a Json Web Token.
 *
 * @param token - Json Web Token to decode
 */
export const decodeToken = <T>(token: string) => decode(token, { json: true }) as T;

/**
 * Check if a Json Web Token has expired.
 *
 * @param expiration - Json Web Token expiration in milliseconds
 */
export const jwtHasExpired = (expiration: number) => Date.now() > expiration * 1000;

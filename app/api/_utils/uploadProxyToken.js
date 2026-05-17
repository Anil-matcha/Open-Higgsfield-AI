import { createHmac, randomBytes, timingSafeEqual } from 'crypto';

const TOKEN_TTL_MS = 10 * 60 * 1000; // 10 minutes
const GLOBAL_FALLBACK_SECRET_KEY = '__UPLOAD_PROXY_FALLBACK_SECRET__';

function getFallbackSecret() {
    if (!globalThis[GLOBAL_FALLBACK_SECRET_KEY]) {
        globalThis[GLOBAL_FALLBACK_SECRET_KEY] = randomBytes(32).toString('hex');
    }
    return globalThis[GLOBAL_FALLBACK_SECRET_KEY];
}

function getTokenSecret() {
    // In distributed/serverless deployments, set UPLOAD_PROXY_SECRET (or
    // MUAPI_UPLOAD_PROXY_SECRET) so tokens can be verified across instances.
    return (
        process.env.UPLOAD_PROXY_SECRET ||
        process.env.MUAPI_UPLOAD_PROXY_SECRET ||
        process.env.NEXTAUTH_SECRET ||
        getFallbackSecret()
    );
}

function sign(input) {
    return createHmac('sha256', getTokenSecret()).update(input).digest('base64url');
}

function safeJsonParse(input) {
    try {
        return JSON.parse(input);
    } catch {
        return null;
    }
}

// Allow only HTTPS S3-style upload endpoints.
function isAllowedS3Host(hostname) {
    const host = hostname.toLowerCase();

    // Common S3 endpoint families:
    // - s3.amazonaws.com
    // - bucket.s3.amazonaws.com
    // - s3.<region>.amazonaws.com
    // - bucket.s3.<region>.amazonaws.com
    // - s3-<region>.amazonaws.com
    // - bucket.s3-<region>.amazonaws.com
    // - *.s3-accelerate.amazonaws.com
    const s3Pattern = /(^|\.)(s3|s3-[a-z0-9-]+|s3\.[a-z0-9-]+|s3-accelerate)(\.dualstack)?\.amazonaws\.com$/i;
    const s3ChinaPattern = /(^|\.)(s3|s3-[a-z0-9-]+|s3\.[a-z0-9-]+|s3-accelerate)(\.dualstack)?\.amazonaws\.com\.cn$/i;
    return s3Pattern.test(host) || s3ChinaPattern.test(host);
}

export function isAllowedUploadTarget(rawUrl) {
    if (typeof rawUrl !== 'string' || rawUrl.length > 2048) return false;

    let parsed;
    try {
        parsed = new URL(rawUrl);
    } catch {
        return false;
    }

    if (parsed.protocol !== 'https:') return false;
    if (parsed.username || parsed.password) return false;
    if (!isAllowedS3Host(parsed.hostname)) return false;

    return true;
}

export function issueUploadProxyToken(targetUrl) {
    if (!isAllowedUploadTarget(targetUrl)) {
        throw new Error('Refusing to issue upload token for an invalid target URL');
    }

    const payload = {
        u: targetUrl,
        exp: Date.now() + TOKEN_TTL_MS,
    };

    const payloadB64 = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
    const sig = sign(payloadB64);
    return `${payloadB64}.${sig}`;
}

export function parseUploadProxyToken(token) {
    if (typeof token !== 'string') return null;

    const parts = token.split('.');
    if (parts.length !== 2) return null;

    const [payloadB64, sig] = parts;
    const expectedSig = sign(payloadB64);

    const sigBuf = Buffer.from(sig, 'utf8');
    const expectedSigBuf = Buffer.from(expectedSig, 'utf8');
    if (sigBuf.length !== expectedSigBuf.length) return null;
    if (!timingSafeEqual(sigBuf, expectedSigBuf)) return null;

    const payloadJson = Buffer.from(payloadB64, 'base64url').toString('utf8');
    const payload = safeJsonParse(payloadJson);
    if (!payload || typeof payload.u !== 'string' || typeof payload.exp !== 'number') return null;
    if (Date.now() > payload.exp) return null;
    if (!isAllowedUploadTarget(payload.u)) return null;

    return payload.u;
}

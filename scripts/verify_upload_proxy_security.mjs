import assert from 'node:assert/strict';
import {
    isAllowedUploadTarget,
    issueUploadProxyToken,
    parseUploadProxyToken,
} from '../app/api/_utils/uploadProxyToken.js';

function expectAllowed(url) {
    assert.equal(isAllowedUploadTarget(url), true, `Expected allowed URL: ${url}`);
}

function expectBlocked(url) {
    assert.equal(isAllowedUploadTarget(url), false, `Expected blocked URL: ${url}`);
}

// Expected valid S3 endpoint patterns.
expectAllowed('https://s3.amazonaws.com/my-bucket');
expectAllowed('https://my-bucket.s3.amazonaws.com/my/key');
expectAllowed('https://my-bucket.s3.us-east-1.amazonaws.com/my/key');
expectAllowed('https://my-bucket.s3-us-west-2.amazonaws.com/my/key');
expectAllowed('https://my-bucket.s3-accelerate.amazonaws.com/my/key');

// Must reject non-HTTPS and non-S3 destinations.
expectBlocked('http://my-bucket.s3.amazonaws.com/my/key');
expectBlocked('https://example.com/upload');
expectBlocked('https://169.254.169.254/latest/meta-data');
expectBlocked('https://localhost:9000/upload');
expectBlocked('https://my-bucket.s3.amazonaws.com.evil.com/upload');
expectBlocked('not-a-url');

// Signed token round-trip.
const target = 'https://my-bucket.s3.us-east-1.amazonaws.com/upload';
const token = issueUploadProxyToken(target);
assert.equal(typeof token, 'string');
assert.equal(parseUploadProxyToken(token), target, 'Expected valid token to decode original target');

// Tampering must fail.
assert.equal(parseUploadProxyToken(token + 'x'), null, 'Expected tampered token to fail validation');

const [payloadPart, sigPart] = token.split('.');
const tamperedPayload = Buffer.from(
    JSON.stringify({ u: 'https://example.com/upload', exp: Date.now() + 60_000 }),
    'utf8'
).toString('base64url');
assert.equal(parseUploadProxyToken(`${tamperedPayload}.${sigPart}`), null, 'Expected payload tampering to fail');

// Expired token must fail.
const payload = JSON.parse(Buffer.from(payloadPart, 'base64url').toString('utf8'));
payload.exp = Date.now() - 1;
const expiredPayloadPart = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
assert.equal(parseUploadProxyToken(`${expiredPayloadPart}.${sigPart}`), null, 'Expected expired token to fail');

// Legacy target field validation must still block SSRF/private targets.
assert.equal(isAllowedUploadTarget('http://169.254.169.254/latest/meta-data'), false);
assert.equal(isAllowedUploadTarget('https://localhost/upload'), false);

console.log('Upload proxy security checks passed.');

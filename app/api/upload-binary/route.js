import { NextResponse } from 'next/server';
import { isAllowedUploadTarget, parseUploadProxyToken } from '../_utils/uploadProxyToken';

export async function POST(request) {
    try {
        const formData = await request.formData();

        const uploadProxyToken = formData.get('x-proxy-upload-token');
        let targetUrl = parseUploadProxyToken(uploadProxyToken);

        // Backward-compatible path for older clients that still send the raw field.
        // Keep strict validation so this path cannot be abused as an open proxy.
        if (!targetUrl) {
            const legacyTarget = formData.get('x-proxy-target-url');
            if (typeof legacyTarget === 'string' && isAllowedUploadTarget(legacyTarget)) {
                targetUrl = legacyTarget;
            }
        }

        if (!targetUrl) {
            return NextResponse.json(
                { error: 'Invalid or missing upload proxy token/target URL' },
                { status: 400 }
            );
        }

        // Reconstruct the FormData for S3 (excluding our internal proxy marker)
        const s3FormData = new FormData();
        
        // S3 is very sensitive to field ordering. We must ensure 'file' is likely last
        // or at least that all signature fields come before what S3 expects.
        // The original library code appends 'file' last, so iterating should preserve that.
        for (const [key, value] of formData.entries()) {
            if (key !== 'x-proxy-target-url' && key !== 'x-proxy-upload-token') {
                s3FormData.append(key, value);
            }
        }

        // Perform the server-to-server POST to S3
        // This bypasses browser CORS/Preflight security entirely
        const s3Response = await fetch(targetUrl, {
            method: 'POST',
            body: s3FormData,
        });

        if (s3Response.ok || s3Response.status === 204) {
            return new Response(null, { status: 204 });
        } else {
            const errorText = await s3Response.text();
            console.error('S3 Proxy Error:', errorText);
            return new Response(errorText, { status: s3Response.status });
        }
    } catch (error) {
        console.error('Upload Proxy Exception:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

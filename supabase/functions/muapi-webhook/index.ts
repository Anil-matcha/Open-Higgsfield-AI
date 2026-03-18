import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://your-production-domain.com", // Replace with actual domain
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey, X-Webhook-Signature",
};

// Environment validation
const MUAPI_WEBHOOK_SECRET = Deno.env.get('MUAPI_WEBHOOK_SECRET');

if (!MUAPI_WEBHOOK_SECRET) {
  console.warn('[muapi-webhook] MUAPI_WEBHOOK_SECRET not set - webhook signature verification disabled');
}

interface WebhookPayload {
  request_id: string;
  status: string;
  output?: any;
  outputs?: string[];
  url?: string;
  error?: string;
  metadata?: Record<string, any>;
}

// Simple HMAC verification for webhook signatures
async function verifySignature(body: string, signature: string, secret: string): Promise<boolean> {
  if (!signature || !secret) return false;
  
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(body);
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
  const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  return signature === expectedSignature;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const signature = req.headers.get('x-webhook-signature');
    
    // Verify webhook signature if secret is configured
    if (MUAPI_WEBHOOK_SECRET) {
      if (!signature) {
        console.error('[muapi-webhook] Missing signature');
        return new Response(
          JSON.stringify({ error: 'Unauthorized - missing signature' }),
          {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
      
      const body = await req.text();
      
      // For HMAC-SHA256, the signature should be hex-encoded
      const isValid = await verifySignature(body, signature, MUAPI_WEBHOOK_SECRET);
      
      // Also allow simple secret match for backwards compatibility
      const isSimpleMatch = signature === MUAPI_WEBHOOK_SECRET;
      
      if (!isValid && !isSimpleMatch) {
        console.error('[muapi-webhook] Invalid signature');
        return new Response(
          JSON.stringify({ error: 'Unauthorized - invalid signature' }),
          {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
      
      // Re-parse JSON after verification
      var payload: WebhookPayload = JSON.parse(body);
    } else {
      payload = await req.json();
    }
    
    const { request_id, status, outputs, url, output, error, metadata } = payload;

    // Validate required fields
    if (!request_id || !status) {
      return new Response(
        JSON.stringify({ error: 'Invalid payload - missing required fields' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`[muapi-webhook] Received: request_id=${request_id}, status=${status}`);

    const outputUrl = outputs?.[0] || url || output?.url || null;

    console.log(`[muapi-webhook] Processing webhook for ${request_id}: ${status}`);

    if (outputUrl) {
      console.log(`[muapi-webhook] Output URL: ${outputUrl.slice(0, 50)}...`);
    }

    if (error) {
      console.error(`[muapi-webhook] Error reported: ${error}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Webhook received and logged',
        request_id
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('[muapi-webhook] Error:', error);

    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
